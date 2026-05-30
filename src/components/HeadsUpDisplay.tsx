interface Props {
  seconds: number;
  score: number;
  weight: number;
}

export function HeadsUpDisplay({ seconds, score, weight }: Props) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const timeStr = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  return (
    <div className="hud">
      <div className="hud-box time">
        <div className="hud-label">TIME</div>
        <div className="hud-value">{timeStr}</div>
      </div>
      <div className="hud-box score">
        <div className="hud-label">SCORE</div>
        <div className="hud-value">{score}</div>
      </div>
      <div className="hud-box kg">
        <div className="hud-label">KG</div>
        <div className="hud-value">{weight}kg</div>
      </div>
    </div>
  );
}
