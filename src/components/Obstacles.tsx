import { PALETTE } from '../game/constants';
import { createRandom } from '../game/randomNumberGenerator';
import type { Obstacle, World } from '../game/types';

interface Props {
  world: World;
  groundY: number;
}

export function Obstacles({ world, groundY }: Props) {
  return (
    <g>
      {world.obstacles.map((obstacle, i) => {
        if (obstacle.kind === 'boulder') {
          return (
            <g key={i}>
              {obstacle.boulders.map((boulder, boulderIndex) => {
                const boulderX = obstacle.x + boulder.offsetX;
                const rockWidth = boulder.radius * 2.2;
                const rockHeight = boulder.radius * 1.6 * boulder.squish + boulder.radius * 0.4;
                return (
                  <RockShape
                    key={boulderIndex}
                    x={boulderX - rockWidth / 2}
                    y={groundY - rockHeight}
                    width={rockWidth}
                    height={rockHeight}
                    seed={obstacle.seed + boulderIndex * 100}
                  />
                );
              })}
            </g>
          );
        }
        return (
          <RockShape
            key={i}
            x={obstacle.x}
            y={groundY - obstacle.wallHeight}
            width={obstacle.wallWidth}
            height={obstacle.wallHeight}
            seed={obstacle.seed}
          />
        );
      })}
    </g>
  );
}

interface RockProps {
  x: number;
  y: number;
  width: number;
  height: number;
  seed: number;
}

// Chunky outlined rock with strata bands and crack lines. Deterministic from
// (x,y,width,height,seed). Ported from drawRockShape in the canvas version.
function RockShape({ x, y, width, height, seed }: RockProps) {
  const random = createRandom(seed);
  const inset = 3;
  const left = x + inset;
  const right = x + width - inset;
  const top = y + inset;
  const bottom = y + height - inset;

  const variant = Math.floor(random() * 3);
  let topPoints: [number, number][];
  if (variant === 0) {
    topPoints = [
      [left + 4, top + height * 0.35],
      [left + width * 0.18, top + height * 0.12],
      [left + width * 0.42, top],
      [left + width * 0.68, top + height * 0.08],
      [left + width * 0.86, top + height * 0.18],
      [right, top + height * 0.42],
    ];
  } else if (variant === 1) {
    topPoints = [
      [left + width * 0.06, top + height * 0.5],
      [left + width * 0.22, top + height * 0.22],
      [left + width * 0.48, top + height * 0.06],
      [right - width * 0.18, top],
      [right - width * 0.04, top + height * 0.25],
    ];
  } else {
    topPoints = [
      [left + 2, top + height * 0.55],
      [left + width * 0.18, top + height * 0.3],
      [left + width * 0.32, top + height * 0.05],
      [left + width * 0.58, top + height * 0.18],
      [left + width * 0.78, top],
      [right - 4, top + height * 0.35],
    ];
  }

  const silhouettePath =
    `M ${left} ${bottom} ` +
    topPoints.map(([pointX, pointY]) => `L ${pointX} ${pointY}`).join(' ') +
    ` L ${right} ${bottom} Z`;

  const clipId = `rock-clip-${seed}-${Math.round(x)}-${Math.round(y)}`;
  const bandTops = [0.35, 0.55, 0.72, 0.86];
  const bandHeight = Math.max(6, height * 0.04);

  const crackX = x + width * 0.45;

  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <clipPath id={clipId}>
          <path d={silhouettePath} />
        </clipPath>
      </defs>
      <path d={silhouettePath} fill="#9A8A78" />
      <g clipPath={`url(#${clipId})`}>
        {bandTops.map((fraction, i) => {
          const bandY = top + height * fraction;
          return (
            <g key={i}>
              <rect x={x} y={bandY} width={width} height={bandHeight} fill={i % 2 === 0 ? '#7E6E5E' : '#867464'} opacity={0.85} />
              <line x1={x} y1={bandY} x2={x + width} y2={bandY} stroke={PALETTE.ink} strokeWidth={2} opacity={0.6} />
            </g>
          );
        })}
        <rect x={x} y={top + height * 0.86} width={width} height={height * 0.2} fill="#6F5F4E" opacity={0.6} />

        <polygon
          points={`${x + width * 0.3},${top + height * 0.04} ${x + width * 0.55},${top - 2} ${x + width * 0.5},${top + height * 0.1}`}
          fill="#C2B5A2"
          opacity={0.7}
        />

        <path
          d={`M ${crackX} ${top + height * 0.12} L ${crackX + 4} ${top + height * 0.35} L ${crackX - 4} ${top + height * 0.58} L ${crackX + 6} ${top + height * 0.82}`}
          stroke={PALETTE.ink}
          strokeWidth={2.2}
          fill="none"
          opacity={0.7}
        />
        <path
          d={`M ${x + width * 0.78} ${top + height * 0.4} L ${x + width * 0.72} ${top + height * 0.6} L ${x + width * 0.82} ${top + height * 0.78}`}
          stroke={PALETTE.ink}
          strokeWidth={2}
          fill="none"
          opacity={0.65}
        />

        {width > 40 && (
          <g fill="#4F8252" stroke={PALETTE.ink} strokeWidth={2}>
            {[0.2, 0.6].map((fraction, i) => {
              const mossX = x + width * fraction;
              const mossY = top + height * (i === 0 ? 0.1 : 0.05);
              return (
                <path
                  key={i}
                  d={`M ${mossX} ${mossY} Q ${mossX + 8} ${mossY - 10} ${mossX + 16} ${mossY} Q ${mossX + 22} ${mossY - 8} ${mossX + 26} ${mossY + 2} Z`}
                />
              );
            })}
          </g>
        )}
      </g>
      <path d={silhouettePath} fill="none" stroke={PALETTE.ink} strokeWidth={3.4} />
    </g>
  );
}
