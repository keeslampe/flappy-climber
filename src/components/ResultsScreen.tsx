interface Props {
  score: number;
  totalClips: number;
  seconds: number;
  kg: number;
  programName: string;
  reps: number;
  totalReps: number;
  sets: number;
  totalSets: number;
  // Whether this run set a new all-time record — only then is a celebratory line shown.
  newBest: boolean;
  newMaxKilograms: boolean;
  onClose: () => void;
}

// Shown when the climber passes the finish flag — an overview of the whole run,
// echoing the in-game HUD pills (REPS / SETS / TIME / CLIPS / MAX KG).
export function ResultsScreen({
  score,
  totalClips,
  seconds,
  kg,
  programName,
  reps,
  totalReps,
  sets,
  totalSets,
  newBest,
  newMaxKilograms,
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
          <div className="hud-value">{score}/{totalClips}</div>
        </div>
        <div className="hud-box kg">
          <div className="hud-label">MAX KG</div>
          <div className="hud-value">{kg}kg</div>
        </div>
      </div>

      {newBest && <div className="best">⭐ NEW BEST: {score} clips</div>}
      {newMaxKilograms && <div className="best">⭐ NEW MAX: {kg} kg</div>}

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
