import { PALETTE } from '../game/constants';
import type { World } from '../game/types';

interface Props {
  world: World;
}

// Builds a spiky "scream" starburst polygon centered on the origin.
function starburstPoints(spikes: number, outerRadius: number, innerRadius: number): string {
  const points: string[] = [];
  for (let index = 0; index < spikes * 2; index++) {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI * index) / spikes - Math.PI / 2;
    points.push(`${(Math.cos(angle) * radius).toFixed(1)},${(Math.sin(angle) * radius * 0.78).toFixed(1)}`);
  }
  return points.join(' ');
}

// A comic scream bubble that pops out of the climber when the active hand switches.
// Rendered inside the world SVG (aspect is preserved, so it scales cleanly). Driven
// entirely by world.handSwitchCue.life (1 → 0): a quick pop-in, then fade + rise.
export function HandSwitchBubble({ world }: Props) {
  const cue = world.handSwitchCue;
  if (!cue) return null;

  const color = cue.hand === 'left' ? PALETTE.teal : PALETTE.pink;
  const label = cue.hand === 'left' ? '✋ LEFT' : '🤚 RIGHT';

  const age = 1 - cue.life; // 0 at birth → 1 at death
  const popScale = Math.min(1, age / 0.12); // snap to full size in the first ~0.12
  const rise = age * 14; // float up slightly as it ages
  const opacity = Math.min(1, cue.life * 1.6); // hold opaque, fade only at the very end

  // Anchor up-and-right of the climber's head, tail pointing back down at it.
  // Clamp the top so a high pull (climber near the screen top) can't push it off.
  const centerX = world.climber.x + 54;
  const centerY = Math.max(74, world.climber.y - 62 - rise);
  const tailTipX = world.climber.x + 18;
  const tailTipY = world.climber.y - 28 - rise;

  return (
    <g opacity={opacity}>
      {/* Tail from the bubble toward the climber */}
      <path
        d={`M ${centerX - 18} ${centerY + 14} L ${tailTipX} ${tailTipY} L ${centerX + 6} ${centerY + 20} Z`}
        fill={PALETTE.cream}
        stroke="#1A1A1A"
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <g transform={`translate(${centerX} ${centerY}) scale(${popScale})`}>
        <polygon
          points={starburstPoints(13, 58, 44)}
          fill={PALETTE.cream}
          stroke={color}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <text
          x={0}
          y={-8}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontWeight={800}
          fontSize={16}
          fill="#1A1A1A"
        >
          {cue.isStart ? 'START!' : 'SWITCH!'}
        </text>
        <text
          x={0}
          y={13}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontWeight={800}
          fontSize={15}
          fill={color}
        >
          {label}
        </text>
      </g>
    </g>
  );
}
