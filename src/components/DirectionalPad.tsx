import { useCallback, useState } from 'react';

interface Props {
  onMenu: () => void;
}

export function DirectionalPad({ onMenu }: Props) {
  return (
    <div className="dpad">
      <TapButton label="☰" onTap={onMenu} />
    </div>
  );
}

function TapButton({ label, onTap }: { label: string; onTap: () => void }) {
  const [pressed, setPressed] = useState(false);
  const tap = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
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
