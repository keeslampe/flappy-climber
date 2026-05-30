import type { World } from '../game/types';

interface Props {
  world: World;
}

export function Particles({ world }: Props) {
  return (
    <g>
      {world.particles.map((particle, i) => (
        <circle
          key={i}
          cx={particle.x}
          cy={particle.y}
          r={particle.radius}
          fill={particle.color}
          opacity={Math.max(0, particle.life) * 0.85}
        />
      ))}
    </g>
  );
}
