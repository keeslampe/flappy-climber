export type GameState = 'idle' | 'playing';

export interface Climber {
  x: number;
  y: number;
  w: number;
  h: number;
  animT: number;
}

export interface Boulder {
  ox: number;
  r: number;
  squish: number;
  seed: number;
}

export type Obstacle =
  | {
      kind: 'boulder';
      x: number;
      boulders: Boulder[];
      totalW: number;
      seed: number;
      scored: boolean;
    }
  | {
      kind: 'wall';
      x: number;
      wallW: number;
      wallH: number;
      seed: number;
      scored: boolean;
    }
  | {
      kind: 'interval';
      x: number;
      wallW: number;
      wallH: number;
      seed: number;
      scored: boolean;
    };

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  r: number;
  color: string;
}

export interface ScorePop {
  x: number;
  y: number;
  life: number;
  vy: number;
  txt: string;
}

export interface Cloud {
  x: number;
  y: number;
  w: number;
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
  frameN: number;
  bgScrollY: number;
  groundOff: number;
  flashTimer: number;
  hitCooldown: number;

  climber: Climber;
  obstacles: Obstacle[];
  ropePoints: number[];
  particles: Particle[];
  scorePops: ScorePop[];
  clouds: Cloud[];

  // sequence engine
  seqProgram: SeqEvent[];
  seqRepeatMax: number;
  seqIndex: number;
  seqRepeatCount: number;
  seqEventStartSec: number;
  seqEventSpawned: boolean;
  seqTargetH: number;
  beamDisplayH: number;

  // Tindeq
  tindeqKg: number;
  tindeqSmoothed: number;
  tindeqMoving: boolean;
  tindeqConnected: boolean;

  // input
  keysUp: boolean;
  keysDown: boolean;
}
