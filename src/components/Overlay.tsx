import { useState } from 'react';
import { summarizeProgram, type Program } from '../game/program';

interface Props {
  best: number;
  lastScore: number | null;
  lastSeconds: number | null;
  programs: Program[];
  selectedId: string;
  selectedProgram: Program | undefined;
  setSelectedId: (id: string) => void;
  onNewProgram: () => void;
  onEditProgram: () => void;
  onDeleteProgram: () => void;
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
    programs,
    selectedId,
    selectedProgram,
    setSelectedId,
    onNewProgram,
    onEditProgram,
    onDeleteProgram,
    showDebug,
    setShowDebug,
    onStart,
    onConnectTindeq,
    tindeqConnected,
    bluetoothAvailable,
  } = props;

  const [connecting, setConnecting] = useState(false);
  const hasLast = lastScore !== null && lastSeconds !== null;
  const canDelete = selectedProgram !== undefined && !selectedProgram.builtIn;

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
        <div className="seq-label">Program</div>
        <select
          className="program-select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
              {program.builtIn ? '' : ' ★'}
            </option>
          ))}
        </select>
        {selectedProgram && (
          <div className="program-summary">{summarizeProgram(selectedProgram)}</div>
        )}
        <div className="program-buttons">
          <button className="program-btn" onClick={onNewProgram}>
            ＋ New
          </button>
          <button className="program-btn" onClick={onEditProgram}>
            ✎ Edit
          </button>
          {canDelete && (
            <button className="program-btn danger" onClick={onDeleteProgram}>
              🗑 Delete
            </button>
          )}
        </div>
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
