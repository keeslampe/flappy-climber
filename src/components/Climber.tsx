import { CLIMBER_DRAW_SIZE, CLIMBER_WAIST_RATIO } from '../game/constants';
import type { World } from '../game/types';
import { RadKidIdle }     from './climber/RadKidIdle';
import { RadKidClimbL }   from './climber/RadKidClimbL';
import { RadKidClimbMid } from './climber/RadKidClimbMid';
import { RadKidClimbR }   from './climber/RadKidClimbR';
import { RadKidHurt }     from './climber/RadKidHurt';
// Available but not yet wired to game events — import when ready:
// import { RadKidDyno }    from './climber/RadKidDyno';   // high-force lunge
// import { RadKidFall }    from './climber/RadKidFall';   // post-collision tumble
// import { RadKidSummit }  from './climber/RadKidSummit'; // reached max height
// import { RadKidWalkA }   from './climber/RadKidWalkA';  // walk cycle frame A
// import { RadKidWalkB }   from './climber/RadKidWalkB';  // walk cycle frame B

interface Props {
  world: World;
}

// Picks the right RadKid frame from current game state and positions it on
// the SVG canvas so the sprite's waist anchor lines up with climber.y + 8
// (same anchor the rope and collision code use).
export function Climber({ world }: Props) {
  const { climber, hitCooldown, keysUp, keysDown, tindeqMoving, status, frameN } = world;
  const moving = (keysUp || keysDown || tindeqMoving) && status === 'playing';

  let Frame: React.ComponentType;
  if (hitCooldown > 60) {
    Frame = RadKidHurt;
  } else if (moving) {
    // 3-frame climb cycle: L → Mid → R → Mid → …
    const phase = Math.floor(climber.animT * 1.6) % 4;
    Frame = phase === 0 ? RadKidClimbL : phase === 2 ? RadKidClimbR : RadKidClimbMid;
  } else {
    Frame = RadKidIdle;
  }

  const size = CLIMBER_DRAW_SIZE;
  const drawX = climber.x - size / 2;
  const drawY = climber.y + 8 - size * CLIMBER_WAIST_RATIO;

  // Brief flicker during hit cooldown
  const opacity = hitCooldown > 0 && Math.floor(frameN / 4) % 2 === 0 ? 0.7 : 1;

  return (
    <g transform={`translate(${drawX} ${drawY}) scale(${size / 128})`} opacity={opacity}>
      <Frame />
    </g>
  );
}
