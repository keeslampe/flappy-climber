import { PAL } from '../game/constants';
import { rng } from '../game/rng';
import type { Obstacle, World } from '../game/types';

interface Props {
  world: World;
  groundY: number;
}

export function Obstacles({ world, groundY }: Props) {
  return (
    <g>
      {world.obstacles.map((obs, i) => {
        if (obs.kind === 'boulder') {
          return (
            <g key={i}>
              {obs.boulders.map((b, bi) => {
                const bx = obs.x + b.ox;
                const cy = groundY;
                const rockW = b.r * 2.2;
                const rockH = b.r * 1.6 * b.squish + b.r * 0.4;
                return (
                  <RockShape
                    key={bi}
                    x={bx - rockW / 2}
                    y={cy - rockH}
                    w={rockW}
                    h={rockH}
                    seed={obs.seed + bi * 100}
                  />
                );
              })}
            </g>
          );
        }
        return <RockShape key={i} x={obs.x} y={groundY - obs.wallH} w={obs.wallW} h={obs.wallH} seed={obs.seed} />;
      })}
    </g>
  );
}

interface RockProps {
  x: number;
  y: number;
  w: number;
  h: number;
  seed: number;
}

// Chunky outlined rock with strata bands and crack lines. Deterministic from
// (x,y,w,h,seed). Ported from drawRockShape in the canvas version.
function RockShape({ x, y, w, h, seed }: RockProps) {
  const r = rng(seed);
  const inset = 3;
  const xL = x + inset;
  const xR = x + w - inset;
  const yT = y + inset;
  const yB = y + h - inset;

  const variant = Math.floor(r() * 3);
  let topPts: [number, number][];
  if (variant === 0) {
    topPts = [
      [xL + 4, yT + h * 0.35],
      [xL + w * 0.18, yT + h * 0.12],
      [xL + w * 0.42, yT],
      [xL + w * 0.68, yT + h * 0.08],
      [xL + w * 0.86, yT + h * 0.18],
      [xR, yT + h * 0.42],
    ];
  } else if (variant === 1) {
    topPts = [
      [xL + w * 0.06, yT + h * 0.5],
      [xL + w * 0.22, yT + h * 0.22],
      [xL + w * 0.48, yT + h * 0.06],
      [xR - w * 0.18, yT],
      [xR - w * 0.04, yT + h * 0.25],
    ];
  } else {
    topPts = [
      [xL + 2, yT + h * 0.55],
      [xL + w * 0.18, yT + h * 0.3],
      [xL + w * 0.32, yT + h * 0.05],
      [xL + w * 0.58, yT + h * 0.18],
      [xL + w * 0.78, yT],
      [xR - 4, yT + h * 0.35],
    ];
  }

  const silhouettePath =
    `M ${xL} ${yB} ` +
    topPts.map(([px, py]) => `L ${px} ${py}`).join(' ') +
    ` L ${xR} ${yB} Z`;

  const clipId = `rock-clip-${seed}-${Math.round(x)}-${Math.round(y)}`;
  const bandTops = [0.35, 0.55, 0.72, 0.86];
  const bandH = Math.max(6, h * 0.04);

  const crackX = x + w * 0.45;

  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <clipPath id={clipId}>
          <path d={silhouettePath} />
        </clipPath>
      </defs>
      <path d={silhouettePath} fill="#9A8A78" />
      <g clipPath={`url(#${clipId})`}>
        {bandTops.map((p, i) => {
          const ty = yT + h * p;
          return (
            <g key={i}>
              <rect x={x} y={ty} width={w} height={bandH} fill={i % 2 === 0 ? '#7E6E5E' : '#867464'} opacity={0.85} />
              <line x1={x} y1={ty} x2={x + w} y2={ty} stroke={PAL.ink} strokeWidth={2} opacity={0.6} />
            </g>
          );
        })}
        <rect x={x} y={yT + h * 0.86} width={w} height={h * 0.2} fill="#6F5F4E" opacity={0.6} />

        <polygon
          points={`${x + w * 0.3},${yT + h * 0.04} ${x + w * 0.55},${yT - 2} ${x + w * 0.5},${yT + h * 0.1}`}
          fill="#C2B5A2"
          opacity={0.7}
        />

        <path
          d={`M ${crackX} ${yT + h * 0.12} L ${crackX + 4} ${yT + h * 0.35} L ${crackX - 4} ${yT + h * 0.58} L ${crackX + 6} ${yT + h * 0.82}`}
          stroke={PAL.ink}
          strokeWidth={2.2}
          fill="none"
          opacity={0.7}
        />
        <path
          d={`M ${x + w * 0.78} ${yT + h * 0.4} L ${x + w * 0.72} ${yT + h * 0.6} L ${x + w * 0.82} ${yT + h * 0.78}`}
          stroke={PAL.ink}
          strokeWidth={2}
          fill="none"
          opacity={0.65}
        />

        {w > 40 && (
          <g fill="#4F8252" stroke={PAL.ink} strokeWidth={2}>
            {[0.2, 0.6].map((fx, i) => {
              const mx = x + w * fx;
              const my = yT + h * (i === 0 ? 0.1 : 0.05);
              return (
                <path
                  key={i}
                  d={`M ${mx} ${my} Q ${mx + 8} ${my - 10} ${mx + 16} ${my} Q ${mx + 22} ${my - 8} ${mx + 26} ${my + 2} Z`}
                />
              );
            })}
          </g>
        )}
      </g>
      <path d={silhouettePath} fill="none" stroke={PAL.ink} strokeWidth={3.4} />
    </g>
  );
}
