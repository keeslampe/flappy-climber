import type { Hand } from '../game/types';

interface Props {
  clipScore: number;
  currentRep: number;
  totalReps: number;
  currentSet: number;
  totalSets: number;
  weight: number;
  hand: Hand | null;
}

export function HeadsUpDisplay({
  clipScore,
  currentRep,
  totalReps,
  currentSet,
  totalSets,
  weight,
  hand,
}: Props) {
  // REPS / SETS only mean something with a program loaded (totalReps > 0); free play
  // has no structure, so those pills are hidden then.
  const hasProgram = totalReps > 0;
  return (
    <div className="hud">
      {hasProgram && (
        <>
          <div className="hud-box reps">
            <div className="hud-label">REPS</div>
            <div className="hud-value">{currentRep}/{totalReps}</div>
          </div>
          <div className="hud-box sets">
            <div className="hud-label">SETS</div>
            <div className="hud-value">{currentSet}/{totalSets}</div>
          </div>
        </>
      )}
      <div className="hud-box clip">
        <div className="hud-label">CLIPS</div>
        <div className="hud-value">{clipScore}</div>
      </div>
      <div className="hud-box kg">
        <div className="hud-label">KG</div>
        <div className="hud-value">{weight}kg</div>
      </div>
      {hand && (
        // key={hand} remounts the box on a switch so the flash animation replays.
        <div className={`hud-box hand ${hand}`} key={hand}>
          <div className="hud-label">HAND</div>
          <div className="hud-value">{hand === 'left' ? 'L' : 'R'}</div>
        </div>
      )}
    </div>
  );
}
