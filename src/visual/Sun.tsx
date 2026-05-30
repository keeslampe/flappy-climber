import { PALETTE } from '../game/constants';

interface Props {
  worldWidth: number;
}

// Smiley sun with chunky ray crown. Positioned in the upper right.
export function Sun({ worldWidth }: Props) {
  const radius = 24;
  const centerX = worldWidth * 0.72;
  const centerY = 88;
  const rayLength = radius + 18;

  const rays: [number, number][] = [
    [0, -rayLength],
    [0, rayLength],
    [-rayLength, 0],
    [rayLength, 0],
    [-radius * 0.78, -radius * 0.78],
    [radius * 0.78, -radius * 0.78],
    [-radius * 0.78, radius * 0.78],
    [radius * 0.78, radius * 0.78],
  ];

  return (
    <g stroke={PALETTE.ink} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill={PALETTE.yellow}>
      {rays.map(([offsetX, offsetY], i) => {
        const angle = Math.atan2(offsetY, offsetX);
        const tipX = centerX + offsetX;
        const tipY = centerY + offsetY;
        const baseX = centerX + Math.cos(angle) * radius * 0.95;
        const baseY = centerY + Math.sin(angle) * radius * 0.95;
        const perpendicularX = -Math.sin(angle) * 6;
        const perpendicularY = Math.cos(angle) * 6;
        return (
          <polygon
            key={i}
            points={`${tipX},${tipY} ${baseX + perpendicularX},${baseY + perpendicularY} ${baseX - perpendicularX},${baseY - perpendicularY}`}
          />
        );
      })}
      <circle cx={centerX} cy={centerY} r={radius} />
      <circle cx={centerX - 7} cy={centerY - 5} r={2.6} fill={PALETTE.ink} stroke="none" />
      <circle cx={centerX + 7} cy={centerY - 5} r={2.6} fill={PALETTE.ink} stroke="none" />
      <path d={`M ${centerX - 8} ${centerY + 3} A 8 8 0 0 0 ${centerX + 8} ${centerY + 3}`} fill="none" strokeWidth={2.6} />
      <circle cx={centerX - 12} cy={centerY + 4} r={2.8} fill={PALETTE.pink} stroke="none" />
      <circle cx={centerX + 12} cy={centerY + 4} r={2.8} fill={PALETTE.pink} stroke="none" />
    </g>
  );
}
