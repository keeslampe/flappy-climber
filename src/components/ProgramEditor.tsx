import { useEffect, useState } from 'react';
import { HEIGHT_SCALE_MAX } from '../game/constants';
import type {
  HandMode,
  Program,
  ProgramBlock,
  ProgressiveBlock,
  StandardBlock,
} from '../game/program';

interface Props {
  // The program to edit, or null to create a new one.
  initial: Program | null;
  onSave: (program: Program) => void;
  onCancel: () => void;
}

const BLANK_BLOCK: StandardBlock = {
  kind: 'standard',
  workSeconds: 8,
  kilograms: 20,
  restSeconds: 10,
  repeat: 5,
};

// A fresh progressive block starts with a short rising ladder so its "grows higher"
// intent is obvious at a glance.
const BLANK_PROGRESSIVE: ProgressiveBlock = {
  kind: 'progressive',
  steps: [
    { workSeconds: 8, kilograms: 20 },
    { workSeconds: 8, kilograms: 28 },
    { workSeconds: 8, kilograms: 36 },
  ],
  restSeconds: 10,
};

function newId(): string {
  return crypto.randomUUID();
}

// Deep-clone a block so the editor's working copy never shares the steps array with the
// stored program (progressive blocks) or the shipped defaults.
function cloneBlock(block: ProgramBlock): ProgramBlock {
  if (block.kind === 'progressive') {
    return { ...block, steps: block.steps.map((step) => ({ ...step })) };
  }
  return { ...block };
}

// Seed the editor's working copy. A brand-new program starts with one block.
// Editing a built-in clones it into a fresh, fully-editable custom program so the
// shipped defaults are never mutated.
function seedProgram(initial: Program | null): Program {
  if (!initial) {
    return { id: newId(), name: '', builtIn: false, handMode: 'none', blocks: [cloneBlock(BLANK_BLOCK)] };
  }
  if (initial.builtIn) {
    return {
      id: newId(),
      name: `${initial.name} copy`,
      builtIn: false,
      handMode: initial.handMode ?? 'none',
      blocks: initial.blocks.map(cloneBlock),
    };
  }
  return {
    ...initial,
    handMode: initial.handMode ?? 'none',
    blocks: initial.blocks.map(cloneBlock),
  };
}

const HAND_MODE_OPTIONS: { value: HandMode; label: string }[] = [
  { value: 'none', label: 'No hand switch' },
  { value: 'alternate', label: 'Alternate each rep' },
  { value: 'both', label: 'Both hands (run twice)' },
];

export function ProgramEditor({ initial, onSave, onCancel }: Props) {
  const [draft, setDraft] = useState<Program>(() => seedProgram(initial));

  const replaceBlock = (index: number, next: ProgramBlock) => {
    setDraft((previous) => {
      const blocks = previous.blocks.slice();
      blocks[index] = next;
      return { ...previous, blocks };
    });
  };

  const addBlock = () => {
    setDraft((previous) => ({ ...previous, blocks: [...previous.blocks, cloneBlock(BLANK_BLOCK)] }));
  };

  const addProgressiveBlock = () => {
    setDraft((previous) => ({ ...previous, blocks: [...previous.blocks, cloneBlock(BLANK_PROGRESSIVE)] }));
  };

  const removeBlock = (index: number) => {
    setDraft((previous) => ({
      ...previous,
      blocks: previous.blocks.filter((_, blockIndex) => blockIndex !== index),
    }));
  };

  const hasStandardBlock = draft.blocks.some((block) => block.kind !== 'progressive');

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

        <label className="editor-field">
          <span className="editor-field-label">Hand mode</span>
          <select
            className="program-select"
            value={draft.handMode}
            onChange={(event) =>
              setDraft((previous) => ({ ...previous, handMode: event.target.value as HandMode }))
            }
          >
            {HAND_MODE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {hasStandardBlock && (
          <div className="block-header">
            <span>WORK s</span>
            <span>KG</span>
            <span>REST s</span>
            <span>×</span>
            <span />
          </div>
        )}

        {draft.blocks.map((block, index) =>
          block.kind === 'progressive' ? (
            <ProgressiveCard
              key={index}
              block={block}
              onChange={(next) => replaceBlock(index, next)}
              onRemove={() => removeBlock(index)}
            />
          ) : (
            <div className="block-row" key={index}>
              <NumberCell
                value={block.workSeconds}
                min={0}
                onChange={(value) => replaceBlock(index, { ...block, workSeconds: value })}
              />
              <NumberCell
                value={block.kilograms}
                min={0}
                max={HEIGHT_SCALE_MAX}
                onChange={(value) => replaceBlock(index, { ...block, kilograms: value })}
              />
              <NumberCell
                value={block.restSeconds}
                min={0}
                onChange={(value) => replaceBlock(index, { ...block, restSeconds: value })}
              />
              <NumberCell
                value={block.repeat}
                min={1}
                onChange={(value) => replaceBlock(index, { ...block, repeat: value })}
              />
              <button
                className="block-remove"
                onClick={() => removeBlock(index)}
                aria-label="Remove block"
              >
                ✕
              </button>
            </div>
          ),
        )}

        <div className="block-add-row">
          <button className="block-add" onClick={addBlock}>
            ＋ Add block
          </button>
          <button className="block-add block-add-progressive" onClick={addProgressiveBlock}>
            ＋ Add progressive block
          </button>
        </div>
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

// A progressive block: a rising ladder of work/kg pulls (one rep each, climbing
// higher) capped by a single rest. Distinct dotted card so it reads apart from the
// standard rows.
function ProgressiveCard({
  block,
  onChange,
  onRemove,
}: {
  block: ProgressiveBlock;
  onChange: (next: ProgressiveBlock) => void;
  onRemove: () => void;
}) {
  const updateStep = (stepIndex: number, patch: Partial<{ workSeconds: number; kilograms: number }>) => {
    onChange({
      ...block,
      steps: block.steps.map((step, index) => (index === stepIndex ? { ...step, ...patch } : step)),
    });
  };

  const addStep = () => {
    const last = block.steps[block.steps.length - 1];
    const nextKilograms = Math.min(HEIGHT_SCALE_MAX, (last?.kilograms ?? 20) + 8);
    onChange({ ...block, steps: [...block.steps, { workSeconds: last?.workSeconds ?? 8, kilograms: nextKilograms }] });
  };

  const removeStep = (stepIndex: number) => {
    if (block.steps.length <= 1) return; // keep at least one pull
    onChange({ ...block, steps: block.steps.filter((_, index) => index !== stepIndex) });
  };

  return (
    <div className="progressive-block">
      <div className="progressive-head">
        <span className="progressive-tag">↗ PROGRESSIVE</span>
        <button className="block-remove" onClick={onRemove} aria-label="Remove progressive block">
          ✕
        </button>
      </div>

      <div className="progressive-step-header">
        <span>WORK s</span>
        <span>KG</span>
        <span />
      </div>

      {block.steps.map((step, stepIndex) => (
        <div className="progressive-step-row" key={stepIndex}>
          <NumberCell
            value={step.workSeconds}
            min={0}
            onChange={(value) => updateStep(stepIndex, { workSeconds: value })}
          />
          <NumberCell
            value={step.kilograms}
            min={0}
            max={HEIGHT_SCALE_MAX}
            onChange={(value) => updateStep(stepIndex, { kilograms: value })}
          />
          <button
            className="block-remove"
            onClick={() => removeStep(stepIndex)}
            disabled={block.steps.length <= 1}
            aria-label="Remove rep"
          >
            ✕
          </button>
        </div>
      ))}

      <button className="block-add progressive-add-rep" onClick={addStep}>
        ＋ Add rep
      </button>

      <label className="progressive-rest">
        <span>REST s</span>
        <NumberCell value={block.restSeconds} min={0} onChange={(value) => onChange({ ...block, restSeconds: value })} />
      </label>
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
  // Local text state so the field can be empty or partially typed while editing — a
  // plain controlled number input snaps back to a value on every keystroke, which is
  // what made the leading 0 impossible to clear.
  const [text, setText] = useState(String(value));

  // Mirror external value changes (e.g. an "add rep" default) into the field, but don't
  // clobber what's being typed when it already represents the same number.
  useEffect(() => {
    setText((current) => (Number(current) === value ? current : String(value)));
  }, [value]);

  return (
    <input
      className="block-input"
      type="text"
      inputMode="numeric"
      value={text}
      onChange={(event) => {
        // Digits only, with leading zeros dropped so "0" then "8" reads as "8".
        const digits = event.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
        if (digits === '') {
          setText(''); // allow an empty field mid-edit; nothing committed yet
          return;
        }
        let next = Number(digits);
        if (next < min) next = min;
        if (max !== undefined && next > max) next = max;
        setText(String(next));
        onChange(next);
      }}
      onBlur={() => {
        // Leaving the field empty restores a valid value.
        if (text === '') {
          const fallback = Math.max(min, value);
          setText(String(fallback));
          onChange(fallback);
        }
      }}
    />
  );
}
