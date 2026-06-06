import { PALETTE } from '../game/constants';
import type { Anchor, World } from '../game/types';

// State colours matching the Valley Climb design reference.
const STATE_COLORS = {
  next:   { accent: PALETTE.teal,   badge: PALETTE.teal,   icon: 'arrow' as const },
  hit:    { accent: '#4CC66B',       badge: '#4CC66B',       icon: 'check' as const },
  locked: { accent: '#9A9A95',       badge: '#7A7A75',       icon: 'lock'  as const },
};

interface CarabinerProps {
  centerX: number;
  centerY: number;
  radiusX?: number;
  radiusY?: number;
  gate?: string;
  dimmed?: boolean;
}

function Carabiner({ centerX, centerY, radiusX = 9, radiusY = 13, gate = '#C7CDD4', dimmed = false }: CarabinerProps) {
  return (
    <g stroke={PALETTE.ink} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" opacity={dimmed ? 0.55 : 1}>
      <ellipse cx={centerX} cy={centerY} rx={radiusX} ry={radiusY} fill="none" stroke={PALETTE.ink} strokeWidth="5.4" />
      <ellipse cx={centerX} cy={centerY} rx={radiusX} ry={radiusY} fill="none" stroke={gate} strokeWidth="3" />
      <line x1={centerX + radiusX} y1={centerY - 4} x2={centerX + radiusX} y2={centerY + 4} stroke={PALETTE.ink} strokeWidth="2.4" />
    </g>
  );
}

type IconType = 'arrow' | 'check' | 'lock';

interface BadgeProps {
  icon: IconType;
  color: string;
  x?: number;
  y?: number;
}

function StateBadge({ icon, color, x = 58, y = 14 }: BadgeProps) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx="0" cy="0" r="11" fill={color} stroke={PALETTE.ink} strokeWidth="2.6" />
      <g stroke={PALETTE.cream} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {icon === 'check' && <path d="M-5 0 L-1 4 L6 -5" />}
        {icon === 'arrow' && <path d="M-5 0 L4 0 M0 -4 L5 0 L0 4" />}
        {icon === 'lock' && (
          <g>
            <rect x="-5" y="-1" width="10" height="8" rx="1.6" fill={PALETTE.cream} stroke={PALETTE.cream} />
            <path d="M-3 -1 V-4 Q0 -7 3 -4 V-1" stroke={PALETTE.cream} strokeWidth="2.2" fill="none" />
            <circle cx="0" cy="3" r="1.4" fill={color} stroke="none" />
          </g>
        )}
      </g>
    </g>
  );
}

interface SingleAnchorProps {
  state: 'locked' | 'next' | 'hit';
  slingColor?: string;
  size?: number;
}

// One bolt anchor — hanger plate + quickdraw (two carabiners + dogbone sling).
// Rendered in an 80×130 viewBox then scaled to `size` px tall.
function SingleBoltAnchor({ state, slingColor = PALETTE.pink, size = 92 }: SingleAnchorProps) {
  const colors = STATE_COLORS[state];
  const dimmed = state === 'locked';
  const displayWidth = size * (80 / 130);
  const displayHeight = size;

  return (
    <svg
      viewBox="0 0 80 130"
      width={displayWidth}
      height={displayHeight}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Pulsing highlight ring for the NEXT target */}
      {state === 'next' && (
        <g className="anchor-pulse" style={{ transformOrigin: '40px 64px' }}>
          <circle cx="40" cy="64" r="40" fill="none" stroke={PALETTE.yellow} strokeWidth="3.5" strokeDasharray="5 9" strokeLinecap="round" opacity="0.95" />
          <circle cx="40" cy="64" r="40" fill={PALETTE.yellow} opacity="0.10" />
        </g>
      )}

      <g opacity={dimmed ? 0.6 : 1}>
        {/* Bolt hanger plate */}
        <g stroke={PALETTE.ink} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
          <path d="M28 12 Q40 6 52 12 Q56 22 48 30 L32 30 Q24 22 28 12 Z" fill="#B9C0C8" />
          <circle cx="40" cy="16" r="5" fill="#7E858E" />
          <circle cx="40" cy="16" r="1.8" fill={PALETTE.ink} stroke="none" />
          <circle cx="40" cy="27" r="5.5" fill="#3C424B" />
          <circle cx="40" cy="27" r="5.5" fill="none" stroke={PALETTE.ink} strokeWidth="3" />
        </g>

        {/* Quickdraw — top carabiner + dogbone sling + bottom carabiner */}
        <Carabiner centerX={40} centerY={40} radiusX={8} radiusY={11} gate="#C7CDD4" dimmed={dimmed} />
        <path
          d="M33 50 Q31 64 33 78 L47 78 Q49 64 47 50 Q40 47 33 50 Z"
          fill={slingColor}
          stroke={PALETTE.ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M36 54 L36 74 M44 54 L44 74" stroke={PALETTE.ink} strokeWidth="1.6" opacity="0.4" />
        <Carabiner centerX={40} centerY={90} radiusX={9} radiusY={13} gate={colors.accent} dimmed={dimmed} />
      </g>

      {/* State badge */}
      <StateBadge icon={colors.icon} color={colors.badge} x={60} y={14} />
    </svg>
  );
}

interface BoltAnchorProps {
  anchor: Anchor;
  groundY: number;
}

export function BoltAnchorVisual({ anchor, groundY }: BoltAnchorProps) {
  const size = 92;
  // Position the anchor so the lower carabiner aligns with the clip point (waistY)
  const displayX = anchor.x - size * (80 / 130) / 2;
  const displayY = anchor.waistY - size * 0.9;

  return (
    <foreignObject x={displayX} y={displayY} width={size * (80 / 130) + 20} height={size + 20} style={{ overflow: 'visible' }}>
      <div>
        <SingleBoltAnchor state={anchor.state} />
      </div>
    </foreignObject>
  );
}

// SVG-native version (no foreignObject) — renders within the SVG coordinate space
export function BoltAnchorSvg({ anchor }: { anchor: Anchor }) {
  const size = 92;
  const colors = STATE_COLORS[anchor.state];
  const dimmed = anchor.state === 'locked';
  const displayWidth = size * (80 / 130);

  // Center the anchor on its x, with the clip point (waistY) at the lower carabiner
  const scaleValue = size / 130;
  const translateX = anchor.x - (displayWidth / 2);
  const translateY = anchor.waistY - size * 0.9;

  return (
    <g transform={`translate(${translateX} ${translateY}) scale(${scaleValue})`}>
      {anchor.state === 'next' && (
        <g className="anchor-pulse" style={{ transformOrigin: '40px 64px' }}>
          <circle cx="40" cy="64" r="40" fill="none" stroke={PALETTE.yellow} strokeWidth="3.5" strokeDasharray="5 9" strokeLinecap="round" opacity="0.95" />
          <circle cx="40" cy="64" r="40" fill={PALETTE.yellow} opacity="0.10" />
        </g>
      )}

      <g opacity={dimmed ? 0.6 : 1}>
        <g stroke={PALETTE.ink} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
          <path d="M28 12 Q40 6 52 12 Q56 22 48 30 L32 30 Q24 22 28 12 Z" fill="#B9C0C8" />
          <circle cx="40" cy="16" r="5" fill="#7E858E" />
          <circle cx="40" cy="16" r="1.8" fill={PALETTE.ink} stroke="none" />
          <circle cx="40" cy="27" r="5.5" fill="#3C424B" />
          <circle cx="40" cy="27" r="5.5" fill="none" stroke={PALETTE.ink} strokeWidth="3" />
        </g>

        <Carabiner centerX={40} centerY={40} radiusX={8} radiusY={11} gate="#C7CDD4" dimmed={dimmed} />
        <path
          d="M33 50 Q31 64 33 78 L47 78 Q49 64 47 50 Q40 47 33 50 Z"
          fill={PALETTE.pink}
          stroke={PALETTE.ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M36 54 L36 74 M44 54 L44 74" stroke={PALETTE.ink} strokeWidth="1.6" opacity="0.4" />
        <Carabiner centerX={40} centerY={90} radiusX={9} radiusY={13} gate={colors.accent} dimmed={dimmed} />
      </g>

      <StateBadge icon={colors.icon} color={colors.badge} x={60} y={14} />
    </g>
  );
}

interface BoltAnchorsProps {
  world: World;
  groundY: number;
}

export function BoltAnchors({ world }: BoltAnchorsProps) {
  return (
    <g>
      {world.anchors.map((anchor, index) => (
        <BoltAnchorSvg key={index} anchor={anchor} />
      ))}
    </g>
  );
}
