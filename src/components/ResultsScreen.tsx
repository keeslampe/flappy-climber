interface Props {
  score: number;
  seconds: number;
  kg: number;
  best: number;
  programName: string;
  reps: number;
  totalReps: number;
  sets: number;
  totalSets: number;
  onClose: () => void;
}

// Shown when the climber passes the finish flag — an overview of the whole run,
// echoing the in-game HUD pills (REPS / SETS / TIME / CLIPS / MAX KG).
export function ResultsScreen({
  score,
  seconds,
  kg,
  best,
  programName,
  reps,
  totalReps,
  sets,
  totalSets,
  onClose,
}: Props) {
  // REPS / SETS only mean something with a program (totalReps > 0) — match the in-game HUD.
  const hasProgram = totalReps > 0;
  return (
    <div className="overlay">
      <h1>
        SEND
        <br />
        COMPLETE
      </h1>
      <div className="sub">⛰ {programName || 'run overview'} ⛰</div>

      <div className="result-pills">
        {hasProgram && (
          <>
            <div className="hud-box reps">
              <div className="hud-label">REPS</div>
              <div className="hud-value">{reps}/{totalReps}</div>
            </div>
            <div className="hud-box sets">
              <div className="hud-label">SETS</div>
              <div className="hud-value">{sets}/{totalSets}</div>
            </div>
          </>
        )}
        <div className="hud-box time">
          <div className="hud-label">TIME</div>
          <div className="hud-value">{formatTime(seconds)}</div>
        </div>
        <div className="hud-box clip">
          <div className="hud-label">CLIPS</div>
          <div className="hud-value">{score}</div>
        </div>
        <div className="hud-box kg">
          <div className="hud-label">MAX KG</div>
          <div className="hud-value">{kg}kg</div>
        </div>
      </div>

      <div className="best">BEST: {best} clips</div>

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
