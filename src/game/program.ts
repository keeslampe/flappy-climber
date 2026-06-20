import { HAND_SWITCH_REST_SECONDS } from './constants';
import type { Hand, SeqEvent } from './types';

// A program is an ordered list of blocks. Built-in programs ship with the app and are
// read-only; custom programs live in localStorage.
//
// A standard block is "pull for workSeconds at kilograms, then rest for restSeconds",
// performed repeat times. `kind` is optional so older saves (which predate the field)
// still load as standard blocks.
export interface StandardBlock {
  kind?: 'standard';
  workSeconds: number;
  kilograms: number; // 0..HEIGHT_SCALE_MAX (50)
  restSeconds: number;
  repeat: number;
}

// One pull within a progressive block.
export interface ProgressiveStep {
  workSeconds: number;
  kilograms: number; // 0..HEIGHT_SCALE_MAX (50)
}

// A progressive block: a chain of pulls climbing higher and higher with no rest
// between them — a mountain that grows so you have to climb ever higher — capped off
// by a single rest at the end.
export interface ProgressiveBlock {
  kind: 'progressive';
  steps: ProgressiveStep[];
  restSeconds: number;
}

export type ProgramBlock = StandardBlock | ProgressiveBlock;

// How the program assigns hands:
//   none      — no hand switching (no pill, badge or cue)
//   alternate — alternate hands every work rep (rep 0 left, rep 1 right, …) across
//               the whole program, regardless of block boundaries
//   both      — run the whole program once per hand (all blocks left, then all right)
export type HandMode = 'none' | 'alternate' | 'both';

export interface Program {
  id: string;
  name: string;
  builtIn: boolean;
  handMode: HandMode;
  blocks: ProgramBlock[];
}

export const DEFAULT_PROGRAMS: Program[] = [
  {
    id: 'builtin-warmup',
    name: 'Warmup',
    builtIn: true,
    handMode: 'alternate',
    blocks: [
      { workSeconds: 10, kilograms: 10, restSeconds: 10, repeat: 8 },
      { workSeconds: 10, kilograms: 15, restSeconds: 10, repeat: 8 },
      { workSeconds: 10, kilograms: 20, restSeconds: 10, repeat: 8 },
    ],
  },
  {
    id: 'builtin-intro-repeaters',
    name: 'Intro Repeaters',
    builtIn: true,
    handMode: 'both',
    blocks: [{ workSeconds: 8, kilograms: 20, restSeconds: 10, repeat: 2 }],
  },
  {
    id: 'builtin-max-hangs',
    name: 'Max Hangs',
    builtIn: true,
    handMode: 'alternate',
    blocks: [{ workSeconds: 8, kilograms: 35, restSeconds: 60, repeat: 16 }],
  },
  {
    id: 'builtin-endurance-ladder',
    name: 'Endurance Ladder',
    builtIn: true,
    handMode: 'alternate',
    blocks: [
      { workSeconds: 30, kilograms: 18, restSeconds: 30, repeat: 3 },
      { workSeconds: 20, kilograms: 22, restSeconds: 30, repeat: 3 },
    ],
  },
  {
    id: 'builtin-progressive-mountain',
    name: 'Progressive Mountain',
    builtIn: true,
    handMode: 'both',
    blocks: [
      {
        kind: 'progressive',
        steps: [
          { workSeconds: 5, kilograms: 5 },
          { workSeconds: 5, kilograms: 10 },
          { workSeconds: 5, kilograms: 15 },
          { workSeconds: 5, kilograms: 25 },
          { workSeconds: 5, kilograms: 35 },
          { workSeconds: 5, kilograms: 40 },
          { workSeconds: 5, kilograms: 50 },
        ],
        restSeconds: 10,
      },
    ],
  },
];

// Old saves predate handMode — treat a missing value as 'none'.
function handModeOf(program: Program): HandMode {
  return program.handMode ?? 'none';
}

// Running rep/set counters threaded across expansion passes so the numbering is
// continuous (e.g. it keeps climbing across the two passes of 'both' mode).
interface ExpansionCounters {
  rep: number;
  set: number;
}

// Expand one pass of the program's blocks into pull/rest events. In 'alternate' mode
// the hand flips on every work rep across the whole program; otherwise every pull gets
// passHand (which is undefined in 'none' mode). Each block with work is one set; every
// pull is one rep — both tagged onto the 'on' events for the HUD.
function expandBlocks(
  program: Program,
  mode: HandMode,
  passHand: Hand | undefined,
  counters: ExpansionCounters,
): SeqEvent[] {
  const events: SeqEvent[] = [];
  let pullIndex = 0;

  // Emit one pull (rep), tagging it with rep/set numbers and a hand.
  const pushPull = (workSeconds: number, kilograms: number, setNumber: number, hand: Hand | undefined) => {
    counters.rep += 1;
    events.push({ type: 'on', duration: workSeconds, height: kilograms, hand, repNumber: counters.rep, setNumber });
  };

  for (const block of program.blocks) {
    if (block.kind === 'progressive') {
      // The growing mountain: a chain of ever-higher pulls with no rest between them,
      // counted as a single set, finished off by one rest. Progressive steps don't
      // alternate hands (the climb is one continuous effort) — they take the pass hand,
      // which is a real hand only in 'both' mode.
      const workingSteps = block.steps.filter((step) => step.workSeconds > 0);
      if (workingSteps.length > 0) {
        const setNumber = (counters.set += 1);
        for (const step of workingSteps) pushPull(step.workSeconds, step.kilograms, setNumber, passHand);
      }
      if (block.restSeconds > 0) events.push({ type: 'rest', duration: block.restSeconds });
      continue;
    }

    // Standard block: each block that actually has work is one set; the reps inside it
    // share its number.
    const setNumber = block.workSeconds > 0 ? (counters.set += 1) : counters.set;
    for (let repetition = 0; repetition < block.repeat; repetition++) {
      if (block.workSeconds > 0) {
        const hand: Hand | undefined =
          mode === 'alternate' ? (pullIndex % 2 === 0 ? 'left' : 'right') : passHand;
        pushPull(block.workSeconds, block.kilograms, setNumber, hand);
        pullIndex++;
      }
      if (block.restSeconds > 0) {
        events.push({ type: 'rest', duration: block.restSeconds });
      }
    }
  }
  return events;
}

// Flatten a program into the per-step SeqEvent stream the engine consumes, tagging
// pulls with a hand and marking the rest where a hand switch should be cued.
// Returns the event stream plus the hand the climber starts on (null = no switching).
export function expandProgramWithHands(program: Program): {
  events: SeqEvent[];
  initialHand: Hand | null;
  totalReps: number;
  totalSets: number;
} {
  const mode = handModeOf(program);

  // 'both' runs the whole program once per hand, so the rep/set numbering continues
  // across the two passes (shared counters).
  const counters: ExpansionCounters = { rep: 0, set: 0 };
  let events: SeqEvent[];
  if (mode === 'both') {
    events = [
      ...expandBlocks(program, mode, 'left', counters),
      ...expandBlocks(program, mode, 'right', counters),
    ];
  } else {
    events = expandBlocks(program, mode, undefined, counters);
  }

  // Normalize hand switches: every place where consecutive pulls use different hands
  // must have a rest between them carrying switchTo (insert one if the boundary has no
  // rest, e.g. a block with restSeconds 0).
  const normalized: SeqEvent[] = [];
  let previousPullHand: Hand | undefined;
  let initialHand: Hand | null = null;
  for (let index = 0; index < events.length; index++) {
    const event = events[index];
    if (event.type === 'on') {
      if (initialHand === null && event.hand) initialHand = event.hand;
      const previousEvent = events[index - 1];
      const adjacentToPull = !previousEvent || previousEvent.type === 'on';
      if (previousPullHand && event.hand && event.hand !== previousPullHand && adjacentToPull) {
        // Two pulls with different hands and NO rest between them (a block with
        // restSeconds 0) — insert a switch rest. When a rest already sits between
        // them it carries switchTo instead (handled in the rest branch below).
        normalized.push({ type: 'rest', duration: HAND_SWITCH_REST_SECONDS, switchTo: event.hand });
      }
      previousPullHand = event.hand;
      normalized.push(event);
      continue;
    }
    // A rest — does the next pull change hands? If so, this rest carries the switch.
    const nextPull = findNextPull(events, index + 1);
    if (previousPullHand && nextPull && nextPull !== previousPullHand) {
      normalized.push({ ...event, switchTo: nextPull });
    } else {
      normalized.push(event);
    }
  }

  return { events: normalized, initialHand, totalReps: counters.rep, totalSets: counters.set };
}

function findNextPull(events: SeqEvent[], from: number): Hand | undefined {
  for (let index = from; index < events.length; index++) {
    const event = events[index];
    if (event.type === 'on') return event.hand;
  }
  return undefined;
}

const HAND_MODE_LABEL: Record<HandMode, string> = {
  none: '',
  alternate: 'alternate hands',
  both: 'x2 (both hands)',
};

// A compact one-line summary of a program, e.g.
// "8s@35kg x8 · 60s rest · x2 (both hands)".
export function summarizeProgram(program: Program): string {
  if (program.blocks.length === 0) return 'empty';
  const blocks = program.blocks
    .map((block) =>
      block.kind === 'progressive'
        ? `↗ ${block.steps.map((step) => `${step.kilograms}kg`).join('→')} · ${block.restSeconds}s rest`
        : `${block.workSeconds}s@${block.kilograms}kg x${block.repeat} · ${block.restSeconds}s rest`,
    )
    .join(' · ');
  const mode = HAND_MODE_LABEL[handModeOf(program)];
  return mode ? `${blocks} · ${mode}` : blocks;
}
