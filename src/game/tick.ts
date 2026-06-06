import {
  ANCHOR_CLIP_HEIGHT_TOLERANCE,
  ANCHOR_CLIP_X_TOLERANCE,
  ANCHOR_SPAWN_INTERVAL,
  HEIGHT_SCALE_MAX,
  MOVE_SPEED,
  ROPE_MAX_SAMPLES,
  ROPE_SAMPLE_FRAMES,
  SCROLL_SPEED,
  WORLD_WIDTH,
} from './constants';
import { spawnAnchor } from './anchors';
import { getGroundY, heightForWaistY, waistYForHeight } from './world';
import type { World } from './types';

interface TickOpts {
  viewportHeight: number;
}

export function tickWorld(world: World, opts: TickOpts): void {
  if (world.status !== 'playing') return;
  const groundY = getGroundY(opts.viewportHeight);
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
    if (world.keysDown) world.climber.y += MOVE_SPEED;
  }
  world.climber.y = Math.max(30, Math.min(groundY - 20, world.climber.y));
  world.tindeqMoving =
    world.tindeqConnected && Math.abs(world.climber.y - previousY) > 0.3;

  world.weight = Math.max(
    0,
    Math.min(HEIGHT_SCALE_MAX, Math.round(heightForWaistY(world.climber.y + 8, groundY))),
  );

  // Animation timer advances when moving (faster) or on the ground (slower)
  const moving = world.keysUp || world.keysDown || world.tindeqMoving;
  const onGround = world.climber.y >= groundY - 60;
  if (moving) world.climber.animationTime += 0.17;
  else if (onGround) world.climber.animationTime += 0.08;

  // Chalk puff when actively moving
  if ((world.keysUp || world.keysDown) && world.frameNumber % 8 === 0) {
    for (let i = 0; i < 4; i++) {
      world.particles.push({
        x: world.climber.x - 8,
        y: world.climber.y + 12,
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
    if (anchor.state === 'hit') continue;
    const withinColumn =
      Math.abs(anchor.x - world.climber.x) <= ANCHOR_CLIP_X_TOLERANCE;
    if (withinColumn) {
      if (Math.abs(climberWaistY - anchor.waistY) <= ANCHOR_CLIP_HEIGHT_TOLERANCE) {
        anchor.state = 'hit';
        world.score++;
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
}

function tickSequence(world: World, viewportHeight: number): void {
  const currentEvent = world.sequenceProgram[world.sequenceIndex];
  world.sequenceTargetHeight = currentEvent && currentEvent.type === 'on' ? currentEvent.height : 0;
  world.beamDisplayHeight += (world.sequenceTargetHeight - world.beamDisplayHeight) * 0.04;

  if (world.sequenceProgram.length === 0) {
    if (world.frameNumber % ANCHOR_SPAWN_INTERVAL === 0) {
      world.anchors.push(spawnAnchor(world, viewportHeight));
    }
    return;
  }
  if (!currentEvent) return;

  if (world.frameNumber % ANCHOR_SPAWN_INTERVAL === 0) {
    world.anchors.push(spawnAnchor(world, viewportHeight));
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
