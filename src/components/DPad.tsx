import { useCallback, useState } from 'react';

interface Props {
  onUpChange: (down: boolean) => void;
  onDownChange: (down: boolean) => void;
  onMenu: () => void;
}

export function DPad({ onUpChange, onDownChange, onMenu }: Props) {
  return (
    <div className="dpad">
      <HoldButton label="▲" onChange={onUpChange} />
      <TapButton label="☰" onTap={onMenu} />
      <HoldButton label="▼" onChange={onDownChange} />
    </div>
  );
}

function HoldButton({ label, onChange }: { label: string; onChange: (down: boolean) => void }) {
  const [pressed, setPressed] = useState(false);
  const start = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      setPressed(true);
      onChange(true);
    },
    [onChange],
  );
  const end = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      setPressed(false);
      onChange(false);
    },
    [onChange],
  );
  return (
    <div
      className={`dpad-btn ${pressed ? 'pressed' : ''}`}
      onTouchStart={start}
      onMouseDown={start}
      onTouchEnd={end}
      onMouseUp={end}
      onMouseLeave={end}
    >
      {label}
    </div>
  );
}

function TapButton({ label, onTap }: { label: string; onTap: () => void }) {
  const [pressed, setPressed] = useState(false);
  const tap = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      setPressed(true);
      onTap();
      setTimeout(() => setPressed(false), 150);
    },
    [onTap],
  );
  return (
    <div className={`dpad-btn ${pressed ? 'pressed' : ''}`} onTouchStart={tap} onMouseDown={tap}>
      {label}
    </div>
  );
}
