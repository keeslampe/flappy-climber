import { useMemo } from 'react';
import { GRASS_CAP_H, PAL } from '../game/constants';
import { rng } from '../game/rng';

interface Props {
  W: number;
  groundY: number;
  viewportH: number;
  groundOff: number;
}

interface PropItem {
  x: number;
  type: 'flower' | 'tuft' | 'mushroom' | 'bush';
  color: string | null;
  size: number;
  seed: number;
}

const GROUND_PROPS_SPAN = 1200;
const GROUND_PROPS: PropItem[] = (() => {
  const r = rng(91);
  const items: PropItem[] = [];
  let x = 30;
  while (x < GROUND_PROPS_SPAN) {
    const which = r();
    let type: PropItem['type'];
    if (which < 0.35) type = 'flower';
    else if (which < 0.55) type = 'tuft';
    else if (which < 0.70) type = 'mushroom';
    else type = 'bush';
    const colors = [PAL.pink, PAL.yellow, PAL.cream, PAL.purple];
    const color =
      type === 'flower' ? colors[Math.floor(r() * 4)] : type === 'mushroom' ? PAL.pink : null;
    const size = type === 'bush' ? 28 + r() * 16 : 12 + r() * 8;
    items.push({ x, type, color, size, seed: Math.floor(r() * 9999) });
    x += 50 + r() * 90;
  }
  return items;
})();

// Bump parameters — match the design's alternating-teeth look
const BUMP_STEP = 34;   // px per segment
const BUMP_RAISE = 7;   // how far odd segments rise UP into the grass cap

export function Ground({ W, groundY, viewportH, groundOff }: Props) {
  const grassY  = groundY;           // flat top surface (where player walks)
  const dirtTop = groundY + GRASS_CAP_H; // bottom of grass cap / top of dirt

  // Grass cap: flat top, bumpy/scalloped bottom edge.
  // Even segments sit flush at dirtTop; odd segments rise UP by BUMP_RAISE,
  // creating the teeth-into-grass look from the design reference.
  const grassPathD = useMemo(() => {
    let d = `M -20 ${grassY} L ${W + 40} ${grassY}`;
    for (let x = W + 40; x >= -20; x -= BUMP_STEP) {
      const worldX = x + groundOff;
      const seg = Math.floor(worldX / BUMP_STEP);
      const raise = seg % 2 === 0 ? 0 : BUMP_RAISE + (Math.abs(seg * 53) % 3);
      d += ` L ${x} ${dirtTop - raise}`;
    }
    d += ` L -20 ${dirtTop} Z`;
    return d;
  }, [W, groundOff, grassY, dirtTop]);

  // Grass blades: short downward strokes along the bumpy edge, world-locked
  const blades = useMemo(() => Array.from({ length: 28 }, (_, i) => ({
    x: (((i * 47 + 10 - groundOff) % (W + 80)) + W + 80) % (W + 80) - 40,
    tilt: i % 2 === 0 ? -2 : 2,
  })), [W, groundOff]);

  // Pebbles — scrolling, in the lower dark dirt band
  const pebbles = Array.from({ length: 7 }, (_, i) => ({
    x: (((i * 137 - groundOff * 0.9) % (W + 60)) + W + 60) % (W + 60) - 30,
    y: viewportH - 16 - ((i * 19) % 10),
  }));

  // Speckles in the upper dirt body
  const speckles = Array.from({ length: 30 }, (_, i) => ({
    x: (((i * 71 - groundOff * 0.9) % (W + 30)) + W + 30) % (W + 30) - 15,
    y: dirtTop + 5 + ((i * 37) % (viewportH - dirtTop - 18)),
    r: 1.5 + ((i * 13) % 3),
  }));

  return (
    <>
      {/* ── Dirt body ── */}
      <rect x={0} y={dirtTop} width={W} height={viewportH - dirtTop} fill="#7A4F2E" />
      {/* Darker lower band — matches the design's two-tone dirt */}
      <rect
        x={0}
        y={dirtTop + (viewportH - dirtTop) * 0.42}
        width={W}
        height={(viewportH - dirtTop) * 0.65}
        fill="#5C3A20"
      />

      {/* Dirt speckles */}
      <g fill="#3C2412">
        {speckles.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} />
        ))}
      </g>

      {/* Pebbles in lower stripe */}
      <g stroke={PAL.ink} strokeWidth={1.6} strokeLinejoin="round">
        {pebbles.map((p, i) => (
          <ellipse key={i} cx={p.x} cy={p.y} rx={11} ry={5} fill="#A98266" />
        ))}
      </g>

      {/* ── Grass cap ── */}
      <path
        d={grassPathD}
        fill="#4F8252"
        stroke={PAL.ink}
        strokeWidth={3}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Highlight stripe near the top of the grass cap */}
      <line
        x1={0}  y1={grassY + GRASS_CAP_H * 0.28}
        x2={W}  y2={grassY + GRASS_CAP_H * 0.28}
        stroke="#7BB07F" strokeWidth={3} opacity={0.65}
      />

      {/* Grass blades — short strokes inside the grass near the bumpy bottom edge */}
      <g stroke="#2A4A2E" strokeWidth={1.8} strokeLinecap="round" fill="none">
        {blades.map((b, i) =>
          b.x > -10 && b.x < W + 10 ? (
            <line
              key={i}
              x1={b.x}           y1={dirtTop - 2}
              x2={b.x + b.tilt}  y2={dirtTop - 9}
            />
          ) : null
        )}
      </g>

      {/* Ground decoration props */}
      {GROUND_PROPS.map((p, i) => {
        const px =
          (((p.x - groundOff) % GROUND_PROPS_SPAN) + GROUND_PROPS_SPAN) % GROUND_PROPS_SPAN - 100;
        if (px < -60 || px > W + 60) return null;
        const y = grassY + 2;
        if (p.type === 'flower')   return <Flower   key={i} x={px} baseY={y} color={p.color!} />;
        if (p.type === 'tuft')     return <GrassTuft key={i} x={px} baseY={y} />;
        if (p.type === 'mushroom') return <Mushroom  key={i} x={px} baseY={y} />;
        return <Bush key={i} x={px} baseY={y} size={p.size} />;
      })}
    </>
  );
}

function Flower({ x, baseY, color }: { x: number; baseY: number; color: string }) {
  const petalY = baseY - 12;
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <line x1={x} y1={baseY} x2={x} y2={baseY - 10} stroke="#3E7647" strokeWidth={1.8} />
      <g stroke={PAL.ink} strokeWidth={1.4} fill={color}>
        <circle cx={x - 3} cy={petalY + 2} r={2.6} />
        <circle cx={x + 3} cy={petalY + 2} r={2.6} />
        <circle cx={x - 2} cy={petalY - 2} r={2.6} />
        <circle cx={x + 2} cy={petalY - 2} r={2.6} />
        <circle cx={x}     cy={petalY}     r={2.6} />
      </g>
      <circle cx={x} cy={petalY} r={1.4} fill={PAL.yellow} />
    </g>
  );
}

function GrassTuft({ x, baseY }: { x: number; baseY: number }) {
  const blades: [number, number, string][] = [
    [-6, -8,  '#2A4A2E'],
    [-2, -12, '#3E7647'],
    [2,  -14, '#4F8252'],
    [6,  -11, '#3E7647'],
    [10, -7,  '#2A4A2E'],
  ];
  return (
    <g strokeWidth={1.8} strokeLinecap="round" fill="none">
      {blades.map(([dx, dy, color], i) => (
        <line key={i} x1={x + dx} y1={baseY} x2={x + dx * 0.5} y2={baseY + dy} stroke={color} />
      ))}
    </g>
  );
}

function Mushroom({ x, baseY }: { x: number; baseY: number }) {
  return (
    <g stroke={PAL.ink} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M ${x - 3} ${baseY - 6} L ${x - 3} ${baseY} L ${x + 3} ${baseY} L ${x + 3} ${baseY - 6} Z`} fill={PAL.cream} />
      <path d={`M ${x - 6} ${baseY - 6} Q ${x} ${baseY - 14} ${x + 6} ${baseY - 6} Z`} fill={PAL.pink} />
      <circle cx={x - 2} cy={baseY - 8} r={0.9} fill={PAL.cream} stroke="none" />
      <circle cx={x + 2} cy={baseY - 9} r={0.9} fill={PAL.cream} stroke="none" />
    </g>
  );
}

function Bush({ x, baseY, size }: { x: number; baseY: number; size: number }) {
  const w = size;
  const h = size * 0.55;
  const d =
    `M ${x - w * 0.5} ${baseY} ` +
    `Q ${x - w * 0.55} ${baseY - h * 0.7}  ${x - w * 0.25} ${baseY - h * 0.85} ` +
    `Q ${x}           ${baseY - h * 1.1}   ${x + w * 0.18} ${baseY - h * 0.85} ` +
    `Q ${x + w * 0.5} ${baseY - h * 0.95}  ${x + w * 0.5}  ${baseY - h * 0.5} ` +
    `Q ${x + w * 0.55} ${baseY}            ${x + w * 0.3}  ${baseY} ` +
    `L ${x - w * 0.3} ${baseY} Z`;
  return (
    <g stroke={PAL.ink} strokeWidth={2.4} strokeLinejoin="round">
      <path d={d} fill="#3E7647" />
      <path
        d={`M ${x - w * 0.2} ${baseY - h * 0.65} Q ${x} ${baseY - h * 0.85} ${x + w * 0.18} ${baseY - h * 0.65}`}
        fill="none" stroke="#FFF6E5" strokeWidth={1.6} opacity={0.45}
      />
    </g>
  );
}
