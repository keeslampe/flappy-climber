import { useMemo } from 'react';
import { createRandom } from '../game/randomNumberGenerator';

interface Props {
  worldWidth: number;
  groundY: number;
  backgroundScrollY: number;
}

// Green rolling band sitting between the mountains and the trees. Fills the
// area behind the trees so the warm sky doesn't peek through ridge valleys.
export function MidgroundHills({ worldWidth, groundY, backgroundScrollY }: Props) {
  const profile = useMemo(() => {
    const random = createRandom(919);
    const pointCount = 20;
    const points: { x: number; offsetY: number }[] = [];
    for (let i = 0; i <= pointCount; i++) {
      const fraction = i / pointCount;
      const offsetY = Math.sin(fraction * Math.PI * 1.8) * 14 + (random() - 0.5) * 10;
      points.push({ x: fraction, offsetY });
    }
    return points;
  }, []);

  const hillTopY = groundY - 260;
  const span = worldWidth;
  const offset = ((backgroundScrollY * 0.18) % span + span) % span;
  const tiles = [-1, 0, 1];

  return (
    <>
      <defs>
        <linearGradient id="hillGradient" x1="0" y1={hillTopY - 20} x2="0" y2={groundY} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7CA56A" />
          <stop offset="100%" stopColor="#4F8252" />
        </linearGradient>
      </defs>
      <g strokeLinejoin="round" strokeLinecap="round">
        {tiles.map((tile) => {
          const x0 = tile * span - offset;
          const fillPath =
            `M ${x0} ${groundY} ` +
            profile.map((point) => `L ${x0 + point.x * span} ${hillTopY + point.offsetY}`).join(' ') +
            ` L ${x0 + span} ${groundY} Z`;
          const strokePath = profile
            .map((point, i) => `${i === 0 ? 'M' : 'L'} ${x0 + point.x * span} ${hillTopY + point.offsetY}`)
            .join(' ');
          return (
            <g key={tile}>
              <path d={fillPath} fill="url(#hillGradient)" />
              <path d={strokePath} fill="none" stroke="rgba(26,26,26,0.30)" strokeWidth={2} />
            </g>
          );
        })}
      </g>
    </>
  );
}
