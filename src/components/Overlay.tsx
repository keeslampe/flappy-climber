import { useState } from 'react';

interface Props {
  best: number;
  lastScore: number | null;
  lastSeconds: number | null;
  seqText: string;
  setSeqText: (s: string) => void;
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
        CLIMBER
        <br />
        RUNNER
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

      <div className="hint">
        Hold ↑ / ↓ to climb · or use Tindeq
        <br />
        match height to clip the bolt anchors
      </div>
    </div>
  );
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
