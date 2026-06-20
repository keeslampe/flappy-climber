import { useState } from 'react';
import { summarizeProgram, type Program } from '../game/program';

interface Props {
  bestScore: number;
  maxKilograms: number;
  locked: boolean;
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
    bestScore,
    maxKilograms,
    locked,
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
  const canDelete = selectedProgram !== undefined && !selectedProgram.builtIn;

  return (
    <div className={`overlay ${locked ? 'locked' : ''}`}>
      <h1>
        CLIMB
        <br />
        RUNNER
      </h1>
      <div className="sub">⛰ kees lampe · tindeq ⛰</div>

      <div className="last-info">
        BEST: {bestScore} clips &nbsp; MAX: {maxKilograms}kg
      </div>

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

      <div className="hint">
        Hold ↑ / ↓ to climb · or use Tindeq
        <br />
        match height to clip the bolt anchors
      </div>

      <label className="toggle-row menu-bottom">
        <input type="checkbox" checked={showDebug} onChange={(e) => setShowDebug(e.target.checked)} /> DEBUG OVERLAY
      </label>
    </div>
  );
}
