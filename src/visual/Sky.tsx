import { PALETTE } from '../game/constants';

interface Props {
  groundY: number;
  worldWidth: number;
}

// Valley Climb bluebird sky — bright daylight blue fading to pale horizon.
export function Sky({ groundY, worldWidth }: Props) {
  return (
    <>
      <defs>
        <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2={groundY} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={PALETTE.skyTop} />
          <stop offset="52%" stopColor={PALETTE.skyMid} />
          <stop offset="100%" stopColor={PALETTE.skyBottom} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={worldWidth} height={groundY} fill="url(#skyGradient)" />
    </>
  );
}
