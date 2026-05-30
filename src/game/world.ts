import { GROUND_OFFSET_FROM_BOTTOM, W } from './constants';
import { rng } from './rng';
import type { Cloud, World } from './types';

function makeClouds(): Cloud[] {
  return Array.from({ length: 5 }, (_, i) => {
    const r2 = rng(i * 41 + 3);
    return { x: r2() * W, y: 36 + r2() * 120, w: 70 + r2() * 60, speed: 0.18 + r2() * 0.18 };
  });
}

export function getGroundY(viewportH: number): number {
  return viewportH - GROUND_OFFSET_FROM_BOTTOM;
}

export function createInitialWorld(viewportH: number): World {
  const GROUND_Y = getGroundY(viewportH);
  return {
    status: 'idle',
    score: 0,
    best: 0,
    seconds: 0,
    gameStartTime: 0,
    weight: 0,
    frameN: 0,
    bgScrollY: 0,
    groundOff: 0,
    flashTimer: 0,
    hitCooldown: 0,

    climber: { x: 90, y: GROUND_Y - 20, w: 30, h: 44, animT: 0 },
    obstacles: [],
    ropePoints: [],
    particles: [],
    scorePops: [],
    clouds: makeClouds(),

    seqProgram: [],
    seqRepeatMax: 1,
    seqIndex: 0,
    seqRepeatCount: 0,
    seqEventStartSec: 0,
    seqEventSpawned: false,
    seqTargetH: 0,
    beamDisplayH: 0,

    tindeqKg: 0,
    tindeqSmoothed: 0,
    tindeqMoving: false,
    tindeqConnected: false,

    keysUp: false,
    keysDown: false,
  };
}

export function resetForNewGame(world: World, viewportH: number): void {
  const GROUND_Y = getGroundY(viewportH);
  world.climber.x = 90;
  world.climber.y = GROUND_Y - 20;
  world.climber.animT = 0;
  world.obstacles.length = 0;
  world.ropePoints.length = 0;
  world.particles.length = 0;
  world.scorePops.length = 0;
  world.score = 0;
  world.seconds = 0;
  world.gameStartTime = performance.now();
  world.weight = 0;
  world.frameN = 0;
  world.bgScrollY = 0;
  world.groundOff = 0;
  world.hitCooldown = 0;
  world.seqIndex = 0;
  world.seqRepeatCount = 0;
  world.seqEventStartSec = 0;
  world.seqEventSpawned = false;
  world.seqTargetH = 0;
  world.beamDisplayH = 0;
  world.tindeqSmoothed = 0;
  world.tindeqMoving = false;
}
