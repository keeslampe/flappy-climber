import { useMemo } from 'react';
import { rng } from '../game/rng';

interface Props {
  W: number;
  groundY: number;
  bgScrollY: number;
}

// Green rolling band sitting between the mountains and the trees. Fills the
// area behind the trees so the warm sky doesn't peek through ridge valleys.
export function MidgroundHills({ W, groundY, bgScrollY }: Props) {
  const profile = useMemo(() => {
    const r = rng(919);
    const N = 20;
    const points: { x: number; dy: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const dy = Math.sin(t * Math.PI * 1.8) * 14 + (r() - 0.5) * 10;
      points.push({ x: t, dy });
    }
    return points;
  }, []);

  const hillTopY = groundY - 260;
  const span = W;
  const offset = ((bgScrollY * 0.18) % span + span) % span;
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
            profile.map((p) => `L ${x0 + p.x * span} ${hillTopY + p.dy}`).join(' ') +
            ` L ${x0 + span} ${groundY} Z`;
          const strokePath = profile
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x0 + p.x * span} ${hillTopY + p.dy}`)
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
