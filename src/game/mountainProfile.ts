import {
  SCROLL_SPEED,
  WALL_FADE_UNITS,
  WALL_HEADROOM_PIXELS,
  WALL_PEAK_CEILING_KG,
} from './constants';
import { createRandom } from './randomNumberGenerator';
import { waistYForHeight } from './world';
import type { World } from './types';

// Returns the workout target height in metres at a given pixel distance ahead
// of the climber. Walks the sequence program forward, converting each event's
// duration to pixels (duration * 60fps * SCROLL_SPEED). Loops via sequenceRepeatMax.
// Falls back to a gentle seeded rolling crest when no program is loaded.
export function targetHeightAtDistance(world: World, pixelsAhead: number): number {
  const program = world.sequenceProgram;

  if (program.length === 0) {
    // No DSL: gentle rolling crest keyed on world distance so it scrolls with terrain.
    const distance = world.backgroundScrollY + pixelsAhead;
    const random = createRandom(Math.floor(distance / 80));
    return 8 + random() * 14;
  }

  const pixelsPerEvent = program.map(
    (event) => event.duration * 60 * SCROLL_SPEED,
  );
  const totalProgramPixels = pixelsPerEvent.reduce((sum, pixels) => sum + pixels, 0);

  // Determine how many pixels into the program the climber currently is,
  // then add pixelsAhead to look forward.
  const currentEvent = world.sequenceProgram[world.sequenceIndex];
  if (!currentEvent) return 0;

  // Pixels elapsed within the current event. Measured from the continuous scroll
  // position (not integer seconds) so the crest glides instead of snapping ~90px
  // once per second.
  const elapsedInEvent = world.backgroundScrollY - world.sequenceEventStartScroll;
  let pixelsIntoProgram = elapsedInEvent;
  for (let index = 0; index < world.sequenceIndex; index++) {
    pixelsIntoProgram += pixelsPerEvent[index];
  }

  const totalRepeatPixels = totalProgramPixels * world.sequenceRepeatMax;
  const lookAhead = Math.min(pixelsIntoProgram + pixelsAhead, totalRepeatPixels - 1);

  // Walk program forward to find which event covers the look-ahead position.
  let cursor = 0;
  for (let repeat = 0; repeat < world.sequenceRepeatMax; repeat++) {
    for (let eventIndex = 0; eventIndex < program.length; eventIndex++) {
      const eventPixels = pixelsPerEvent[eventIndex];
      if (lookAhead < cursor + eventPixels) {
        const event = program[eventIndex];
        return event.type === 'on' ? event.height : 0;
      }
      cursor += eventPixels;
    }
  }

  return 0;
}

// Seconds remaining in the workout event covering a look-ahead position, rounded
// up so the current second counts. Used to give each clip a FIXED label at spawn
// time — e.g. an 8s pull produces clips labelled 8,7,…,1. Returns 0 when there is
// no program loaded. Mirrors the forward walk in targetHeightAtDistance.
export function eventSecondsRemainingAtDistance(world: World, pixelsAhead: number): number {
  const program = world.sequenceProgram;
  if (program.length === 0) return 0;

  const pixelsPerEvent = program.map((event) => event.duration * 60 * SCROLL_SPEED);
  const totalProgramPixels = pixelsPerEvent.reduce((sum, pixels) => sum + pixels, 0);
  if (totalProgramPixels <= 0) return 0;

  const currentEvent = world.sequenceProgram[world.sequenceIndex];
  if (!currentEvent) return 0;

  let pixelsIntoProgram = world.backgroundScrollY - world.sequenceEventStartScroll;
  for (let index = 0; index < world.sequenceIndex; index++) {
    pixelsIntoProgram += pixelsPerEvent[index];
  }
  const totalRepeatPixels = totalProgramPixels * world.sequenceRepeatMax;
  const lookAhead = Math.min(pixelsIntoProgram + pixelsAhead, totalRepeatPixels - 1);

  let cursor = 0;
  for (let repeat = 0; repeat < world.sequenceRepeatMax; repeat++) {
    for (let eventIndex = 0; eventIndex < program.length; eventIndex++) {
      const eventPixels = pixelsPerEvent[eventIndex];
      if (lookAhead < cursor + eventPixels) {
        const pixelsRemaining = cursor + eventPixels - lookAhead;
        return Math.max(1, Math.ceil(pixelsRemaining / (60 * SCROLL_SPEED)));
      }
      cursor += eventPixels;
    }
  }
  return 0;
}

// Sharp program target height (metres) at a look-ahead distance in pixels, where
// negative = behind the climber (past) and positive = ahead (upcoming). Wraps
// across identical repeats and returns 0 outside the program's start/end bounds.
// Used by the debug route line to show the whole target staircase over time.
export function sharpTargetAtDistance(world: World, pixelsAhead: number): number {
  const program = world.sequenceProgram;
  if (program.length === 0) return 0;

  const pixelsPerEvent = program.map((event) => event.duration * 60 * SCROLL_SPEED);
  const totalProgramPixels = pixelsPerEvent.reduce((sum, pixels) => sum + pixels, 0);
  if (totalProgramPixels <= 0) return 0;

  // Position within the current iteration, then make it absolute across repeats.
  let withinIteration = world.backgroundScrollY - world.sequenceEventStartScroll;
  for (let index = 0; index < world.sequenceIndex; index++) {
    withinIteration += pixelsPerEvent[index];
  }
  const absolute =
    world.sequenceRepeatCount * totalProgramPixels + withinIteration + pixelsAhead;

  // Before the program starts or after it ends → ground level.
  if (absolute < 0 || absolute >= totalProgramPixels * world.sequenceRepeatMax) return 0;

  const cyclePosition = ((absolute % totalProgramPixels) + totalProgramPixels) % totalProgramPixels;
  let cursor = 0;
  for (let index = 0; index < program.length; index++) {
    if (cyclePosition < cursor + pixelsPerEvent[index]) {
      const event = program[index];
      return event.type === 'on' ? event.height : 0;
    }
    cursor += pixelsPerEvent[index];
  }
  return 0;
}

// Smooth value-noise: interpolate seeded random values at integer cells along a
// terrain-locked axis so the result rolls smoothly and scrolls with the wall.
// Returns 0..1.
function rollingNoise(position: number, cellSize: number, seedOffset: number): number {
  const scaled = position / cellSize;
  const cell = Math.floor(scaled);
  const fraction = scaled - cell;
  const valueA = createRandom(cell + seedOffset)();
  const valueB = createRandom(cell + 1 + seedOffset)();
  const smooth = fraction * fraction * (3 - 2 * fraction); // smoothstep
  return valueA + (valueB - valueA) * smooth;
}

// Horizontal distances (scroll px) over which the crest ramps. The leading (rise)
// edge is wide so the mountain starts gradually; the trailing (fall) edge is short
// so the rock drops promptly once the last clip of a pull has passed.
const CREST_RISE_PIXELS = 120;
const CREST_FALL_PIXELS = 44;

// How far past the pull's end the full-height plateau is held — just enough to
// keep rock behind the boundary clip (which sits at the pull height), then the
// rock descends right after it.
const CREST_PLATEAU_TAIL_PIXELS = 34;

function smoothstep(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
}

// Shortest distance from `position` to a single point on a circle of length `total`.
function circularDistance(position: number, point: number, total: number): number {
  const raw = Math.abs(position - point);
  return Math.min(raw, total - raw);
}

// Smooth crest base height in metres. Each 'on' plateau holds FULL height across
// the whole plateau (so every elevated clip stays cleared), ramps UP gradually
// before it (wide rise) and DOWN promptly just after it (short fall). The result
// is continuous in the scroll position, so the crest glides — no flicker — instead
// of jumping as the wall scrolls.
function crestBaseMeters(world: World, pixelsAhead: number): number {
  const program = world.sequenceProgram;

  if (program.length === 0) {
    // No DSL: gentle smooth rolling crest keyed on terrain distance.
    const distance = world.backgroundScrollY + pixelsAhead;
    return 8 + rollingNoise(distance, 180, 4242) * 12;
  }

  const pixelsPerEvent = program.map((event) => event.duration * 60 * SCROLL_SPEED);
  const totalProgramPixels = pixelsPerEvent.reduce((sum, pixels) => sum + pixels, 0);
  if (totalProgramPixels <= 0) return 0;

  // Absolute look-ahead in program-pixel space (same basis as the sharp walk),
  // reduced into a single program cycle since repeats are identical.
  let pixelsIntoProgram = world.backgroundScrollY - world.sequenceEventStartScroll;
  for (let index = 0; index < world.sequenceIndex; index++) {
    pixelsIntoProgram += pixelsPerEvent[index];
  }
  const lookAhead = pixelsIntoProgram + pixelsAhead;
  const cyclePosition =
    ((lookAhead % totalProgramPixels) + totalProgramPixels) % totalProgramPixels;

  // Envelope = max over each 'on' event of its height shaped by a smoothstep skirt
  // (1 across the plateau, ramping to 0 outside — wide before, short after).
  let base = 0;
  let cursor = 0;
  for (let index = 0; index < program.length; index++) {
    const start = cursor;
    const end = cursor + pixelsPerEvent[index];
    cursor = end;
    const event = program[index];
    const height = event.type === 'on' ? event.height : 0;
    if (height <= 0) continue;
    // Hold the plateau just past the pull's end so the boundary clip (lifted to
    // the pull height in spawnAnchor) keeps rock behind it.
    const effectiveEnd = end + CREST_PLATEAU_TAIL_PIXELS;

    let skirt: number;
    if (cyclePosition >= start && cyclePosition <= effectiveEnd) {
      skirt = 1;
    } else {
      const distanceToStart = circularDistance(cyclePosition, start, totalProgramPixels);
      const distanceToEnd = circularDistance(cyclePosition, effectiveEnd, totalProgramPixels);
      skirt =
        distanceToStart <= distanceToEnd
          ? 1 - smoothstep(distanceToStart / CREST_RISE_PIXELS) // approaching → gradual rise
          : 1 - smoothstep(distanceToEnd / CREST_FALL_PIXELS); // leaving → prompt fall
    }
    base = Math.max(base, height * skirt);
  }
  return base;
}

// Returns crest points across the visible world width for rendering.
// Each point's y is the pixel y of the mountain surface at that x.
//
// The crest always sits a guaranteed headroom ABOVE the clip target height, with
// rolling procedural peaks layered on top. This keeps the foreground mountain
// visible behind every elevated clip (clips never poke above the ridge) while the
// peaks add height and variation purely additively.
export function sampleWallCrest(
  world: World,
  worldWidth: number,
  groundY: number,
  sampleCount: number,
): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  for (let sampleIndex = 0; sampleIndex <= sampleCount; sampleIndex++) {
    const x = (sampleIndex / sampleCount) * worldWidth;
    const pixelsAhead = x - world.climber.x;

    // Smooth envelope of the workout target (full height across each plateau,
    // ramping up gradually before it and dropping into the rest valley after).
    const baseUnits = crestBaseMeters(world, pixelsAhead);

    // Terrain-locked position so peaks travel with the wall, not the viewport. 0..1.
    const terrainPosition = world.backgroundScrollY + x;
    const noise =
      0.55 * rollingNoise(terrainPosition, 96, 0) +
      0.30 * rollingNoise(terrainPosition, 150, 1000) +
      0.15 * rollingNoise(terrainPosition, 38, 7000);

    // Crest height in kg: rolling peaks add variation that scales with the plateau
    // height, so it rises gradually with the start and tapers smoothly back down
    // with the descent (continuous → no flicker), reaching as high as
    // WALL_PEAK_CEILING_KG over the tallest pulls.
    const peakKg = noise * baseUnits;
    const crestKg = Math.min(WALL_PEAK_CEILING_KG, baseUnits + peakKg);

    // Fade the whole wall down to the ground line as the target vanishes: a 0kg
    // (rest) target shows no mountain — just the ground. Presence blends the crest.
    const presence = smoothstep(baseUnits / WALL_FADE_UNITS);
    const wallTopY = waistYForHeight(crestKg, groundY) - WALL_HEADROOM_PIXELS;
    const rawY = groundY + (wallTopY - groundY) * presence;
    const y = Math.max(24, Math.min(groundY, rawY));
    points.push({ x, y });
  }
  return points;
}
