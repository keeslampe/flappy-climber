import { PALETTE, ROPE_PIXEL_STEP } from '../game/constants';
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
  let pathData = `M ${baseX} ${baseY}`;
  for (let i = 0; i < ropePoints.length; i++) {
    pathData += ` L ${baseX - (i + 1) * ROPE_PIXEL_STEP} ${ropePoints[i]}`;
  }
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={pathData} stroke={PALETTE.ink} strokeWidth={3.6} />
      <path d={pathData} stroke="#FF3D5A" strokeWidth={2.2} />
      <path d={pathData} stroke={PALETTE.cream} strokeWidth={0.9} strokeDasharray="5 7" opacity={0.7} />
      <circle cx={baseX} cy={baseY} r={3} fill="#FF3D5A" stroke={PALETTE.ink} strokeWidth={1.6} />
    </g>
  );
}
