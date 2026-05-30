import { useState } from 'react';

interface Props {
  best: number;
  lastScore: number | null;
  lastSeconds: number | null;
  seqText: string;
  setSeqText: (s: string) => void;
  showBeam: boolean;
  setShowBeam: (v: boolean) => void;
  showDebug: boolean;
  setShowDebug: (v: boolean) => void;
  onStart: () => void;
  onConnectTindeq: () => void;
  tindeqConnected: boolean;
  bluetoothAvailable: boolean;
}

export function Overlay(props: Props) {
  const {
    best,
    lastScore,
    lastSeconds,
    seqText,
    setSeqText,
    showBeam,
    setShowBeam,
    showDebug,
    setShowDebug,
    onStart,
    onConnectTindeq,
    tindeqConnected,
    bluetoothAvailable,
  } = props;

  const [connecting, setConnecting] = useState(false);
  const hasLast = lastScore !== null && lastSeconds !== null;

  return (
    <div className="overlay">
      <h1>
        FLAPPY
        <br />
        CLIMBER
      </h1>
      <div className="sub">⛰ kees lampe · tindeq ⛰</div>

      {hasLast && (
        <div className="last-info">
          TIME: {formatTime(lastSeconds!)} &nbsp; SCORE: {lastScore}
        </div>
      )}

      <div className="seq-wrap">
        <div className="seq-label">Program (optional)</div>
        <textarea
          className="seq-input"
          rows={5}
          value={seqText}
          onChange={(e) => setSeqText(e.target.value)}
        />
      </div>

      <button
        className="start-btn"
        onClick={onStart}
        onTouchStart={(e) => {
          e.preventDefault();
          onStart();
        }}
      >
        ▶ SEND IT!
      </button>
      <div className="best">BEST: {best}</div>

      <button
        className={`tindeq-btn ${tindeqConnected ? 'connected' : ''}`}
        disabled={!bluetoothAvailable || connecting}
        onClick={async () => {
          setConnecting(true);
          try {
            await onConnectTindeq();
          } finally {
            setConnecting(false);
          }
        }}
      >
        {connecting ? '⏳ Connecting…' : tindeqConnected ? '✓ Tindeq Connected' : '🔗 Connect Tindeq'}
      </button>

      <label className="toggle-row">
        <input type="checkbox" checked={showDebug} onChange={(e) => setShowDebug(e.target.checked)} /> DEBUG OVERLAY
      </label>
      <label className="toggle-row">
        <input type="checkbox" checked={showBeam} onChange={(e) => setShowBeam(e.target.checked)} /> SHOW GUIDE BEAM
      </label>

      <div className="hint">
        Hold ↑ / ↓ to climb · or use Tindeq
        <br />
        dodge the boulders & walls
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
