import { PALETTE } from '../game/constants';

interface Props {
  worldWidth: number;
  groundY: number;
}

// Translucent horizontal band that fades the distant ranges into the air,
// giving the mountains an atmospheric depth. Sits between Mountains and Clouds.
export function HorizonHaze({ worldWidth, groundY }: Props) {
  const topY = groundY * 0.30;
  const height = groundY * 0.34;
  const hazeColor = PALETTE.horizonHaze;

  return (
    <>
      <defs>
        <linearGradient id="horizonHazeGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={hazeColor} stopOpacity="0" />
          <stop offset="55%" stopColor={hazeColor} stopOpacity="0.5" />
          <stop offset="100%" stopColor={hazeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        x={0}
        y={topY}
        width={worldWidth}
        height={height}
        fill="url(#horizonHazeGradient)"
      />
    </>
  );
}
