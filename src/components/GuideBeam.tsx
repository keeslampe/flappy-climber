import { PALETTE, SCROLL_SPEED, WORLD_WIDTH } from '../game/constants';
import type { World } from '../game/types';

interface Props {
  world: World;
  groundY: number;
}

// Terrain-following translucent band that shows where to climb. Drawn as one
// polygon whose top edge follows the obstacles, ramping over 0.5s of scroll
// distance to avoid vertical jumps.
export function GuideBeam({ world, groundY }: Props) {
  const beamHeight = world.climber.height + 22;
  const rampWidth = Math.round(0.5 * 60 * SCROLL_SPEED);

  type Point = { x: number; base: number };
  const points: Point[] = [{ x: 0, base: groundY }];

  const walls = world.obstacles
    .filter((obstacle): obstacle is Extract<typeof obstacle, { kind: 'wall' | 'interval' }> =>
      obstacle.kind === 'wall' || obstacle.kind === 'interval')
    .filter((wall) => wall.x < WORLD_WIDTH + rampWidth && wall.x + wall.wallWidth > -rampWidth)
    .sort((a, b) => a.x - b.x);

  for (const wall of walls) {
    points.push({ x: wall.x - rampWidth, base: groundY });
    points.push({ x: wall.x, base: groundY - wall.wallHeight });
    points.push({ x: wall.x + wall.wallWidth, base: groundY - wall.wallHeight });
    points.push({ x: wall.x + wall.wallWidth + rampWidth, base: groundY });
  }
  points.push({ x: WORLD_WIDTH, base: groundY });

  const topEdge = points.map((point) => `${point.x},${point.base - beamHeight}`).join(' ');
  const bottomEdge = points.map((point) => `${point.x},${point.base}`).reverse().join(' ');

  return (
    <polygon
      points={`${topEdge} ${bottomEdge}`}
      fill={PALETTE.teal}
      opacity={0.18}
    />
  );
}
