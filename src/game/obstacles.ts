import { SCROLL_SPEED, WORLD_WIDTH } from './constants';
import { createRandom } from './randomNumberGenerator';
import type { Boulder, Obstacle, World } from './types';

// Spawn a random ground-level boulder cluster OR a tall wall slab.
export function spawnObstacle(world: World): void {
  const type: 'boulder' | 'wall' = Math.random() < 0.5 ? 'boulder' : 'wall';
  const seed = Math.floor(Math.random() * 99999);
  const random = createRandom(seed);

  if (type === 'boulder') {
    const count = 1 + Math.floor(random() * 2.4);
    const boulders: Boulder[] = [];
    for (let boulderIndex = 0; boulderIndex < count; boulderIndex++) {
      const radius = 28 + random() * 38;
      const offsetX =
        boulderIndex === 0
          ? 0
          : boulders[boulderIndex - 1].offsetX + boulders[boulderIndex - 1].radius * 1.4 + random() * 20;
      const squish = 0.55 + random() * 0.25;
      boulders.push({ offsetX, radius, squish, seed: Math.floor(random() * 9999) });
    }
    const last = boulders[boulders.length - 1];
    const totalWidth = last.offsetX + last.radius * 2 + 10;
    world.obstacles.push({
      kind: 'boulder',
      x: WORLD_WIDTH + 50,
      boulders,
      totalWidth,
      seed,
      scored: false,
    });
  } else {
    const wallWidth = 30 + random() * 45;
    const wallHeight = 160 + random() * 280;
    world.obstacles.push({
      kind: 'wall',
      x: WORLD_WIDTH + 30,
      wallWidth,
      wallHeight,
      seed,
      scored: false,
    });
  }
}

// Spawn one wide slab whose pixel width equals `duration` seconds of travel.
export function spawnIntervalWall(world: World, duration: number, heightM: number, groundY: number): void {
  const wallWidth = Math.round(duration * 60 * SCROLL_SPEED) + 20;
  const wallHeight = Math.min(heightM * 4, groundY - 30);
  const seed = Math.floor(Math.random() * 99999);
  world.obstacles.push({
    kind: 'interval',
    x: WORLD_WIDTH + 30,
    wallWidth,
    wallHeight,
    seed,
    scored: false,
  });
}

export function obstacleSpan(obstacle: Obstacle): number {
  return obstacle.kind === 'boulder' ? obstacle.totalWidth : obstacle.wallWidth;
}
