import { PALETTE } from '../game/constants';
import type { Cloud } from '../game/types';

interface Props {
  clouds: Cloud[];
}

export function Clouds({ clouds }: Props) {
  return (
    <g stroke={PALETTE.ink} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill={PALETTE.cream}>
      {clouds.map((cloud, i) => (
        <CloudShape key={i} x={cloud.x} y={cloud.y} width={cloud.width} />
      ))}
    </g>
  );
}

// Chunky outlined cloud built from quadratic beziers — three bumps on the
// top, smooth bottom. Roughly matches the canvas drawCloud silhouette.
function CloudShape({ x, y, width }: { x: number; y: number; width: number }) {
  const height = width * 0.46;
  const top = y;
  const bottom = y + height;
  const pathData =
    `M ${x + width * 0.1} ${bottom} ` +
    `Q ${x - height * 0.05} ${bottom} ${x} ${y + height * 0.6} ` +
    `Q ${x - height * 0.05} ${y + height * 0.3} ${x + width * 0.2} ${y + height * 0.3} ` +
    `Q ${x + width * 0.28} ${top - height * 0.05} ${x + width * 0.5} ${y + height * 0.2} ` +
    `Q ${x + width * 0.72} ${top - height * 0.05} ${x + width * 0.8} ${y + height * 0.3} ` +
    `Q ${x + width + height * 0.05} ${y + height * 0.3} ${x + width} ${y + height * 0.6} ` +
    `Q ${x + width + height * 0.05} ${bottom} ${x + width * 0.9} ${bottom} ` +
    `Z`;
  return <path d={pathData} />;
}
