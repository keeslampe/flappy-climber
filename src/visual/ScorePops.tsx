import { PALETTE } from '../game/constants';
import type { World } from '../game/types';

interface Props {
  world: World;
}

export function ScorePops({ world }: Props) {
  return (
    <g style={{ font: '800 18px JetBrains Mono, ui-monospace, monospace' }}>
      {world.scorePops.map((scorePop, i) => (
        <text
          key={i}
          x={scorePop.x}
          y={scorePop.y}
          opacity={scorePop.life}
          fill={PALETTE.yellow}
          stroke={PALETTE.ink}
          strokeWidth={3}
          paintOrder="stroke"
        >
          {scorePop.text}
        </text>
      ))}
    </g>
  );
}
