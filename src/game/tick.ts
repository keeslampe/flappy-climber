import {
  MOVE_SPEED,
  OBS_INTERVAL,
  ROPE_MAX_SAMPLES,
  ROPE_SAMPLE_FRAMES,
  SCROLL_SPEED,
  W,
} from './constants';
import { checkCollision } from './collision';
import { obstacleSpan, spawnIntervalWall, spawnObstacle } from './obstacles';
import { getGroundY } from './world';
import type { World } from './types';

interface TickOpts {
  viewportH: number;
  onFlash: () => void;
}

export function tickWorld(world: World, opts: TickOpts): void {
  if (world.status !== 'playing') return;
  const GROUND_Y = getGroundY(opts.viewportH);
  world.frameN++;
  world.bgScrollY += SCROLL_SPEED;
  world.groundOff += SCROLL_SPEED;
  world.seconds = Math.floor((performance.now() - world.gameStartTime) / 1000);

  // Climber Y — Tindeq input maps kg → height; keyboard moves by MOVE_SPEED.
  const prevY = world.climber.y;
  if (world.tindeqConnected) {
    world.tindeqSmoothed += (world.tindeqKg - world.tindeqSmoothed) * 0.2;
    const bBot = GROUND_Y - 12;
    const bTop = 38;
    world.climber.y = bBot - (world.tindeqSmoothed / 70) * (bBot - bTop) - 8;
  } else {
    if (world.keysUp) world.climber.y -= MOVE_SPEED;
    if (world.keysDown) world.climber.y += MOVE_SPEED;
  }
  world.climber.y = Math.max(30, Math.min(GROUND_Y - 20, world.climber.y));
  world.tindeqMoving = world.tindeqConnected && Math.abs(world.climber.y - prevY) > 0.3;

  const bBot = GROUND_Y - 12;
  const bTop = 38;
  world.weight = Math.max(
    0,
    Math.min(70, Math.round(((bBot - (world.climber.y + 8)) / (bBot - bTop)) * 70)),
  );

  // Animation timer advances when moving (faster) or on the ground (slower)
  const moving = world.keysUp || world.keysDown || world.tindeqMoving;
  const onGround = world.climber.y >= GROUND_Y - 60;
  if (moving) world.climber.animT += 0.17;
  else if (onGround) world.climber.animT += 0.08;

  // Chalk puff when actively moving
  if ((world.keysUp || world.keysDown) && world.frameN % 8 === 0) {
    for (let i = 0; i < 4; i++) {
      world.particles.push({
        x: world.climber.x - 8,
        y: world.climber.y + 12,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -1.2 - Math.random() * 2,
        life: 1,
        decay: 0.055 + Math.random() * 0.04,
        r: 2 + Math.random() * 4,
        color: '#d8d4c8',
      });
    }
  }

  // Sequence engine
  tickSequence(world, GROUND_Y);

  // Scroll obstacles & score them when they pass
  for (const obs of world.obstacles) {
    obs.x -= SCROLL_SPEED;
    if (!obs.scored && obs.x + obstacleSpan(obs) < world.climber.x - 20) {
      obs.scored = true;
      world.score++;
      world.scorePops.push({ x: world.climber.x + 20, y: world.climber.y - 30, life: 1, vy: -1, txt: '+1' });
    }
  }
  world.obstacles = world.obstacles.filter((o) => o.x + obstacleSpan(o) > -60);

  // Rope sampling — push waist y every N frames
  if (world.frameN % ROPE_SAMPLE_FRAMES === 0) {
    world.ropePoints.unshift(world.climber.y + 8);
    if (world.ropePoints.length > ROPE_MAX_SAMPLES) world.ropePoints.length = ROPE_MAX_SAMPLES;
  }

  // Clouds drift left and wrap
  for (const c of world.clouds) {
    c.x -= c.speed;
    if (c.x + c.w < -20) {
      c.x = W + 30;
      c.y = 36 + Math.random() * 110;
    }
  }

  // Particles physics
  for (const p of world.particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.06;
    p.life -= p.decay;
  }
  world.particles = world.particles.filter((p) => p.life > 0);

  // Score pops physics
  for (const p of world.scorePops) {
    p.y += p.vy;
    p.life -= 0.024;
  }
  world.scorePops = world.scorePops.filter((p) => p.life > 0);

  // Collision — full reset of score on hit, with a 90-frame invincibility window
  if (world.hitCooldown > 0) {
    world.hitCooldown--;
  } else if (checkCollision(world, GROUND_Y)) {
    world.score = 0;
    world.hitCooldown = 90;
    opts.onFlash();
    // chalk burst on hit
    for (let i = 0; i < 4; i++) {
      world.particles.push({
        x: world.climber.x,
        y: world.climber.y,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -1.2 - Math.random() * 2,
        life: 1,
        decay: 0.055 + Math.random() * 0.04,
        r: 2 + Math.random() * 4,
        color: '#d8d4c8',
      });
    }
  }
}

function tickSequence(world: World, groundY: number): void {
  const cur = world.seqProgram[world.seqIndex];
  world.seqTargetH = cur && cur.type === 'on' ? cur.height : 0;
  world.beamDisplayH += (world.seqTargetH - world.beamDisplayH) * 0.04;

  if (world.seqProgram.length === 0) {
    if (world.frameN % OBS_INTERVAL === 0) spawnObstacle(world);
    return;
  }
  if (!cur) return; // sequence finished

  if (cur.type === 'on' && !world.seqEventSpawned) {
    spawnIntervalWall(world, cur.duration, cur.height, groundY);
    world.seqEventSpawned = true;
  }

  if (world.seconds - world.seqEventStartSec >= cur.duration) {
    world.seqIndex++;
    world.seqEventStartSec = world.seconds;
    world.seqEventSpawned = false;
    if (world.seqIndex >= world.seqProgram.length) {
      world.seqRepeatCount++;
      if (world.seqRepeatCount < world.seqRepeatMax) {
        world.seqIndex = 0;
        world.seqEventSpawned = false;
      }
    }
  }
}

