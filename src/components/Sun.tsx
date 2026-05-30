import { PAL } from '../game/constants';

interface Props {
  W: number;
}

// Smiley sun with chunky ray crown. Positioned in the upper right.
export function Sun({ W }: Props) {
  const R = 24;
  const sx = W * 0.72;
  const sy = 88;
  const rayLen = R + 18;

  const rays: [number, number][] = [
    [0, -rayLen],
    [0, rayLen],
    [-rayLen, 0],
    [rayLen, 0],
    [-R * 0.78, -R * 0.78],
    [R * 0.78, -R * 0.78],
    [-R * 0.78, R * 0.78],
    [R * 0.78, R * 0.78],
  ];

  return (
    <g stroke={PAL.ink} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill={PAL.yellow}>
      {rays.map(([dx, dy], i) => {
        const ang = Math.atan2(dy, dx);
        const tipX = sx + dx;
        const tipY = sy + dy;
        const bx = sx + Math.cos(ang) * R * 0.95;
        const by = sy + Math.sin(ang) * R * 0.95;
        const px = -Math.sin(ang) * 6;
        const py = Math.cos(ang) * 6;
        return <polygon key={i} points={`${tipX},${tipY} ${bx + px},${by + py} ${bx - px},${by - py}`} />;
      })}
      <circle cx={sx} cy={sy} r={R} />
      <circle cx={sx - 7} cy={sy - 5} r={2.6} fill={PAL.ink} stroke="none" />
      <circle cx={sx + 7} cy={sy - 5} r={2.6} fill={PAL.ink} stroke="none" />
      <path d={`M ${sx - 8} ${sy + 3} A 8 8 0 0 0 ${sx + 8} ${sy + 3}`} fill="none" strokeWidth={2.6} />
      <circle cx={sx - 12} cy={sy + 4} r={2.8} fill={PAL.pink} stroke="none" />
      <circle cx={sx + 12} cy={sy + 4} r={2.8} fill={PAL.pink} stroke="none" />
    </g>
  );
}
