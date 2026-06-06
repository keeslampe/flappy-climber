export type GameState = 'idle' | 'playing';

export interface Climber {
  x: number;
  y: number;
  width: number;
  height: number;
  animationTime: number;
}

export interface Anchor {
  x: number;
  heightMeters: number;
  waistY: number;
  state: 'locked' | 'next' | 'hit';
  seed: number;
}

export interface Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  decay: number;
  radius: number;
  color: string;
}

export interface ScorePop {
  x: number;
  y: number;
  life: number;
  velocityY: number;
  text: string;
}

export interface Cloud {
  x: number;
  y: number;
  width: number;
  speed: number;
}

export type SeqEvent =
  | { type: 'rest'; duration: number }
  | { type: 'on'; duration: number; height: number };

export interface World {
  status: GameState;
  score: number;
  best: number;
  seconds: number;
  gameStartTime: number;
  weight: number;
  frameNumber: number;
  backgroundScrollY: number;
  groundOffset: number;
  flashTimer: number;

  climber: Climber;
  anchors: Anchor[];
  ropePoints: number[];
  particles: Particle[];
  scorePops: ScorePop[];
  clouds: Cloud[];

  // sequence engine
  sequenceProgram: SeqEvent[];
  sequenceRepeatMax: number;
  sequenceIndex: number;
  sequenceRepeatCount: number;
  sequenceEventStartScroll: number;
  sequenceEventSpawned: boolean;
  sequenceTargetHeight: number;
  beamDisplayHeight: number;

  // Tindeq
  tindeqKilograms: number;
  tindeqSmoothedKilograms: number;
  tindeqMoving: boolean;
  tindeqConnected: boolean;

  // input
  keysUp: boolean;
  keysDown: boolean;
}
