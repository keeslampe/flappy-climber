import { WORLD_WIDTH } from './constants';
import { targetHeightAtDistance } from './mountainProfile';
import { getGroundY, waistYForHeight } from './world';
import type { Anchor, World } from './types';

export function spawnAnchor(world: World, viewportHeight: number): Anchor {
  const groundY = getGroundY(viewportHeight);
  const spawnX = WORLD_WIDTH + 30;
  const pixelsAhead = spawnX - world.climber.x;
  const heightMeters = targetHeightAtDistance(world, pixelsAhead);
  const waistY = waistYForHeight(heightMeters, groundY);
  return {
    x: spawnX,
    heightMeters,
    waistY,
    state: 'locked',
    seed: Math.floor(Math.random() * 10000),
  };
}
