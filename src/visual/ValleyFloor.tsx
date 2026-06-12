import { PALETTE } from '../game/constants';
import { waistYForHeight } from '../game/world';

interface Props {
  worldWidth: number;
  groundY: number;
  backgroundScrollY: number;
}

function lcgRandom(seed: number): () => number {
  let state = (seed >>> 0) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

// Smooth quadratic curve through points (interior points are control points, the
// midpoints are on-curve anchors) — gives soft rolling hills, not zig-zag lines.
function smoothTopPath(points: Array<[number, number]>): string {
  let data = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let index = 1; index < points.length - 1; index++) {
    const [controlX, controlY] = points[index];
    const [nextX, nextY] = points[index + 1];
    const midX = (controlX + nextX) / 2;
    const midY = (controlY + nextY) / 2;
    data += ` Q ${controlX.toFixed(1)} ${controlY.toFixed(1)} ${midX.toFixed(1)} ${midY.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  data += ` L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
  return data;
}

// Green rolling hills far below the climbing wall. Smooth, periodic crest (so the
// tiled copies join with no vertical jump) that scrolls with a slow parallax.
export function ValleyFloor({ worldWidth, groundY, backgroundScrollY }: Props) {
  // The hilltops crest at the 20 kg mark on the height ruler. amplitude is the
  // crest-to-dip swing; baseY sits one amplitude below the 20 kg line so the
  // tallest peaks (crest factor ~1.0) just reach it.
  const amplitude = groundY * 0.045;
  const baseY = waistYForHeight(20, groundY) + amplitude;
  // Fewer, broader hills → more flow / less up-and-down at the same amplitude.
  const hillCount = 3;
  const segment = worldWidth / hillCount;

  const random = lcgRandom(99);
  const startY = baseY - amplitude * (0.4 + 0.3 * random());
  const points: Array<[number, number]> = [[0, startY]];
  for (let index = 1; index <= hillCount; index++) {
    const crestX = (index - 0.5) * segment + (random() - 0.5) * segment * 0.2;
    const crestY = baseY - amplitude * (0.7 + 0.3 * random());
    const dipX = index * segment;
    const dipY = baseY + amplitude * (0.1 + 0.2 * random());
    points.push([+crestX.toFixed(1), +crestY.toFixed(1)]);
    points.push([+dipX.toFixed(1), +dipY.toFixed(1)]);
  }
  // Seamless wrap: the final anchor matches the start height.
  points[points.length - 1] = [worldWidth, startY];

  const topPath = smoothTopPath(points);
  const fillPath = `${topPath} L ${worldWidth} ${groundY} L 0 ${groundY} Z`;

  const hazeTopY = baseY - amplitude - groundY * 0.12;
  const offset = (((backgroundScrollY * 0.16) % worldWidth) + worldWidth) % worldWidth;

  return (
    <>
      <defs>
        <linearGradient id="valleyHazeGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PALETTE.valleyFloor} stopOpacity="0" />
          <stop offset="100%" stopColor={PALETTE.valleyFloor} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="valleyFloorGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PALETTE.valleyTop} />
          <stop offset="60%" stopColor={PALETTE.valleyFloor} />
        </linearGradient>
      </defs>

      {/* Haze fading the foot of the wall into the valley (static, full width) */}
      <rect x={0} y={hazeTopY} width={worldWidth} height={baseY - hazeTopY + 4} fill="url(#valleyHazeGradient)" />

      {/* Rolling hill body + rim, tiled and scrolling with a slow parallax */}
      {[-1, 0, 1].map((tile) => (
        <g key={tile} transform={`translate(${tile * worldWidth - offset} 0)`}>
          <path d={fillPath} fill="url(#valleyFloorGradient)" />
          <path
            d={topPath}
            fill="none"
            stroke={PALETTE.ink}
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>
      ))}
    </>
  );
}
