import { PALETTE } from '../game/constants';

interface Props {
  worldWidth: number;
  groundY: number;
  backgroundScrollY: number;
}

// LCG PRNG matching the Valley Climb design's buildRange seed algorithm.
function lcgRandom(seed: number): () => number {
  let state = (seed >>> 0) || 1;
  return () => {
    state = ((state * 1664525 + 1013904223) >>> 0);
    return state / 4294967296;
  };
}

interface RangeResult {
  fillPath: string;
  topPoints: Array<[number, number]>;
}

// Generates a jagged mountain range across 0..100 x-space (percent).
// Returns a closed fill polygon and the crest points for snow lines.
function buildRange(seed: number, baseY: number, amplitude: number, peakCount: number): RangeResult {
  const random = lcgRandom(seed);
  const top: Array<[number, number]> = [[0, baseY - amplitude * (0.3 + 0.4 * random())]];
  for (let peakIndex = 1; peakIndex <= peakCount; peakIndex++) {
    const x = (peakIndex / peakCount) * 100;
    const peakX = x - (100 / peakCount) * (0.45 + 0.1 * random());
    const peakY = baseY - amplitude * (0.55 + 0.45 * random());
    const saddleY = baseY - amplitude * (0.05 + 0.22 * random());
    top.push([+peakX.toFixed(1), +peakY.toFixed(1)]);
    top.push([+x.toFixed(1), +saddleY.toFixed(1)]);
  }
  const fillPath =
    `M 0 100 L ${top.map(([x, y]) => `${x} ${y}`).join(' L ')} L 100 100 Z`;
  return { fillPath, topPoints: top };
}

export function Mountains({ worldWidth, groundY, backgroundScrollY }: Props) {
  const ridgeHeight = groundY;

  // Far range (palest) — uses Valley Climb seed * 7 + 1, baseY 60, amp ~28
  const farSeed = 13 * 7 + 1;
  const far = buildRange(farSeed, 60, 28, 9);

  // Mid range (deeper) — uses Valley Climb seed * 13 + 5, baseY 54, amp ~20
  const midSeed = 13 * 13 + 5;
  const mid = buildRange(midSeed, 54, 20, 7);

  // Convert percent-space paths to pixel space
  const toPixelPath = (percentPath: string) =>
    percentPath.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, xStr, yStr) => {
      const xValue = parseFloat(xStr);
      const yValue = parseFloat(yStr);
      return `${((xValue / 100) * worldWidth).toFixed(1)} ${((yValue / 100) * ridgeHeight).toFixed(1)}`;
    });

  const farFillPixels = toPixelPath(far.fillPath);
  const midFillPixels = toPixelPath(mid.fillPath);

  const toPixelPoints = (pts: Array<[number, number]>) =>
    pts.map(([x, y]) => `${((x / 100) * worldWidth).toFixed(1)},${((y / 100) * ridgeHeight).toFixed(1)}`).join(' ');

  const farSnowPoints = toPixelPoints(far.topPoints);
  const midSnowPoints = toPixelPoints(mid.topPoints);

  // Parallax offsets — far scrolls slower than mid
  const farOffset = ((backgroundScrollY * 0.05) % worldWidth + worldWidth) % worldWidth;
  const midOffset = ((backgroundScrollY * 0.10) % worldWidth + worldWidth) % worldWidth;

  return (
    <g>
      {/* Far peaks (palest) */}
      {[-1, 0, 1].map((tile) => (
        <g key={`far${tile}`} transform={`translate(${tile * worldWidth - farOffset} 0)`}>
          <path d={farFillPixels} fill={PALETTE.farPeaks} />
          <polyline
            points={farSnowPoints}
            fill="none"
            stroke="#F2F6FB"
            strokeWidth="2.4"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </g>
      ))}

      {/* Mid peaks (deeper) */}
      {[-1, 0, 1].map((tile) => (
        <g key={`mid${tile}`} transform={`translate(${tile * worldWidth - midOffset} 0)`}>
          <path d={midFillPixels} fill={PALETTE.midPeaks} />
          <polyline
            points={midSnowPoints}
            fill="none"
            stroke="#E7EEF6"
            strokeWidth="2"
            strokeLinejoin="round"
            opacity="0.8"
          />
        </g>
      ))}
    </g>
  );
}
