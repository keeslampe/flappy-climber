import type { SeqEvent } from './types';

// A program is an ordered list of blocks. Each block is "pull for workSeconds at
// kilograms, then rest for restSeconds", performed repeat times. Built-in programs
// ship with the app and are read-only; custom programs live in localStorage.
export interface ProgramBlock {
  workSeconds: number;
  kilograms: number; // 0..HEIGHT_SCALE_MAX (50)
  restSeconds: number;
  repeat: number;
}

export interface Program {
  id: string;
  name: string;
  builtIn: boolean;
  blocks: ProgramBlock[];
}

export const DEFAULT_PROGRAMS: Program[] = [
  {
    id: 'builtin-intro-repeaters',
    name: 'Intro Repeaters',
    builtIn: true,
    blocks: [{ workSeconds: 8, kilograms: 20, restSeconds: 10, repeat: 5 }],
  },
  {
    id: 'builtin-max-hangs',
    name: 'Max Hangs',
    builtIn: true,
    blocks: [{ workSeconds: 10, kilograms: 35, restSeconds: 60, repeat: 4 }],
  },
  {
    id: 'builtin-endurance-ladder',
    name: 'Endurance Ladder',
    builtIn: true,
    blocks: [
      { workSeconds: 30, kilograms: 18, restSeconds: 30, repeat: 3 },
      { workSeconds: 20, kilograms: 22, restSeconds: 30, repeat: 3 },
    ],
  },
  {
    id: 'builtin-quick-pump',
    name: 'Quick Pump',
    builtIn: true,
    blocks: [{ workSeconds: 6, kilograms: 25, restSeconds: 6, repeat: 8 }],
  },
];

// Flatten a program's blocks into the per-step SeqEvent stream the game engine
// consumes. A block with workSeconds 0 contributes only rest, and vice versa.
export function expandProgram(program: Program): SeqEvent[] {
  const events: SeqEvent[] = [];
  for (const block of program.blocks) {
    for (let rep = 0; rep < block.repeat; rep++) {
      if (block.workSeconds > 0) {
        events.push({ type: 'on', duration: block.workSeconds, height: block.kilograms });
      }
      if (block.restSeconds > 0) {
        events.push({ type: 'rest', duration: block.restSeconds });
      }
    }
  }
  return events;
}

// A compact one-line summary of a program's blocks, e.g. "8s@20 ·10s ×5".
export function summarizeProgram(program: Program): string {
  if (program.blocks.length === 0) return 'empty';
  return program.blocks
    .map((block) => `${block.workSeconds}s@${block.kilograms} ·${block.restSeconds}s ×${block.repeat}`)
    .join('  +  ');
}
