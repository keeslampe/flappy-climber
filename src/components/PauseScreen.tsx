interface Props {
  onResume: () => void;
  onMenu: () => void;
}

// Shown when the run is paused (tapping the screen during play). The simulation is
// frozen behind this overlay; Resume continues exactly where it left off.
export function PauseScreen({ onResume, onMenu }: Props) {
  return (
    <div className="overlay">
      <h1>PAUSED</h1>
      <div className="sub">⛰ tap resume to keep climbing ⛰</div>

      <button
        className="start-btn"
        onClick={onResume}
        onTouchStart={(event) => {
          event.preventDefault();
          onResume();
        }}
      >
        ▶ RESUME
      </button>

      <button
        className="tindeq-btn"
        onClick={onMenu}
        onTouchStart={(event) => {
          event.preventDefault();
          onMenu();
        }}
      >
        ☰ QUIT TO MENU
      </button>
    </div>
  );
}
