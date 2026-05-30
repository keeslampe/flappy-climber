import { PALETTE } from '../game/constants';

interface Props {
  worldWidth: number;
  groundY: number;
  backgroundScrollY: number;
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

export function Mountains({ worldWidth, groundY, backgroundScrollY }: Props) {
  return (
    <>
      <Ridge
        points={FAR_RIDGE}
        baseline={groundY - 240}
        viewHeight={140}
        fill="#9DB4C9"
        strokeWidth={2.2}
        scroll={backgroundScrollY * 0.05}
        snowcaps={FAR_SNOWCAPS}
        worldWidth={worldWidth}
      />
      <Ridge
        points={MID_RIDGE}
        baseline={groundY - 180}
        viewHeight={140}
        fill="#5F7E94"
        strokeWidth={2.6}
        scroll={backgroundScrollY * 0.10}
        snowcaps={null}
        worldWidth={worldWidth}
      />
    </>
  );
}

interface RidgeProps {
  points: [number, number][];
  baseline: number;
  viewHeight: number;
  fill: string;
  strokeWidth: number;
  scroll: number;
  snowcaps: number[][] | null;
  worldWidth: number;
}

// Outlined mountain ridge that wraps horizontally for parallax. `points` are
// in a 0..400 local space; scaled to the canvas and tiled twice to wrap.
function Ridge({ points, baseline, viewHeight, fill, strokeWidth, scroll, snowcaps, worldWidth }: RidgeProps) {
  const segmentWidth = worldWidth;
  const offset = ((scroll % segmentWidth) + segmentWidth) % segmentWidth;
  const tiles: number[] = [-1, 0, 1];
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {tiles.map((tile) => {
        const x0 = tile * segmentWidth - offset;
        const fillPath =
          `M ${x0} ${baseline} ` +
          points
            .map(([localX, localY]) => `L ${x0 + (localX / 400) * segmentWidth} ${baseline - (viewHeight - localY)}`)
            .join(' ') +
          ` L ${x0 + segmentWidth} ${baseline} Z`;
        const strokePath = points
          .map(([localX, localY], i) => {
            const pointX = x0 + (localX / 400) * segmentWidth;
            const pointY = baseline - (viewHeight - localY);
            return `${i === 0 ? 'M' : 'L'} ${pointX} ${pointY}`;
          })
          .join(' ');
        return (
          <g key={tile}>
            <path d={fillPath} fill={fill} />
            <path d={strokePath} fill="none" stroke={PALETTE.ink} strokeWidth={strokeWidth} />
            {snowcaps?.map((pts, i) => {
              const pathData = pts
                .reduce<string>((acc, _, idx) => {
                  if (idx % 2 !== 0) return acc;
                  const snowX = x0 + (pts[idx] / 400) * segmentWidth;
                  const snowY = baseline - (viewHeight - pts[idx + 1]);
                  return acc + `${idx === 0 ? 'M' : 'L'} ${snowX} ${snowY} `;
                }, '') + 'Z';
              return (
                <path key={i} d={pathData} fill="#F0F5FB" stroke={PALETTE.ink} strokeWidth={strokeWidth * 0.9} />
              );
            })}
          </g>
        );
      })}
    </g>
  );
}
