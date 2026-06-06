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
  // Fixed number shown on the clip: seconds remaining in its workout event at the
  // moment it spawned (an 8s pull yields 8,7,…,1). The pull→rest boundary clip that
  // sits at the pull height is labelled 0 (you've reached the top). null = no badge
  // (e.g. when there's no program).
  label: number | null;
  // The finish line at the end of the program — drawn as a flag on the ground and
  // ends the run when it passes the climber, rather than being a clippable anchor.
  isFinish: boolean;
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
  // Which way the climber is currently moving vertically — drives the climb /
  // abseil / walk / idle animation choice. 'up' = climbing, 'down' = abseiling.
  climberMotion: 'up' | 'down' | 'none';
  // Recent climber height in kg, newest first (one sample per fixed step). Used to
  // detect a fast drop (>2kg over 0.1s = 6 steps) that triggers the abseil pose.
  heightHistoryKilograms: number[];
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

  // Finish line: scroll offset (px) at which the finish flag reaches the climber —
  // 2 seconds after the last pull. 0 = no finish (e.g. no program). Once the flag
  // passes the climber, finishReached flips and the run ends.
  finishScroll: number;
  finishSpawned: boolean;
  finishReached: boolean;

  // Tindeq
  tindeqKilograms: number;
  tindeqSmoothedKilograms: number;
  tindeqMoving: boolean;
  tindeqConnected: boolean;

  // input
  keysUp: boolean;
  keysDown: boolean;
}
