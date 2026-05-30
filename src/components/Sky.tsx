import { PAL } from '../game/constants';

interface Props {
  groundY: number;
  W: number;
}

// Dusk gradient — warm peach to pale cream near the horizon.
export function Sky({ groundY, W }: Props) {
  return (
    <>
      <defs>
        <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2={groundY} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFB47A" />
          <stop offset="55%" stopColor="#FFD089" />
          <stop offset="100%" stopColor="#FFE9BF" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={groundY} fill="url(#skyGradient)" />
      <rect x={0} y={groundY} width={W} height={2} fill={PAL.ink} opacity={0} />
    </>
  );
}
