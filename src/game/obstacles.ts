import { SCROLL_SPEED, W } from './constants';
import { rng } from './rng';
import type { Boulder, Obstacle, World } from './types';

// Spawn a random ground-level boulder cluster OR a tall wall slab.
export function spawnObstacle(world: World): void {
  const type: 'boulder' | 'wall' = Math.random() < 0.5 ? 'boulder' : 'wall';
  const seed = Math.floor(Math.random() * 99999);
  const r = rng(seed);

  if (type === 'boulder') {
    const count = 1 + Math.floor(r() * 2.4);
    const boulders: Boulder[] = [];
    for (let b = 0; b < count; b++) {
      const rad = 28 + r() * 38;
      const ox = b === 0 ? 0 : boulders[b - 1].ox + boulders[b - 1].r * 1.4 + r() * 20;
      const squish = 0.55 + r() * 0.25;
      boulders.push({ ox, r: rad, squish, seed: Math.floor(r() * 9999) });
    }
    const last = boulders[boulders.length - 1];
    const totalW = last.ox + last.r * 2 + 10;
    world.obstacles.push({
      kind: 'boulder',
      x: W + 50,
      boulders,
      totalW,
      seed,
      scored: false,
    });
  } else {
    const wallW = 30 + r() * 45;
    const wallH = 160 + r() * 280;
    world.obstacles.push({
      kind: 'wall',
      x: W + 30,
      wallW,
      wallH,
      seed,
      scored: false,
    });
  }
}

// Spawn one wide slab whose pixel width equals `duration` seconds of travel.
export function spawnIntervalWall(world: World, duration: number, heightM: number, groundY: number): void {
  const wallW = Math.round(duration * 60 * SCROLL_SPEED) + 20;
  const wallH = Math.min(heightM * 4, groundY - 30);
  const seed = Math.floor(Math.random() * 99999);
  world.obstacles.push({
    kind: 'interval',
    x: W + 30,
    wallW,
    wallH,
    seed,
    scored: false,
  });
}

export function obstacleSpan(o: Obstacle): number {
  return o.kind === 'boulder' ? o.totalW : o.wallW;
}
