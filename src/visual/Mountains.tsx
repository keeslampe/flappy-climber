import {
  HEIGHT_METER_BOTTOM_OFFSET,
  HEIGHT_METER_TOP_OFFSET,
  HEIGHT_SCALE_MAX,
  PALETTE,
} from '../game/constants';

interface Props {
  worldWidth: number;
  groundY: number;
  backgroundScrollY: number;
}

// Desaturated background mountain colours (matching design/mountain).
const FAR_FILL = '#A7BAC8';
const MID_FILL = '#5F7589';
const SNOW_FILL = '#F7FAFD';

// LCG PRNG matching the Valley Climb design's buildRange seed algorithm.
function lcgRandom(seed: number): () => number {
  let state = (seed >>> 0) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

// Sharp, angular ridgeline through the points, with the peaks/valleys only barely
// softened (roundness 0 = razor sharp, 0.5 = fully smooth) to match the design.
const RIDGE_ROUNDNESS = 0.1;

function ridgeTopPath(points: Array<[number, number]>): string {
  let data = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let index = 1; index < points.length - 1; index++) {
    const [previousX, previousY] = points[index - 1];
    const [cornerX, cornerY] = points[index];
    const [nextX, nextY] = points[index + 1];
    const enterX = cornerX + (previousX - cornerX) * RIDGE_ROUNDNESS;
    const enterY = cornerY + (previousY - cornerY) * RIDGE_ROUNDNESS;
    const exitX = cornerX + (nextX - cornerX) * RIDGE_ROUNDNESS;
    const exitY = cornerY + (nextY - cornerY) * RIDGE_ROUNDNESS;
    data += ` L ${enterX.toFixed(1)} ${enterY.toFixed(1)} Q ${cornerX.toFixed(1)} ${cornerY.toFixed(1)} ${exitX.toFixed(1)} ${exitY.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  data += ` L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
  return data;
}

interface SnowCap {
  top: [number, number];
  left: [number, number];
  right: [number, number];
}

interface RangeResult {
  topPath: string;
  fillPath: string;
  snowCaps: SnowCap[];
}

// One sharp range across 0..worldWidth. The crest is periodic — its y at x=0 equals
// its y at x=worldWidth — so the three tiled copies join with no vertical jump.
function buildRange(
  seed: number,
  baseY: number,
  amplitude: number,
  peakCount: number,
  worldWidth: number,
  bottomY: number,
): RangeResult {
  const random = lcgRandom(seed);
  const segment = worldWidth / peakCount;
  const startY = baseY - amplitude * (0.35 + 0.25 * random());
  const points: Array<[number, number]> = [[0, startY]];
  for (let index = 1; index <= peakCount; index++) {
    const peakX = (index - 0.5) * segment + (random() - 0.5) * segment * 0.25;
    const peakY = baseY - amplitude * (0.75 + 0.25 * random());
    const saddleX = index * segment;
    const saddleY = baseY - amplitude * (0.2 + 0.18 * random());
    points.push([+peakX.toFixed(1), +peakY.toFixed(1)]);
    points.push([+saddleX.toFixed(1), +saddleY.toFixed(1)]);
  }
  // Seamless wrap: the final anchor sits at worldWidth with the start height.
  points[points.length - 1] = [worldWidth, startY];

  // A small snow cap on the top of each peak: the tip plus two points a short way
  // down the left and right slopes (so it hugs the actual ridge).
  const capFraction = 0.2;
  const snowCaps: SnowCap[] = [];
  for (let index = 1; index < points.length - 1; index += 2) {
    const [previousX, previousY] = points[index - 1];
    const [cornerX, cornerY] = points[index];
    const [nextX, nextY] = points[index + 1];
    const top: [number, number] = [
      cornerX + 0.25 * RIDGE_ROUNDNESS * (previousX + nextX - 2 * cornerX),
      cornerY + 0.25 * RIDGE_ROUNDNESS * (previousY + nextY - 2 * cornerY),
    ];
    snowCaps.push({
      top,
      left: [cornerX + (previousX - cornerX) * capFraction, cornerY + (previousY - cornerY) * capFraction],
      right: [cornerX + (nextX - cornerX) * capFraction, cornerY + (nextY - cornerY) * capFraction],
    });
  }

  const topPath = ridgeTopPath(points);
  const fillPath = `${topPath} L ${worldWidth} ${bottomY} L 0 ${bottomY} Z`;
  return { topPath, fillPath, snowCaps };
}

// A white snow cap with a dark outline that hugs the peak tip and dips along a
// slightly wavy snow line underneath.
function SnowCapShape({ cap }: { cap: SnowCap }) {
  const { top, left, right } = cap;
  const midX = (left[0] + right[0]) / 2;
  const midY = (left[1] + right[1]) / 2;
  const dip = Math.abs(right[0] - left[0]) * 0.18;
  const data =
    `M ${left[0].toFixed(1)} ${left[1].toFixed(1)} ` +
    `L ${top[0].toFixed(1)} ${top[1].toFixed(1)} ` +
    `L ${right[0].toFixed(1)} ${right[1].toFixed(1)} ` +
    `Q ${midX.toFixed(1)} ${(midY + dip).toFixed(1)} ${left[0].toFixed(1)} ${left[1].toFixed(1)} Z`;
  return <path d={data} fill={SNOW_FILL} stroke={PALETTE.ink} strokeWidth="1.4" strokeLinejoin="round" />;
}

export function Mountains({ worldWidth, groundY, backgroundScrollY }: Props) {
  const bottomY = groundY;

  // Heights expressed in the game's kg ruler. The back (far) range sits 6 kg up;
  // the front (mid) range sits 5 kg up.
  const heightSpan = groundY - HEIGHT_METER_TOP_OFFSET - HEIGHT_METER_BOTTOM_OFFSET;
  const kilogramsInPixels = (kilograms: number) => (kilograms / HEIGHT_SCALE_MAX) * heightSpan;

  // Far range (palest, furthest back) — snow-capped peaks.
  const farAmplitude = groundY * 0.17;
  const far = buildRange(13 * 7 + 1, groundY * 0.5 - kilogramsInPixels(6), farAmplitude, 5, worldWidth, bottomY);

  // Mid range (front, deeper) — raised, no snow.
  const mid = buildRange(13 * 13 + 5, groundY * 0.52 - kilogramsInPixels(5), groundY * 0.12, 4, worldWidth, bottomY);

  // Parallax offsets — far scrolls slower than mid.
  const farOffset = (((backgroundScrollY * 0.05) % worldWidth) + worldWidth) % worldWidth;
  const midOffset = (((backgroundScrollY * 0.1) % worldWidth) + worldWidth) % worldWidth;

  return (
    <g>
      {/* Far peaks (palest) — fill, dark crest line, snow caps */}
      {[-1, 0, 1].map((tile) => (
        <g key={`far${tile}`} transform={`translate(${tile * worldWidth - farOffset} 0)`}>
          <path d={far.fillPath} fill={FAR_FILL} />
          <path d={far.topPath} fill="none" stroke={PALETTE.ink} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          {far.snowCaps.map((cap, index) => (
            <SnowCapShape key={index} cap={cap} />
          ))}
        </g>
      ))}

      {/* Mid peaks (deeper) — fill + dark crest line */}
      {[-1, 0, 1].map((tile) => (
        <g key={`mid${tile}`} transform={`translate(${tile * worldWidth - midOffset} 0)`}>
          <path d={mid.fillPath} fill={MID_FILL} />
          <path d={mid.topPath} fill="none" stroke={PALETTE.ink} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}
