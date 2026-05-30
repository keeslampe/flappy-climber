import type { World } from './types';

// Returns true if the climber has hit something. Caller handles cooldown.
export function checkCollision(world: World, groundY: number): boolean {
  const { climber, obstacles } = world;
  const hw = climber.w / 2 - 5;
  const hh = climber.h / 2 - 8;
  const cx = climber.x;
  const cy = climber.y;

  // Ground
  if (cy + hh >= groundY) {
    climber.y = groundY - hh;
    return true;
  }

  for (const obs of obstacles) {
    if (obs.kind === 'boulder') {
      for (const b of obs.boulders) {
        const bx = obs.x + b.ox;
        const by = groundY - b.r * b.squish;
        const dx = cx - bx;
        const dy = cy - by;
        const rx2 = b.r + hw;
        const ry2 = b.r * b.squish + hh;
        if ((dx * dx) / (rx2 * rx2) + (dy * dy) / (ry2 * ry2) < 1) return true;
      }
    } else {
      if (
        cx + hw > obs.x + 3 &&
        cx - hw < obs.x + obs.wallW - 3 &&
        cy + hh > groundY - obs.wallH &&
        cy - hh < groundY
      ) {
        return true;
      }
    }
  }
  return false;
}
