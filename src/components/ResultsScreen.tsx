interface Props {
  score: number;
  seconds: number;
  kg: number;
  best: number;
  programName: string;
  onClose: () => void;
}

// Shown when the climber passes the finish flag — an overview of the whole run,
// echoing the in-game HUD pills (TIME / SCORE / KG).
export function ResultsScreen({ score, seconds, kg, best, programName, onClose }: Props) {
  return (
    <div className="overlay">
      <h1>
        SEND
        <br />
        COMPLETE
      </h1>
      <div className="sub">⛰ {programName || 'run overview'} ⛰</div>

      <div className="result-pills">
        <div className="hud-box time">
          <div className="hud-label">TIME</div>
          <div className="hud-value">{formatTime(seconds)}</div>
        </div>
        <div className="hud-box score">
          <div className="hud-label">SCORE</div>
          <div className="hud-value">{score}</div>
        </div>
        <div className="hud-box kg">
          <div className="hud-label">MAX KG</div>
          <div className="hud-value">{kg}kg</div>
        </div>
      </div>

      <div className="best">BEST: {best}</div>

      <button
        className="start-btn result-back"
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

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
