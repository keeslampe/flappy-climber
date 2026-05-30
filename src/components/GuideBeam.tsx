import { PAL, SCROLL_SPEED, W } from '../game/constants';
import type { World } from '../game/types';

interface Props {
  world: World;
  groundY: number;
}

// Terrain-following translucent band that shows where to climb. Drawn as one
// polygon whose top edge follows the obstacles, ramping over 0.5s of scroll
// distance to avoid vertical jumps.
export function GuideBeam({ world, groundY }: Props) {
  const beamH = world.climber.h + 22;
  const rampW = Math.round(0.5 * 60 * SCROLL_SPEED);

  type Point = { x: number; base: number };
  const pts: Point[] = [{ x: 0, base: groundY }];

  const walls = world.obstacles
    .filter((o): o is Extract<typeof o, { kind: 'wall' | 'interval' }> =>
      o.kind === 'wall' || o.kind === 'interval')
    .filter((o) => o.x < W + rampW && o.x + o.wallW > -rampW)
    .sort((a, b) => a.x - b.x);

  for (const w of walls) {
    pts.push({ x: w.x - rampW, base: groundY });
    pts.push({ x: w.x, base: groundY - w.wallH });
    pts.push({ x: w.x + w.wallW, base: groundY - w.wallH });
    pts.push({ x: w.x + w.wallW + rampW, base: groundY });
  }
  pts.push({ x: W, base: groundY });

  const top = pts.map((p) => `${p.x},${p.base - beamH}`).join(' ');
  const bottom = pts.map((p) => `${p.x},${p.base}`).reverse().join(' ');

  return (
    <polygon
      points={`${top} ${bottom}`}
      fill={PAL.teal}
      opacity={0.18}
    />
  );
}
