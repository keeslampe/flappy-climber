import { CLIMBER_DRAW_SIZE, CLIMBER_WAIST_RATIO } from '../game/constants';
import type { World } from '../game/types';
import { RadKidIdle }     from '../visual/climber/RadKidIdle';
import { RadKidClimbL }   from '../visual/climber/RadKidClimbL';
import { RadKidClimbMid } from '../visual/climber/RadKidClimbMid';
import { RadKidClimbR }   from '../visual/climber/RadKidClimbR';
import { RadKidWalkA }    from '../visual/climber/RadKidWalkA';
import { RadKidWalkB }    from '../visual/climber/RadKidWalkB';
import { RadKidAbseil }   from '../visual/climber/RadKidAbseil';

interface Props {
  world: World;
  groundY: number;
}

// Chalk bucket worn on the right hip. Drawn on top of every frame so it stays
// visible across all animations (128×128 sprite space, right side at the waist).
function ChalkBucket() {
  return (
    <g stroke="#1A1A1A" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
      <path d="M82 90 Q80 103 85 109 Q92 111 98 107 Q101 100 99 90 Z" fill="#C77B4A" />
      <path d="M82 90 Q90 86 99 90 Q98 85 90 84 Q83 85 82 90 Z" fill="#E0A064" />
      <ellipse cx="90.5" cy="89" rx="8.5" ry="3" fill="#FFF6E5" stroke="none" />
      <ellipse cx="90.5" cy="89" rx="8.5" ry="3" fill="none" strokeWidth="2.2" />
      <path d="M90 84 L90 79 Q90 76 86 77" strokeWidth="2" fill="none" />
    </g>
  );
}

// Picks the RadKid frame from the current motion and positions it so the sprite's
// waist anchor lines up with climber.y + 8 (same anchor the rope and clips use):
//   climbing up → climb cycle (arms + legs, chalk puffs from tick)
//   on the ground while the world scrolls → walk cycle
//   descending mid-wall → abseil
//   otherwise → idle hang
export function Climber({ world, groundY }: Props) {
  const { climber, climberMotion, status } = world;
  const onGround = climber.y >= groundY - 60;

  let Frame: React.ComponentType;
  if (status === 'playing' && climberMotion === 'up') {
    const phase = Math.floor(climber.animationTime * 1.6) % 4;
    Frame = phase === 0 ? RadKidClimbL : phase === 2 ? RadKidClimbR : RadKidClimbMid;
  } else if (status === 'playing' && onGround) {
    Frame = Math.floor(climber.animationTime * 2) % 2 === 0 ? RadKidWalkA : RadKidWalkB;
  } else if (status === 'playing' && climberMotion === 'down') {
    Frame = RadKidAbseil;
  } else {
    Frame = RadKidIdle;
  }

  const size = CLIMBER_DRAW_SIZE;
  const drawX = climber.x - size / 2;
  const drawY = climber.y + 8 - size * CLIMBER_WAIST_RATIO;

  return (
    <g transform={`translate(${drawX} ${drawY}) scale(${size / 128})`}>
      <Frame />
      <g transform="translate(77 96) scale(0.6) translate(-90 -96)">
        <ChalkBucket />
      </g>
    </g>
  );
}
