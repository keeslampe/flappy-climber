import { PAL, ROPE_PIXEL_STEP } from '../game/constants';
import type { World } from '../game/types';

interface Props {
  world: World;
}

// Chunky climbing rope traced through the climber's recent y-history.
// Three stacked strokes: black outline, red core, cream dashed sheath.
export function Rope({ world }: Props) {
  const { climber, ropePoints } = world;
  if (ropePoints.length < 1) return null;
  const baseX = climber.x;
  const baseY = climber.y + 8;
  let d = `M ${baseX} ${baseY}`;
  for (let i = 0; i < ropePoints.length; i++) {
    d += ` L ${baseX - (i + 1) * ROPE_PIXEL_STEP} ${ropePoints[i]}`;
  }
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={d} stroke={PAL.ink} strokeWidth={6} />
      <path d={d} stroke="#FF3D5A" strokeWidth={4} />
      <path d={d} stroke={PAL.cream} strokeWidth={1.4} strokeDasharray="6 8" opacity={0.7} />
      <circle cx={baseX} cy={baseY} r={4.5} fill="#FF3D5A" stroke={PAL.ink} strokeWidth={2.4} />
    </g>
  );
}
