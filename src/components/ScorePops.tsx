import { PAL } from '../game/constants';
import type { World } from '../game/types';

interface Props {
  world: World;
}

export function ScorePops({ world }: Props) {
  return (
    <g style={{ font: '800 18px JetBrains Mono, ui-monospace, monospace' }}>
      {world.scorePops.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={p.y}
          opacity={p.life}
          fill={PAL.yellow}
          stroke={PAL.ink}
          strokeWidth={3}
          paintOrder="stroke"
        >
          {p.txt}
        </text>
      ))}
    </g>
  );
}
