import { ANCHOR_SPACING_PIXELS, WORLD_WIDTH } from './constants';
import { targetHeightAtDistance } from './mountainProfile';
import { getGroundY, waistYForHeight } from './world';
import type { Anchor, World } from './types';

export function spawnAnchor(world: World, viewportHeight: number): Anchor {
  const groundY = getGroundY(viewportHeight);
  const spawnX = WORLD_WIDTH + 30;
  const pixelsAhead = spawnX - world.climber.x;
  let heightMeters = targetHeightAtDistance(world, pixelsAhead);

  // The clip at the end of a pull / start of a rest sits at the pull height, not
  // the rest level. If this is the first rest clip right after a pull (the
  // previous clip-spacing back was still climbing), lift it to that pull height.
  if (heightMeters === 0) {
    const previousHeight = targetHeightAtDistance(world, pixelsAhead - ANCHOR_SPACING_PIXELS);
    if (previousHeight > 0) heightMeters = previousHeight;
  }

  const waistY = waistYForHeight(heightMeters, groundY);
  return {
    x: spawnX,
    heightMeters,
    waistY,
    state: 'locked',
    seed: Math.floor(Math.random() * 10000),
  };
}
