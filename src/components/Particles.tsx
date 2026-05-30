import type { World } from '../game/types';

interface Props {
  world: World;
}

export function Particles({ world }: Props) {
  return (
    <g>
      {world.particles.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.color} opacity={Math.max(0, p.life) * 0.85} />
      ))}
    </g>
  );
}
