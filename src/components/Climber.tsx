import { CLIMBER_DRAW_SIZE, CLIMBER_WAIST_RATIO } from '../game/constants';
import type { World } from '../game/types';
import { RadKidIdle }     from '../visual/climber/RadKidIdle';
import { RadKidClimbL }   from '../visual/climber/RadKidClimbL';
import { RadKidClimbMid } from '../visual/climber/RadKidClimbMid';
import { RadKidClimbR }   from '../visual/climber/RadKidClimbR';
import { RadKidHurt }     from '../visual/climber/RadKidHurt';
// Available but not yet wired to game events — import when ready:
// import { RadKidDyno }    from '../visual/climber/RadKidDyno';   // high-force lunge
// import { RadKidFall }    from '../visual/climber/RadKidFall';   // post-collision tumble
// import { RadKidSummit }  from '../visual/climber/RadKidSummit'; // reached max height
// import { RadKidWalkA }   from '../visual/climber/RadKidWalkA';  // walk cycle frame A
// import { RadKidWalkB }   from '../visual/climber/RadKidWalkB';  // walk cycle frame B

interface Props {
  world: World;
}

// Picks the right RadKid frame from current game state and positions it on
// the SVG canvas so the sprite's waist anchor lines up with climber.y + 8
// (same anchor the rope and collision code use).
export function Climber({ world }: Props) {
  const { climber, hitCooldown, keysUp, keysDown, tindeqMoving, status, frameNumber } = world;
  const moving = (keysUp || keysDown || tindeqMoving) && status === 'playing';

  let Frame: React.ComponentType;
  if (hitCooldown > 60) {
    Frame = RadKidHurt;
  } else if (moving) {
    // 3-frame climb cycle: L → Mid → R → Mid → …
    const phase = Math.floor(climber.animationTime * 1.6) % 4;
    Frame = phase === 0 ? RadKidClimbL : phase === 2 ? RadKidClimbR : RadKidClimbMid;
  } else {
    Frame = RadKidIdle;
  }

  const size = CLIMBER_DRAW_SIZE;
  const drawX = climber.x - size / 2;
  const drawY = climber.y + 8 - size * CLIMBER_WAIST_RATIO;

  // Brief flicker during hit cooldown
  const opacity = hitCooldown > 0 && Math.floor(frameNumber / 4) % 2 === 0 ? 0.7 : 1;

  return (
    <g transform={`translate(${drawX} ${drawY}) scale(${size / 128})`} opacity={opacity}>
      <Frame />
    </g>
  );
}
