import { CLIMBER_DRAW_SIZE, CLIMBER_WAIST_RATIO } from '../game/constants';
import type { World } from '../game/types';
import { RadKidIdle }     from '../visual/climber/RadKidIdle';
import { RadKidClimbL }   from '../visual/climber/RadKidClimbL';
import { RadKidClimbMid } from '../visual/climber/RadKidClimbMid';
import { RadKidClimbR }   from '../visual/climber/RadKidClimbR';

interface Props {
  world: World;
}

// Picks the right RadKid frame from current game state and positions it on
// the SVG canvas so the sprite's waist anchor lines up with climber.y + 8
// (same anchor the rope and clip code use).
export function Climber({ world }: Props) {
  const { climber, keysUp, keysDown, tindeqMoving, status } = world;
  const moving = (keysUp || keysDown || tindeqMoving) && status === 'playing';

  let Frame: React.ComponentType;
  if (moving) {
    const phase = Math.floor(climber.animationTime * 1.6) % 4;
    Frame = phase === 0 ? RadKidClimbL : phase === 2 ? RadKidClimbR : RadKidClimbMid;
  } else {
    Frame = RadKidIdle;
  }

  const size = CLIMBER_DRAW_SIZE;
  const drawX = climber.x - size / 2;
  const drawY = climber.y + 8 - size * CLIMBER_WAIST_RATIO;

  return (
    <g transform={`translate(${drawX} ${drawY}) scale(${size / 128})`}>
      <Frame />
    </g>
  );
}
