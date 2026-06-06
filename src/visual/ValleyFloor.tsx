import { PALETTE } from '../game/constants';

interface Props {
  worldWidth: number;
  groundY: number;
}

// Green valley floor visible far below the climbing wall. A wobbly-topped band
// at the bottom of the sky, with a foot-of-wall haze gradient above it.
export function ValleyFloor({ worldWidth, groundY }: Props) {
  // Place the floor top at 86% of groundY so it's visible below the wall.
  const floorTopPercent = 0.86;
  const floorY = groundY * floorTopPercent;
  const hazeTopY = floorY - groundY * 0.12;

  // Wobbly top edge
  const wobblePoints: Array<[number, number]> = [
    [0, floorY + groundY * 0.015],
    [worldWidth * 0.14, floorY - groundY * 0.012],
    [worldWidth * 0.28, floorY + groundY * 0.010],
    [worldWidth * 0.42, floorY - groundY * 0.016],
    [worldWidth * 0.56, floorY + groundY * 0.006],
    [worldWidth * 0.70, floorY - groundY * 0.014],
    [worldWidth * 0.84, floorY + groundY * 0.012],
    [worldWidth, floorY - groundY * 0.006],
  ];
  const topEdgePath =
    wobblePoints.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const floorFillPath = `${topEdgePath} L ${worldWidth} ${groundY} L 0 ${groundY} Z`;
  const floorRimPoints = wobblePoints.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

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

      {/* Haze fading the foot of the wall into the valley */}
      <rect
        x={0}
        y={hazeTopY}
        width={worldWidth}
        height={floorY - hazeTopY + 4}
        fill="url(#valleyHazeGradient)"
      />

      {/* Valley floor body */}
      <path d={floorFillPath} fill="url(#valleyFloorGradient)" />

      {/* Wobbly rim line on the ground edge */}
      <polyline
        points={floorRimPoints}
        fill="none"
        stroke={PALETTE.ink}
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </>
  );
}
