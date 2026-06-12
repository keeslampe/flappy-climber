import { HAND_SWITCH_REST_SECONDS } from './constants';
import type { Hand, SeqEvent } from './types';

// A program is an ordered list of blocks. Each block is "pull for workSeconds at
// kilograms, then rest for restSeconds", performed repeat times. Built-in programs
// ship with the app and are read-only; custom programs live in localStorage.
export interface ProgramBlock {
  workSeconds: number;
  kilograms: number; // 0..HEIGHT_SCALE_MAX (50)
  restSeconds: number;
  repeat: number;
}

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
      { workSeconds: 10, kilograms: 10, restSeconds: 5, repeat: 8 },
      { workSeconds: 10, kilograms: 15, restSeconds: 10, repeat: 8 },
      { workSeconds: 10, kilograms: 20, restSeconds: 10, repeat: 8 },
    ],
  },
  {
    id: 'builtin-intro-repeaters',
    name: 'Intro Repeaters',
    builtIn: true,
    handMode: 'none',
    blocks: [{ workSeconds: 8, kilograms: 20, restSeconds: 10, repeat: 5 }],
  },
  {
    id: 'builtin-max-hangs',
    name: 'Max Hangs',
    builtIn: true,
    handMode: 'both',
    blocks: [{ workSeconds: 8, kilograms: 35, restSeconds: 60, repeat: 8 }],
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
];

// Old saves predate handMode — treat a missing value as 'none'.
function handModeOf(program: Program): HandMode {
  return program.handMode ?? 'none';
}

// Expand one pass of the program's blocks into pull/rest events. In 'alternate' mode
// the hand flips on every work rep across the whole program; otherwise every pull gets
// passHand (which is undefined in 'none' mode).
function expandBlocks(program: Program, mode: HandMode, passHand: Hand | undefined): SeqEvent[] {
  const events: SeqEvent[] = [];
  let pullIndex = 0;
  for (const block of program.blocks) {
    for (let repetition = 0; repetition < block.repeat; repetition++) {
      if (block.workSeconds > 0) {
        const hand: Hand | undefined =
          mode === 'alternate' ? (pullIndex % 2 === 0 ? 'left' : 'right') : passHand;
        events.push({ type: 'on', duration: block.workSeconds, height: block.kilograms, hand });
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
} {
  const mode = handModeOf(program);

  let events: SeqEvent[];
  if (mode === 'both') {
    events = [...expandBlocks(program, mode, 'left'), ...expandBlocks(program, mode, 'right')];
  } else {
    events = expandBlocks(program, mode, undefined);
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

  return { events: normalized, initialHand };
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
    .map((block) => `${block.workSeconds}s@${block.kilograms}kg x${block.repeat} · ${block.restSeconds}s rest`)
    .join(' · ');
  const mode = HAND_MODE_LABEL[handModeOf(program)];
  return mode ? `${blocks} · ${mode}` : blocks;
}
