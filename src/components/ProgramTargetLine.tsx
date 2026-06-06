import { SCROLL_SPEED, WORLD_WIDTH } from '../game/constants';
import { sharpTargetAtDistance } from '../game/mountainProfile';
import { waistYForHeight } from '../game/world';
import type { World } from '../game/types';

interface Props {
  world: World;
  groundY: number;
}

const COLOR = '#FF2D9B';
const SAMPLE_STEP = 2;

// Debug-only route line showing the EXACT program target height over time — what
// it was (left of the climber), is (at the climber's column), and is going to be
// (right). It's the staircase the climber has to follow, and because the program
// clock is continuous it scrolls smoothly instead of jumping when the target steps.
export function ProgramTargetLine({ world, groundY }: Props) {
  if (world.sequenceProgram.length === 0) return null;

  const climberX = world.climber.x;

  const points: string[] = [];
  for (let x = 0; x <= WORLD_WIDTH; x += SAMPLE_STEP) {
    const target = sharpTargetAtDistance(world, x - climberX);
    points.push(`${x},${waistYForHeight(target, groundY).toFixed(1)}`);
  }

  const currentTarget = sharpTargetAtDistance(world, 0);
  const currentY = waistYForHeight(currentTarget, groundY);

  // Seconds left on the current target, off the same scroll clock the program runs
  // on (one event spans duration * 60 * SCROLL_SPEED pixels).
  const currentEvent = world.sequenceProgram[world.sequenceIndex];
  let secondsLeft = 0;
  if (currentEvent) {
    const elapsedSeconds =
      (world.backgroundScrollY - world.sequenceEventStartScroll) / (60 * SCROLL_SPEED);
    secondsLeft = Math.max(0, Math.ceil(currentEvent.duration - elapsedSeconds));
  }

  return (
    <g>
      {/* The target route across past → present → future. */}
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={COLOR}
        strokeWidth={2}
        strokeDasharray="7 5"
        strokeLinejoin="round"
        opacity={0.9}
      />
      {/* "Present" — the climber's column. */}
      <line
        x1={climberX}
        y1={28}
        x2={climberX}
        y2={groundY}
        stroke={COLOR}
        strokeWidth={1}
        strokeDasharray="2 4"
        opacity={0.4}
      />
      <circle cx={climberX} cy={currentY} r={4} fill={COLOR} stroke="#1A1A1A" strokeWidth={1.5} />
      <text
        x={climberX + 9}
        y={currentY - 7}
        fill={COLOR}
        stroke="#1A1A1A"
        strokeWidth={3}
        paintOrder="stroke"
        style={{ font: '700 12px JetBrains Mono, ui-monospace, monospace' }}
      >
        target {currentTarget}, {secondsLeft}s
      </text>
    </g>
  );
}
