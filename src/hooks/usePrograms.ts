import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_PROGRAMS, type Program } from '../game/program';

const CUSTOM_PROGRAMS_KEY = 'flappy-climber.programs';
const SELECTED_PROGRAM_KEY = 'flappy-climber.selectedProgram';

// Only the user's custom programs are persisted; the built-ins always come from
// code so they can evolve with the app.
function loadCustomPrograms(): Program[] {
  try {
    const raw = localStorage.getItem(CUSTOM_PROGRAMS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Program[];
  } catch {
    return [];
  }
}

function loadSelectedId(): string {
  try {
    return localStorage.getItem(SELECTED_PROGRAM_KEY) ?? DEFAULT_PROGRAMS[0].id;
  } catch {
    return DEFAULT_PROGRAMS[0].id;
  }
}

export interface ProgramsStore {
  programs: Program[];
  selectedId: string;
  selectedProgram: Program | undefined;
  setSelectedId: (id: string) => void;
  saveProgram: (program: Program) => Program;
  deleteProgram: (id: string) => void;
}

export function usePrograms(): ProgramsStore {
  const [customPrograms, setCustomPrograms] = useState<Program[]>(loadCustomPrograms);
  const [selectedId, setSelectedIdState] = useState<string>(loadSelectedId);

  const programs = [...DEFAULT_PROGRAMS, ...customPrograms];

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_PROGRAMS_KEY, JSON.stringify(customPrograms));
    } catch {
      // Storage may be unavailable (private mode / quota) — programs still work
      // for the current session, they just won't persist.
    }
  }, [customPrograms]);

  const setSelectedId = useCallback((id: string) => {
    setSelectedIdState(id);
    try {
      localStorage.setItem(SELECTED_PROGRAM_KEY, id);
    } catch {
      // ignore — see note above
    }
  }, []);

  // Upsert a custom program by id. Built-ins are never written to storage; the
  // editor turns "edit a built-in" into "save a fresh custom copy" upstream.
  const saveProgram = useCallback((program: Program): Program => {
    setCustomPrograms((previous) => {
      const index = previous.findIndex((candidate) => candidate.id === program.id);
      if (index === -1) return [...previous, program];
      const next = previous.slice();
      next[index] = program;
      return next;
    });
    return program;
  }, []);

  const deleteProgram = useCallback(
    (id: string) => {
      setCustomPrograms((previous) => previous.filter((candidate) => candidate.id !== id));
      if (selectedId === id) setSelectedId(DEFAULT_PROGRAMS[0].id);
    },
    [selectedId, setSelectedId],
  );

  const selectedProgram = programs.find((candidate) => candidate.id === selectedId);

  return { programs, selectedId, selectedProgram, setSelectedId, saveProgram, deleteProgram };
}
