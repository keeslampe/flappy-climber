interface Props {
  onResume: () => void;
  onMenu: () => void;
}

// Shown when the run is paused (tapping the screen during play). The simulation is
// frozen behind this overlay; tapping anywhere — or the Resume button — continues
// exactly where it left off. Quit is isolated so it doesn't also resume.
export function PauseScreen({ onResume, onMenu }: Props) {
  return (
    <div
      className="overlay"
      onClick={onResume}
      onTouchStart={(event) => {
        event.preventDefault();
        onResume();
      }}
    >
      <h1>PAUSED</h1>
      <div className="sub">⛰ tap anywhere to resume ⛰</div>

      <button className="start-btn">▶ RESUME</button>

      <button
        className="tindeq-btn"
        onClick={(event) => {
          event.stopPropagation();
          onMenu();
        }}
        onTouchStart={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onMenu();
        }}
      >
        ☰ QUIT TO MENU
      </button>
    </div>
  );
}
