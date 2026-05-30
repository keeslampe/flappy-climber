import { GROUND_OFFSET_FROM_BOTTOM, WORLD_WIDTH } from './constants';
import { createRandom } from './randomNumberGenerator';
import type { Cloud, World } from './types';

function makeClouds(): Cloud[] {
  return Array.from({ length: 5 }, (_, i) => {
    const random = createRandom(i * 41 + 3);
    return {
      x: random() * WORLD_WIDTH,
      y: 36 + random() * 120,
      width: 70 + random() * 60,
      speed: 0.18 + random() * 0.18,
    };
  });
}

export function getGroundY(viewportHeight: number): number {
  return viewportHeight - GROUND_OFFSET_FROM_BOTTOM;
}

export function createInitialWorld(viewportHeight: number): World {
  const groundY = getGroundY(viewportHeight);
  return {
    status: 'idle',
    score: 0,
    best: 0,
    seconds: 0,
    gameStartTime: 0,
    weight: 0,
    frameNumber: 0,
    backgroundScrollY: 0,
    groundOffset: 0,
    flashTimer: 0,
    hitCooldown: 0,

    climber: { x: 90, y: groundY - 20, width: 30, height: 44, animationTime: 0 },
    obstacles: [],
    ropePoints: [],
    particles: [],
    scorePops: [],
    clouds: makeClouds(),

    sequenceProgram: [],
    sequenceRepeatMax: 1,
    sequenceIndex: 0,
    sequenceRepeatCount: 0,
    sequenceEventStartSeconds: 0,
    sequenceEventSpawned: false,
    sequenceTargetHeight: 0,
    beamDisplayHeight: 0,

    tindeqKilograms: 0,
    tindeqSmoothedKilograms: 0,
    tindeqMoving: false,
    tindeqConnected: false,

    keysUp: false,
    keysDown: false,
  };
}

export function resetForNewGame(world: World, viewportHeight: number): void {
  const groundY = getGroundY(viewportHeight);
  world.climber.x = 90;
  world.climber.y = groundY - 20;
  world.climber.animationTime = 0;
  world.obstacles.length = 0;
  world.ropePoints.length = 0;
  world.particles.length = 0;
  world.scorePops.length = 0;
  world.score = 0;
  world.seconds = 0;
  world.gameStartTime = performance.now();
  world.weight = 0;
  world.frameNumber = 0;
  world.backgroundScrollY = 0;
  world.groundOffset = 0;
  world.hitCooldown = 0;
  world.sequenceIndex = 0;
  world.sequenceRepeatCount = 0;
  world.sequenceEventStartSeconds = 0;
  world.sequenceEventSpawned = false;
  world.sequenceTargetHeight = 0;
  world.beamDisplayHeight = 0;
  world.tindeqSmoothedKilograms = 0;
  world.tindeqMoving = false;
}
