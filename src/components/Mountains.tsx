import { PAL } from '../game/constants';

interface Props {
  W: number;
  groundY: number;
  bgScrollY: number;
}

// Source: env-sky.jsx, scaled to canvas width.
const FAR_RIDGE: [number, number][] = [
  [0, 80], [30, 50], [60, 78], [95, 18], [130, 70], [170, 36], [210, 82],
  [255, 24], [300, 70], [340, 44], [380, 76], [400, 50],
];
const FAR_SNOWCAPS: number[][] = [
  [88, 28, 95, 18, 102, 28, 99, 36, 91, 36],
  [249, 34, 255, 24, 262, 34, 259, 42, 252, 42],
  [166, 44, 170, 36, 174, 44, 172, 50, 168, 50],
  [333, 52, 340, 44, 347, 52, 344, 58, 336, 58],
];
const MID_RIDGE: [number, number][] = [
  [0, 100], [30, 78], [55, 96], [90, 60], [130, 100], [165, 72], [210, 104],
  [245, 64], [290, 102], [330, 80], [365, 100], [400, 76],
];

export function Mountains({ W, groundY, bgScrollY }: Props) {
  return (
    <>
      <Ridge
        points={FAR_RIDGE}
        baseline={groundY - 240}
        viewH={140}
        fill="#9DB4C9"
        strokeW={2.2}
        scroll={bgScrollY * 0.05}
        snowcaps={FAR_SNOWCAPS}
        W={W}
      />
      <Ridge
        points={MID_RIDGE}
        baseline={groundY - 180}
        viewH={140}
        fill="#5F7E94"
        strokeW={2.6}
        scroll={bgScrollY * 0.10}
        snowcaps={null}
        W={W}
      />
    </>
  );
}

interface RidgeProps {
  points: [number, number][];
  baseline: number;
  viewH: number;
  fill: string;
  strokeW: number;
  scroll: number;
  snowcaps: number[][] | null;
  W: number;
}

// Outlined mountain ridge that wraps horizontally for parallax. `points` are
// in a 0..400 local space; scaled to the canvas and tiled twice to wrap.
function Ridge({ points, baseline, viewH, fill, strokeW, scroll, snowcaps, W }: RidgeProps) {
  const segW = W;
  const offset = ((scroll % segW) + segW) % segW;
  const tiles: number[] = [-1, 0, 1];
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {tiles.map((tile) => {
        const x0 = tile * segW - offset;
        const fillPath =
          `M ${x0} ${baseline} ` +
          points
            .map(([px, py]) => `L ${x0 + (px / 400) * segW} ${baseline - (viewH - py)}`)
            .join(' ') +
          ` L ${x0 + segW} ${baseline} Z`;
        const strokePath = points
          .map(([px, py], i) => {
            const x = x0 + (px / 400) * segW;
            const y = baseline - (viewH - py);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          })
          .join(' ');
        return (
          <g key={tile}>
            <path d={fillPath} fill={fill} />
            <path d={strokePath} fill="none" stroke={PAL.ink} strokeWidth={strokeW} />
            {snowcaps?.map((pts, i) => {
              const d = pts
                .reduce<string>((acc, _, idx) => {
                  if (idx % 2 !== 0) return acc;
                  const sx = x0 + (pts[idx] / 400) * segW;
                  const sy = baseline - (viewH - pts[idx + 1]);
                  return acc + `${idx === 0 ? 'M' : 'L'} ${sx} ${sy} `;
                }, '') + 'Z';
              return <path key={i} d={d} fill="#F0F5FB" stroke={PAL.ink} strokeWidth={strokeW * 0.9} />;
            })}
          </g>
        );
      })}
    </g>
  );
}
