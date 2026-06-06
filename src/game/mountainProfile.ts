import {
  SCROLL_SPEED,
  WALL_HEADROOM_PIXELS,
  WALL_PEAK_AMPLITUDE_PIXELS,
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

// Horizontal distance (in scroll pixels) over which the crest slopes down from a
// plateau into the rest valley. Wider = gentler mountainside.
const CREST_RAMP_PIXELS = 72;

function smoothstep(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
}

// Distance from `position` to the interval [start, end] on a circle of length
// `total` (0 when inside the interval). Used so the program's repeats wrap.
function circularDistanceToInterval(
  position: number,
  start: number,
  end: number,
  total: number,
): number {
  if (position >= start && position <= end) return 0;
  const toStart = Math.abs(position - start);
  const toEnd = Math.abs(position - end);
  return Math.min(toStart, total - toStart, toEnd, total - toEnd);
}

// Smooth crest base height in metres. Unlike the sharp `targetHeightAtDistance`,
// this shapes each 'on' plateau into an envelope that holds FULL height across the
// whole plateau (so every elevated clip on it stays cleared) and then smoothsteps
// down to the rest level OUTSIDE the plateau. Because it is continuous in the
// scroll position, the crest glides instead of stepping as the wall scrolls.
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

  // Envelope = max over each 'on' event of (height shaped by a smoothstep skirt).
  let base = 0;
  let cursor = 0;
  for (let index = 0; index < program.length; index++) {
    const start = cursor;
    const end = cursor + pixelsPerEvent[index];
    cursor = end;
    const event = program[index];
    const height = event.type === 'on' ? event.height : 0;
    if (height <= 0) continue;
    const distanceOutside = circularDistanceToInterval(
      cyclePosition,
      start,
      end,
      totalProgramPixels,
    );
    const skirt = 1 - smoothstep(distanceOutside / CREST_RAMP_PIXELS); // 1 inside → 0 over ramp
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
    // smoothstepping down into the rest valley), mapped to the SAME waist y the
    // clips and the target marker use.
    const baseUnits = crestBaseMeters(world, pixelsAhead);
    const baseY = waistYForHeight(baseUnits, groundY);

    // Terrain-locked position so peaks travel with the wall, not the viewport.
    const terrainPosition = world.backgroundScrollY + x;

    // Multi-octave rolling peaks (all additive, 0..WALL_PEAK_AMPLITUDE_PIXELS),
    // lifting the crest upward (smaller y) above the clip line plus a fixed headroom.
    const peakPixels =
      WALL_PEAK_AMPLITUDE_PIXELS *
      (0.55 * rollingNoise(terrainPosition, 96, 0) +
        0.30 * rollingNoise(terrainPosition, 232, 1000) +
        0.15 * rollingNoise(terrainPosition, 30, 7000));

    const rawY = baseY - WALL_HEADROOM_PIXELS - peakPixels;
    const y = Math.max(24, Math.min(groundY - 6, rawY));
    points.push({ x, y });
  }
  return points;
}
