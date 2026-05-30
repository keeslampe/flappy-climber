import {
  MOVE_SPEED,
  OBSTACLE_INTERVAL,
  ROPE_MAX_SAMPLES,
  ROPE_SAMPLE_FRAMES,
  SCROLL_SPEED,
  WORLD_WIDTH,
} from './constants';
import { checkCollision } from './collision';
import { obstacleSpan, spawnIntervalWall, spawnObstacle } from './obstacles';
import { getGroundY } from './world';
import type { World } from './types';

interface TickOpts {
  viewportHeight: number;
  onFlash: () => void;
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
    const bottomBound = groundY - 12;
    const topBound = 38;
    world.climber.y =
      bottomBound - (world.tindeqSmoothedKilograms / 70) * (bottomBound - topBound) - 8;
  } else {
    if (world.keysUp) world.climber.y -= MOVE_SPEED;
    if (world.keysDown) world.climber.y += MOVE_SPEED;
  }
  world.climber.y = Math.max(30, Math.min(groundY - 20, world.climber.y));
  world.tindeqMoving =
    world.tindeqConnected && Math.abs(world.climber.y - previousY) > 0.3;

  const bottomBound = groundY - 12;
  const topBound = 38;
  world.weight = Math.max(
    0,
    Math.min(70, Math.round(((bottomBound - (world.climber.y + 8)) / (bottomBound - topBound)) * 70)),
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

  // Sequence engine
  tickSequence(world, groundY);

  // Scroll obstacles & score them when they pass
  for (const obstacle of world.obstacles) {
    obstacle.x -= SCROLL_SPEED;
    if (!obstacle.scored && obstacle.x + obstacleSpan(obstacle) < world.climber.x - 20) {
      obstacle.scored = true;
      world.score++;
      world.scorePops.push({
        x: world.climber.x + 20,
        y: world.climber.y - 30,
        life: 1,
        velocityY: -1,
        text: '+1',
      });
    }
  }
  world.obstacles = world.obstacles.filter(
    (obstacle) => obstacle.x + obstacleSpan(obstacle) > -60,
  );

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

  // Collision — full reset of score on hit, with a 90-frame invincibility window
  if (world.hitCooldown > 0) {
    world.hitCooldown--;
  } else if (checkCollision(world, groundY)) {
    world.score = 0;
    world.hitCooldown = 90;
    opts.onFlash();
    // chalk burst on hit
    for (let i = 0; i < 4; i++) {
      world.particles.push({
        x: world.climber.x,
        y: world.climber.y,
        velocityX: (Math.random() - 0.5) * 2.5,
        velocityY: -1.2 - Math.random() * 2,
        life: 1,
        decay: 0.055 + Math.random() * 0.04,
        radius: 2 + Math.random() * 4,
        color: '#d8d4c8',
      });
    }
  }
}

function tickSequence(world: World, groundY: number): void {
  const currentEvent = world.sequenceProgram[world.sequenceIndex];
  world.sequenceTargetHeight = currentEvent && currentEvent.type === 'on' ? currentEvent.height : 0;
  world.beamDisplayHeight += (world.sequenceTargetHeight - world.beamDisplayHeight) * 0.04;

  if (world.sequenceProgram.length === 0) {
    if (world.frameNumber % OBSTACLE_INTERVAL === 0) spawnObstacle(world);
    return;
  }
  if (!currentEvent) return; // sequence finished

  if (currentEvent.type === 'on' && !world.sequenceEventSpawned) {
    spawnIntervalWall(world, currentEvent.duration, currentEvent.height, groundY);
    world.sequenceEventSpawned = true;
  }

  if (world.seconds - world.sequenceEventStartSeconds >= currentEvent.duration) {
    world.sequenceIndex++;
    world.sequenceEventStartSeconds = world.seconds;
    world.sequenceEventSpawned = false;
    if (world.sequenceIndex >= world.sequenceProgram.length) {
      world.sequenceRepeatCount++;
      if (world.sequenceRepeatCount < world.sequenceRepeatMax) {
        world.sequenceIndex = 0;
        world.sequenceEventSpawned = false;
      }
    }
  }
}
