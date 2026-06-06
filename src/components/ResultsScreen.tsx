interface Props {
  score: number;
  seconds: number;
  best: number;
  onClose: () => void;
}

// Shown when the climber passes the finish flag — an overview of the whole run.
export function ResultsScreen({ score, seconds, best, onClose }: Props) {
  return (
    <div className="overlay">
      <h1>
        SEND
        <br />
        COMPLETE
      </h1>
      <div className="sub">⛰ run overview ⛰</div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          width: 'min(280px, 80vw)',
          margin: '8px 0 4px',
        }}
      >
        <ResultRow label="TIME" value={formatTime(seconds)} />
        <ResultRow label="SCORE" value={String(score)} />
        <ResultRow label="BEST" value={String(best)} highlight={score >= best && score > 0} />
      </div>

      <button
        className="start-btn"
        onClick={onClose}
        onTouchStart={(event) => {
          event.preventDefault();
          onClose();
        }}
      >
        ▶ BACK TO MENU
      </button>
    </div>
  );
}

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '8px 14px',
        background: 'rgba(26,26,26,0.55)',
        border: '2px solid rgba(255,246,229,0.25)',
        borderRadius: 8,
      }}
    >
      <span style={{ letterSpacing: 1, opacity: 0.85 }}>{label}</span>
      <strong style={{ fontSize: 22, color: highlight ? '#FFD23F' : '#FFF6E5' }}>{value}</strong>
    </div>
  );
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
