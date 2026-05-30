interface Props {
  seconds: number;
  score: number;
  weight: number;
}

export function HUD({ seconds, score, weight }: Props) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const timeStr = `${m}:${s < 10 ? '0' : ''}${s}`;
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
