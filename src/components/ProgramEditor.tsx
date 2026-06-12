import { useState } from 'react';
import { HEIGHT_SCALE_MAX } from '../game/constants';
import type { Program, ProgramBlock } from '../game/program';

interface Props {
  // The program to edit, or null to create a new one.
  initial: Program | null;
  onSave: (program: Program) => void;
  onCancel: () => void;
}

const BLANK_BLOCK: ProgramBlock = { workSeconds: 8, kilograms: 20, restSeconds: 10, repeat: 5 };

function newId(): string {
  return crypto.randomUUID();
}

// Seed the editor's working copy. A brand-new program starts with one block.
// Editing a built-in clones it into a fresh, fully-editable custom program so the
// shipped defaults are never mutated.
function seedProgram(initial: Program | null): Program {
  if (!initial) {
    return { id: newId(), name: '', builtIn: false, blocks: [{ ...BLANK_BLOCK }] };
  }
  if (initial.builtIn) {
    return {
      id: newId(),
      name: `${initial.name} copy`,
      builtIn: false,
      blocks: initial.blocks.map((block) => ({ ...block })),
    };
  }
  return { ...initial, blocks: initial.blocks.map((block) => ({ ...block })) };
}

export function ProgramEditor({ initial, onSave, onCancel }: Props) {
  const [draft, setDraft] = useState<Program>(() => seedProgram(initial));

  const updateBlock = (index: number, patch: Partial<ProgramBlock>) => {
    setDraft((previous) => {
      const blocks = previous.blocks.slice();
      blocks[index] = { ...blocks[index], ...patch };
      return { ...previous, blocks };
    });
  };

  const addBlock = () => {
    setDraft((previous) => ({ ...previous, blocks: [...previous.blocks, { ...BLANK_BLOCK }] }));
  };

  const removeBlock = (index: number) => {
    setDraft((previous) => ({
      ...previous,
      blocks: previous.blocks.filter((_, blockIndex) => blockIndex !== index),
    }));
  };

  const canSave = draft.name.trim().length > 0 && draft.blocks.length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ ...draft, name: draft.name.trim() });
  };

  return (
    <div className="overlay editor">
      <h1 className="editor-title">{initial && !initial.builtIn ? 'EDIT' : 'NEW'} PROGRAM</h1>

      <div className="editor-body">
        <label className="editor-field">
          <span className="editor-field-label">Name</span>
          <input
            className="editor-name-input"
            type="text"
            value={draft.name}
            placeholder="My program"
            onChange={(event) => setDraft((previous) => ({ ...previous, name: event.target.value }))}
          />
        </label>

        <div className="block-header">
          <span>WORK s</span>
          <span>KG</span>
          <span>REST s</span>
          <span>×</span>
          <span />
        </div>

        {draft.blocks.map((block, index) => (
          <div className="block-row" key={index}>
            <NumberCell
              value={block.workSeconds}
              min={0}
              onChange={(value) => updateBlock(index, { workSeconds: value })}
            />
            <NumberCell
              value={block.kilograms}
              min={0}
              max={HEIGHT_SCALE_MAX}
              onChange={(value) => updateBlock(index, { kilograms: value })}
            />
            <NumberCell
              value={block.restSeconds}
              min={0}
              onChange={(value) => updateBlock(index, { restSeconds: value })}
            />
            <NumberCell
              value={block.repeat}
              min={1}
              onChange={(value) => updateBlock(index, { repeat: value })}
            />
            <button
              className="block-remove"
              onClick={() => removeBlock(index)}
              aria-label="Remove block"
            >
              ✕
            </button>
          </div>
        ))}

        <button className="block-add" onClick={addBlock}>
          ＋ Add block
        </button>
      </div>

      <div className="editor-actions">
        <button className="editor-cancel" onClick={onCancel}>
          CANCEL
        </button>
        <button className="start-btn editor-save" disabled={!canSave} onClick={handleSave}>
          ✓ SAVE
        </button>
      </div>
    </div>
  );
}

function NumberCell({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      className="block-input"
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      value={value}
      onChange={(event) => {
        const parsed = Number(event.target.value);
        if (Number.isNaN(parsed)) return;
        let next = parsed;
        if (next < min) next = min;
        if (max !== undefined && next > max) next = max;
        onChange(next);
      }}
    />
  );
}
