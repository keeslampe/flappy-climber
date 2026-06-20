import {
  ANCHOR_CLIP_HEIGHT_TOLERANCE,
  ANCHOR_CLIP_X_TOLERANCE,
  ANCHOR_SPACING_PIXELS,
  ANCHOR_SPAWN_INTERVAL,
  HAND_SWITCH_CUE_DELAY_SECONDS,
  HEIGHT_SCALE_MAX,
  MOVE_SPEED,
  ROPE_MAX_SAMPLES,
  ROPE_SAMPLE_FRAMES,
  SCROLL_SPEED,
  WORLD_WIDTH,
} from './constants';
import { spawnAnchor } from './anchors';
import { targetHeightAtDistance } from './mountainProfile';
import { getGroundY, heightForWaistY, waistYForHeight } from './world';
import type { World } from './types';

interface TickOpts {
  viewportHeight: number;
}

export function tickWorld(world: World, opts: TickOpts): void {
  if (world.status !== 'playing') return;
  const groundY = getGroundY(opts.viewportHeight);

  // Keep every clip's vertical position on the live height scale. The viewport — and
  // therefore groundY — changes mid-run on mobile (address bar show/hide, entering
  // fullscreen), so a waistY frozen at spawn would drift out of alignment with the
  // wall (which is recomputed live each frame). Re-project from the kept heightMeters.
  for (const anchor of world.anchors) {
    anchor.waistY = waistYForHeight(anchor.heightMeters, groundY);
  }

  world.frameNumber++;
  world.backgroundScrollY += SCROLL_SPEED;
  world.groundOffset += SCROLL_SPEED;
  world.seconds = Math.floor((performance.now() - world.gameStartTime) / 1000);

  // Climber Y — Tindeq input maps kg → height; keyboard moves by MOVE_SPEED.
  const previousY = world.climber.y;
  if (world.tindeqConnected) {
    world.tindeqSmoothedKilograms +=
      (world.tindeqKilograms - world.tindeqSmoothedKilograms) * 0.2;
    world.climber.y = waistYForHeight(world.tindeqSmoothedKilograms, groundY) - 8;
  } else {
    if (world.keysUp) world.climber.y -= MOVE_SPEED;
    // Bailing out drops faster than climbing up (eased toward the ground), with a
    // floor so it keeps moving near the bottom — quick but still controllable.
    if (world.keysDown) world.climber.y += Math.max(MOVE_SPEED, (groundY - world.climber.y) * 0.09);
  }
  world.climber.y = Math.max(30, Math.min(groundY - 24, world.climber.y));
  world.tindeqMoving =
    world.tindeqConnected && Math.abs(world.climber.y - previousY) > 0.3;

  // Track the climber's height (kg) over a short window so we can detect a fast
  // drop. 0.1s = 6 fixed steps; index 6 is the sample from ~0.1s ago.
  const currentHeightKilograms = heightForWaistY(world.climber.y + 8, groundY);
  world.heightHistoryKilograms.unshift(currentHeightKilograms);
  if (world.heightHistoryKilograms.length > 7) world.heightHistoryKilograms.length = 7;
  const heightTenthSecondAgo = world.heightHistoryKilograms[6] ?? currentHeightKilograms;
  const dropKilogramsPerTenthSecond = heightTenthSecondAgo - currentHeightKilograms;

  // Vertical motion (y decreases going up). Abseil ONLY on a fast drop — more than
  // 2kg lost in the last 0.1s; otherwise a descent reads as a normal hang.
  const deltaY = world.climber.y - previousY;
  if (world.keysUp || deltaY < -0.3) world.climberMotion = 'up';
  else if (dropKilogramsPerTenthSecond > 2) world.climberMotion = 'down';
  else world.climberMotion = 'none';

  // Chalk burst when landing on the ground after descending / abseiling.
  const groundThreshold = groundY - 60;
  if (world.climber.y >= groundThreshold && previousY < groundThreshold && deltaY > 0) {
    for (let i = 0; i < 12; i++) {
      world.particles.push({
        x: world.climber.x + (Math.random() - 0.5) * 24,
        y: groundY - 6,
        velocityX: (Math.random() - 0.5) * 3.4,
        velocityY: -1 - Math.random() * 2.6,
        life: 1,
        decay: 0.038 + Math.random() * 0.03,
        radius: 2.5 + Math.random() * 4.5,
        color: '#EDE9DD',
      });
    }
  }

  world.weight = Math.max(
    0,
    Math.min(HEIGHT_SCALE_MAX, Math.round(heightForWaistY(world.climber.y + 8, groundY))),
  );
  if (world.weight > world.peakWeight) world.peakWeight = world.weight;

  // Animation timer advances when moving (faster) or on the ground (slower)
  const moving = world.keysUp || world.keysDown || world.tindeqMoving;
  const onGround = world.climber.y >= groundY - 60;
  if (moving) world.climber.animationTime += 0.17;
  else if (onGround) world.climber.animationTime += 0.08;

  // Chalk puff while climbing up (from the chalk bucket on the right hip)
  if (world.climberMotion === 'up' && world.frameNumber % 8 === 0) {
    for (let i = 0; i < 4; i++) {
      world.particles.push({
        x: world.climber.x + 16,
        y: world.climber.y + 10,
        velocityX: (Math.random() - 0.5) * 2.5,
        velocityY: -1.2 - Math.random() * 2,
        life: 1,
        decay: 0.055 + Math.random() * 0.04,
        radius: 2 + Math.random() * 4,
        color: '#d8d4c8',
      });
    }
  }

  // Sequence engine — spawns anchors + eases the beam/wall crest height
  tickSequence(world, opts.viewportHeight);

  // Spawn the finish flag once it would scroll into view. Its x is pinned to the
  // finish scroll offset so it reaches the climber exactly at world.finishScroll.
  if (world.finishScroll > 0 && !world.finishSpawned) {
    const finishX = world.climber.x + (world.finishScroll - world.backgroundScrollY);
    if (finishX <= WORLD_WIDTH + 30) {
      world.anchors.push({
        x: finishX,
        heightMeters: 0,
        waistY: waistYForHeight(0, groundY),
        state: 'next',
        seed: 0,
        label: null,
        isFinish: true,
      });
      world.finishSpawned = true;
    }
  }

  // Promote the closest upcoming unclipped anchor to 'next'
  const upcomingAnchors = world.anchors.filter(
    (anchor) => anchor.state !== 'hit' && anchor.x >= world.climber.x,
  );
  upcomingAnchors.sort((anchorA, anchorB) => anchorA.x - anchorB.x);
  for (const anchor of world.anchors) {
    if (anchor.state === 'locked') anchor.state = 'locked';
  }
  if (upcomingAnchors.length > 0 && upcomingAnchors[0].state !== 'hit') {
    // Reset all locked, then promote the nearest one
    for (const anchor of world.anchors) {
      if (anchor.state === 'next') anchor.state = 'locked';
    }
    upcomingAnchors[0].state = 'next';
  }

  // Scroll anchors and detect clips
  const climberWaistY = world.climber.y + 8;
  for (const anchor of world.anchors) {
    anchor.x -= SCROLL_SPEED;
    if (anchor.isFinish) {
      // The finish flag isn't clippable — passing the climber ends the run.
      if (anchor.x <= world.climber.x) world.finishReached = true;
      continue;
    }
    if (anchor.state === 'hit') continue;
    const withinColumn =
      Math.abs(anchor.x - world.climber.x) <= ANCHOR_CLIP_X_TOLERANCE;
    if (withinColumn) {
      if (Math.abs(climberWaistY - anchor.waistY) <= ANCHOR_CLIP_HEIGHT_TOLERANCE) {
        anchor.state = 'hit';
        world.clipScore++;
        // No "CLIP!" pop for rest/ground clips (target height 0) — only real pulls.
        if (anchor.heightMeters > 0) {
          world.scorePops.push({
            x: world.climber.x + 18,
            y: climberWaistY - 28,
            life: 1,
            velocityY: -1,
            text: 'CLIP!',
          });
        }
      }
    }
  }
  world.anchors = world.anchors.filter((anchor) => anchor.x > -60);

  // Rope sampling — push waist y every N frames
  if (world.frameNumber % ROPE_SAMPLE_FRAMES === 0) {
    world.ropePoints.unshift(world.climber.y + 8);
    if (world.ropePoints.length > ROPE_MAX_SAMPLES) world.ropePoints.length = ROPE_MAX_SAMPLES;
  }

  // Clouds drift left and wrap
  for (const cloud of world.clouds) {
    cloud.x -= cloud.speed;
    if (cloud.x + cloud.width < -20) {
      cloud.x = WORLD_WIDTH + 30;
      cloud.y = 36 + Math.random() * 110;
    }
  }

  // Particles physics
  for (const particle of world.particles) {
    particle.x += particle.velocityX;
    particle.y += particle.velocityY;
    particle.velocityY += 0.06;
    particle.life -= particle.decay;
  }
  world.particles = world.particles.filter((particle) => particle.life > 0);

  // Score pops physics
  for (const scorePop of world.scorePops) {
    scorePop.y += scorePop.velocityY;
    scorePop.life -= 0.024;
  }
  world.scorePops = world.scorePops.filter((scorePop) => scorePop.life > 0);

  // Hand-switch scream bubble fades out (~1.4s).
  if (world.handSwitchCue) {
    world.handSwitchCue.life -= 0.012;
    if (world.handSwitchCue.life <= 0) world.handSwitchCue = null;
  }
}

function tickSequence(world: World, viewportHeight: number): void {
  const currentEvent = world.sequenceProgram[world.sequenceIndex];
  world.sequenceTargetHeight = currentEvent && currentEvent.type === 'on' ? currentEvent.height : 0;
  world.beamDisplayHeight += (world.sequenceTargetHeight - world.beamDisplayHeight) * 0.04;

  // Surface the current pull's rep/set on the HUD. During a rest we hold the last pull's
  // numbers (the rep just completed) rather than resetting to 0.
  if (currentEvent && currentEvent.type === 'on') {
    world.currentRep = currentEvent.repNumber ?? world.currentRep;
    world.currentSet = currentEvent.setNumber ?? world.currentSet;
  }

  // Fire the hand-switch cue a fixed delay into the rest that precedes a hand change.
  // The elapsed time is read off the scroll clock (same one events advance on). The
  // currentHand !== switchTo comparison makes this idempotent — it fires exactly once.
  if (currentEvent && currentEvent.type === 'rest' && currentEvent.switchTo) {
    const elapsedPixels = world.backgroundScrollY - world.sequenceEventStartScroll;
    const cueThresholdPixels = HAND_SWITCH_CUE_DELAY_SECONDS * 60 * SCROLL_SPEED;
    if (elapsedPixels >= cueThresholdPixels && world.currentHand !== currentEvent.switchTo) {
      world.currentHand = currentEvent.switchTo;
      world.handSwitchCue = { hand: currentEvent.switchTo, life: 1 };
    }
  }
  // Safety net: if a pull starts on a hand the indicator hasn't caught up to (a rest
  // shorter than the cue delay never fired), correct it now — silently, no bubble.
  if (currentEvent && currentEvent.type === 'on' && currentEvent.hand && world.currentHand !== currentEvent.hand) {
    world.currentHand = currentEvent.hand;
  }

  if (world.sequenceProgram.length === 0) {
    if (world.frameNumber % ANCHOR_SPAWN_INTERVAL === 0) {
      world.anchors.push(spawnAnchor(world, viewportHeight));
    }
    return;
  }
  if (!currentEvent) return;

  // Spawn clips, but stop once a freshly-spawned clip would reach the climber at or
  // after the last pull ends — that keeps the final rest before the flag empty.
  if (world.frameNumber % ANCHOR_SPAWN_INTERVAL === 0) {
    const pixelsAhead = WORLD_WIDTH + 30 - world.climber.x;
    const arrivalScroll = world.backgroundScrollY + pixelsAhead;
    if (world.lastPullScroll === 0 || arrivalScroll < world.lastPullScroll) {
      world.anchors.push(spawnAnchor(world, viewportHeight));
    }
  }

  // Stepping-stone: halfway between regular spawns, drop one clip at half the pull
  // height between the last ground clip and the first clip of a pull — so you step up
  // to the target instead of jumping straight from the ground.
  if (world.frameNumber % ANCHOR_SPAWN_INTERVAL === ANCHOR_SPAWN_INTERVAL / 2) {
    const pixelsAhead = WORLD_WIDTH + 30 - world.climber.x;
    const arrivalScroll = world.backgroundScrollY + pixelsAhead;
    const halfSpacing = ANCHOR_SPACING_PIXELS / 2;
    const heightAhead = targetHeightAtDistance(world, pixelsAhead + halfSpacing);
    const heightBehind = targetHeightAtDistance(world, pixelsAhead - halfSpacing);
    const inBounds = world.lastPullScroll === 0 || arrivalScroll < world.lastPullScroll;
    if (inBounds && heightAhead > 0 && heightBehind === 0) {
      const groundY = getGroundY(viewportHeight);
      const stepHeight = heightAhead / 2;
      world.anchors.push({
        x: WORLD_WIDTH + 30,
        heightMeters: stepHeight,
        waistY: waistYForHeight(stepHeight, groundY),
        state: 'locked',
        seed: Math.floor(Math.random() * 10000),
        label: null,
        isFinish: false,
      });
    }
  }

  // Advance events on the continuous scroll clock so the wall stays in lockstep
  // with its own scrolling. Each event spans duration * 60 * SCROLL_SPEED pixels.
  const eventScrollSpan = currentEvent.duration * 60 * SCROLL_SPEED;
  if (world.backgroundScrollY - world.sequenceEventStartScroll >= eventScrollSpan) {
    world.sequenceEventStartScroll += eventScrollSpan; // additive — no per-event drift
    world.sequenceIndex++;
    if (world.sequenceIndex >= world.sequenceProgram.length) {
      world.sequenceRepeatCount++;
      if (world.sequenceRepeatCount < world.sequenceRepeatMax) {
        world.sequenceIndex = 0;
      }
    }
  }
}
