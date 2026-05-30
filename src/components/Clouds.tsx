import { PAL } from '../game/constants';
import type { Cloud } from '../game/types';

interface Props {
  clouds: Cloud[];
}

export function Clouds({ clouds }: Props) {
  return (
    <g stroke={PAL.ink} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill={PAL.cream}>
      {clouds.map((c, i) => (
        <CloudShape key={i} x={c.x} y={c.y} w={c.w} />
      ))}
    </g>
  );
}

// Chunky outlined cloud built from quadratic beziers — three bumps on the
// top, smooth bottom. Roughly matches the canvas drawCloud silhouette.
function CloudShape({ x, y, w }: { x: number; y: number; w: number }) {
  const h = w * 0.46;
  const top = y;
  const bot = y + h;
  const d =
    `M ${x + w * 0.1} ${bot} ` +
    `Q ${x - h * 0.05} ${bot} ${x} ${y + h * 0.6} ` +
    `Q ${x - h * 0.05} ${y + h * 0.3} ${x + w * 0.2} ${y + h * 0.3} ` +
    `Q ${x + w * 0.28} ${top - h * 0.05} ${x + w * 0.5} ${y + h * 0.2} ` +
    `Q ${x + w * 0.72} ${top - h * 0.05} ${x + w * 0.8} ${y + h * 0.3} ` +
    `Q ${x + w + h * 0.05} ${y + h * 0.3} ${x + w} ${y + h * 0.6} ` +
    `Q ${x + w + h * 0.05} ${bot} ${x + w * 0.9} ${bot} ` +
    `Z`;
  return <path d={d} />;
}
