import type { World } from './types';

// Returns true if the climber has hit something. Caller handles cooldown.
export function checkCollision(world: World, groundY: number): boolean {
  const { climber, obstacles } = world;
  const halfWidth = climber.width / 2 - 5;
  const halfHeight = climber.height / 2 - 8;
  const centerX = climber.x;
  const centerY = climber.y;

  // Ground
  if (centerY + halfHeight >= groundY) {
    climber.y = groundY - halfHeight;
    return true;
  }

  for (const obstacle of obstacles) {
    if (obstacle.kind === 'boulder') {
      for (const boulder of obstacle.boulders) {
        const boulderX = obstacle.x + boulder.offsetX;
        const boulderY = groundY - boulder.radius * boulder.squish;
        const deltaX = centerX - boulderX;
        const deltaY = centerY - boulderY;
        const combinedRadiusX = boulder.radius + halfWidth;
        const combinedRadiusY = boulder.radius * boulder.squish + halfHeight;
        if (
          (deltaX * deltaX) / (combinedRadiusX * combinedRadiusX) +
            (deltaY * deltaY) / (combinedRadiusY * combinedRadiusY) <
          1
        )
          return true;
      }
    } else {
      if (
        centerX + halfWidth > obstacle.x + 3 &&
        centerX - halfWidth < obstacle.x + obstacle.wallWidth - 3 &&
        centerY + halfHeight > groundY - obstacle.wallHeight &&
        centerY - halfHeight < groundY
      ) {
        return true;
      }
    }
  }
  return false;
}
