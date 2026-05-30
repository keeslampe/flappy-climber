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
    const line = raw.trim().toLowerCase();
    if (!line) continue;
    let match: RegExpMatchArray | null;
    match = line.match(/^(\d+(?:\.\d+)?)\s+seconds?\s+rest/);
    if (match) {
      events.push({ type: 'rest', duration: +match[1] });
      continue;
    }
    match = line.match(/^(\d+(?:\.\d+)?)\s+seconds?\s+on\s+(\d+(?:\.\d+)?)\s+height/);
    if (match) {
      events.push({ type: 'on', duration: +match[1], height: +match[2] });
      continue;
    }
    match = line.match(/^repeat(?:\s+this)?\s+(\d+)\s+times?/);
    if (match) {
      repeatTimes = +match[1];
      continue;
    }
  }
  return { events, repeatTimes };
}
