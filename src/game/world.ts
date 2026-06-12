import {
  GROUND_OFFSET_FROM_BOTTOM,
  HEIGHT_METER_BOTTOM_OFFSET,
  HEIGHT_METER_TOP_OFFSET,
  HEIGHT_SCALE_MAX,
  WORLD_WIDTH,
} from './constants';
import { createRandom } from './randomNumberGenerator';
import type { Anchor, Cloud, World } from './types';

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

// The single source of truth mapping a program height value (0..HEIGHT_SCALE_MAX)
// to the climber's waist y in world pixels. Used by the climber's force-driven
// position, the height ruler, the target marker, and the bolt anchors so a given
// height lines up everywhere on screen.
export function waistYForHeight(heightValue: number, groundY: number): number {
  const bottomBound = groundY - HEIGHT_METER_BOTTOM_OFFSET;
  const topBound = HEIGHT_METER_TOP_OFFSET;
  return bottomBound - (heightValue / HEIGHT_SCALE_MAX) * (bottomBound - topBound);
}

// Inverse of waistYForHeight: the height value (0..HEIGHT_SCALE_MAX) at a waist y.
export function heightForWaistY(waistY: number, groundY: number): number {
  const bottomBound = groundY - HEIGHT_METER_BOTTOM_OFFSET;
  const topBound = HEIGHT_METER_TOP_OFFSET;
  return ((bottomBound - waistY) / (bottomBound - topBound)) * HEIGHT_SCALE_MAX;
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

    climber: { x: 90, y: groundY - 20, width: 30, height: 44, animationTime: 0 },
    climberMotion: 'none',
    heightHistoryKilograms: [],
    anchors: [] as Anchor[],
    ropePoints: [],
    particles: [],
    scorePops: [],
    clouds: makeClouds(),

    sequenceProgram: [],
    sequenceRepeatMax: 1,
    sequenceIndex: 0,
    sequenceRepeatCount: 0,
    sequenceEventStartScroll: 0,
    sequenceEventSpawned: false,
    sequenceTargetHeight: 0,
    beamDisplayHeight: 0,

    currentHand: null,
    handSwitchCue: null,

    lastPullScroll: 0,
    peakWeight: 0,

    finishScroll: 0,
    finishSpawned: false,
    finishReached: false,

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
  world.climberMotion = 'none';
  world.heightHistoryKilograms.length = 0;
  world.anchors.length = 0;
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
  world.sequenceIndex = 0;
  world.sequenceRepeatCount = 0;
  world.sequenceEventStartScroll = 0;
  world.sequenceEventSpawned = false;
  world.sequenceTargetHeight = 0;
  world.beamDisplayHeight = 0;
  world.currentHand = null;
  world.handSwitchCue = null;
  world.lastPullScroll = 0;
  world.peakWeight = 0;
  world.finishScroll = 0;
  world.finishSpawned = false;
  world.finishReached = false;
  world.tindeqSmoothedKilograms = 0;
  world.tindeqMoving = false;
}
