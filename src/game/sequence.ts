import type { SeqEvent } from './types';

export interface ParsedSequence {
  events: SeqEvent[];
  repeatTimes: number;
}

// DSL syntax (case-insensitive):
//   X seconds rest
//   Y seconds on Z height
//   repeat this V times   (or: repeat V times)
export function parseSequence(text: string): ParsedSequence {
  const events: SeqEvent[] = [];
  let repeatTimes = 1;
  for (const raw of text.trim().split('\n')) {
    const l = raw.trim().toLowerCase();
    if (!l) continue;
    let m: RegExpMatchArray | null;
    m = l.match(/^(\d+(?:\.\d+)?)\s+seconds?\s+rest/);
    if (m) {
      events.push({ type: 'rest', duration: +m[1] });
      continue;
    }
    m = l.match(/^(\d+(?:\.\d+)?)\s+seconds?\s+on\s+(\d+(?:\.\d+)?)\s+height/);
    if (m) {
      events.push({ type: 'on', duration: +m[1], height: +m[2] });
      continue;
    }
    m = l.match(/^repeat(?:\s+this)?\s+(\d+)\s+times?/);
    if (m) {
      repeatTimes = +m[1];
      continue;
    }
  }
  return { events, repeatTimes };
}
