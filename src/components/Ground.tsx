import { useMemo } from 'react';
import { GRASS_CAP_HEIGHT, PALETTE } from '../game/constants';
import { createRandom } from '../game/randomNumberGenerator';

interface Props {
  worldWidth: number;
  groundY: number;
  viewportHeight: number;
  groundOffset: number;
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
  const random = createRandom(91);
  const items: PropItem[] = [];
  let x = 30;
  while (x < GROUND_PROPS_SPAN) {
    const which = random();
    let type: PropItem['type'];
    if (which < 0.35) type = 'flower';
    else if (which < 0.55) type = 'tuft';
    else if (which < 0.70) type = 'mushroom';
    else type = 'bush';
    const colors = [PALETTE.pink, PALETTE.yellow, PALETTE.cream, PALETTE.purple];
    const color =
      type === 'flower' ? colors[Math.floor(random() * 4)] : type === 'mushroom' ? PALETTE.pink : null;
    const size = type === 'bush' ? 28 + random() * 16 : 12 + random() * 8;
    items.push({ x, type, color, size, seed: Math.floor(random() * 9999) });
    x += 50 + random() * 90;
  }
  return items;
})();

// Bump parameters — match the design's alternating-teeth look
const BUMP_STEP = 34;   // px per segment
const BUMP_RAISE = 7;   // how far odd segments rise UP into the grass cap

export function Ground({ worldWidth, groundY, viewportHeight, groundOffset }: Props) {
  const grassY  = groundY;                        // flat top surface (where player walks)
  const dirtTop = groundY + GRASS_CAP_HEIGHT;     // bottom of grass cap / top of dirt

  // Grass cap: flat top, bumpy/scalloped bottom edge.
  // Even segments sit flush at dirtTop; odd segments rise UP by BUMP_RAISE,
  // creating the teeth-into-grass look from the design reference.
  const grassPathData = useMemo(() => {
    let pathData = `M -20 ${grassY} L ${worldWidth + 40} ${grassY}`;
    for (let x = worldWidth + 40; x >= -20; x -= BUMP_STEP) {
      const worldX = x + groundOffset;
      const segment = Math.floor(worldX / BUMP_STEP);
      const raise = segment % 2 === 0 ? 0 : BUMP_RAISE + (Math.abs(segment * 53) % 3);
      pathData += ` L ${x} ${dirtTop - raise}`;
    }
    pathData += ` L -20 ${dirtTop} Z`;
    return pathData;
  }, [worldWidth, groundOffset, grassY, dirtTop]);

  // Grass blades: short downward strokes along the bumpy edge, world-locked
  const blades = useMemo(() => Array.from({ length: 28 }, (_, i) => ({
    x: (((i * 47 + 10 - groundOffset) % (worldWidth + 80)) + worldWidth + 80) % (worldWidth + 80) - 40,
    tilt: i % 2 === 0 ? -2 : 2,
  })), [worldWidth, groundOffset]);

  // Pebbles — scrolling, in the lower dark dirt band
  const pebbles = Array.from({ length: 7 }, (_, i) => ({
    x: (((i * 137 - groundOffset * 0.9) % (worldWidth + 60)) + worldWidth + 60) % (worldWidth + 60) - 30,
    y: viewportHeight - 16 - ((i * 19) % 10),
  }));

  // Speckles in the upper dirt body
  const speckles = Array.from({ length: 30 }, (_, i) => ({
    x: (((i * 71 - groundOffset * 0.9) % (worldWidth + 30)) + worldWidth + 30) % (worldWidth + 30) - 15,
    y: dirtTop + 5 + ((i * 37) % (viewportHeight - dirtTop - 18)),
    radius: 1.5 + ((i * 13) % 3),
  }));

  return (
    <>
      {/* ── Dirt body ── */}
      <rect x={0} y={dirtTop} width={worldWidth} height={viewportHeight - dirtTop} fill="#7A4F2E" />
      {/* Darker lower band — matches the design's two-tone dirt */}
      <rect
        x={0}
        y={dirtTop + (viewportHeight - dirtTop) * 0.42}
        width={worldWidth}
        height={(viewportHeight - dirtTop) * 0.65}
        fill="#5C3A20"
      />

      {/* Dirt speckles */}
      <g fill="#3C2412">
        {speckles.map((speckle, i) => (
          <circle key={i} cx={speckle.x} cy={speckle.y} r={speckle.radius} />
        ))}
      </g>

      {/* Pebbles in lower stripe */}
      <g stroke={PALETTE.ink} strokeWidth={1.6} strokeLinejoin="round">
        {pebbles.map((pebble, i) => (
          <ellipse key={i} cx={pebble.x} cy={pebble.y} rx={11} ry={5} fill="#A98266" />
        ))}
      </g>

      {/* ── Grass cap ── */}
      <path
        d={grassPathData}
        fill="#4F8252"
        stroke={PALETTE.ink}
        strokeWidth={3}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Highlight stripe near the top of the grass cap */}
      <line
        x1={0}  y1={grassY + GRASS_CAP_HEIGHT * 0.28}
        x2={worldWidth}  y2={grassY + GRASS_CAP_HEIGHT * 0.28}
        stroke="#7BB07F" strokeWidth={3} opacity={0.65}
      />

      {/* Grass blades — short strokes inside the grass near the bumpy bottom edge */}
      <g stroke="#2A4A2E" strokeWidth={1.8} strokeLinecap="round" fill="none">
        {blades.map((blade, i) =>
          blade.x > -10 && blade.x < worldWidth + 10 ? (
            <line
              key={i}
              x1={blade.x}               y1={dirtTop - 2}
              x2={blade.x + blade.tilt}  y2={dirtTop - 9}
            />
          ) : null
        )}
      </g>

      {/* Ground decoration props */}
      {GROUND_PROPS.map((prop, i) => {
        const propX =
          (((prop.x - groundOffset) % GROUND_PROPS_SPAN) + GROUND_PROPS_SPAN) % GROUND_PROPS_SPAN - 100;
        if (propX < -60 || propX > worldWidth + 60) return null;
        const propY = grassY + 2;
        if (prop.type === 'flower')   return <Flower   key={i} x={propX} baseY={propY} color={prop.color!} />;
        if (prop.type === 'tuft')     return <GrassTuft key={i} x={propX} baseY={propY} />;
        if (prop.type === 'mushroom') return <Mushroom  key={i} x={propX} baseY={propY} />;
        return <Bush key={i} x={propX} baseY={propY} size={prop.size} />;
      })}
    </>
  );
}

function Flower({ x, baseY, color }: { x: number; baseY: number; color: string }) {
  const petalY = baseY - 12;
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <line x1={x} y1={baseY} x2={x} y2={baseY - 10} stroke="#3E7647" strokeWidth={1.8} />
      <g stroke={PALETTE.ink} strokeWidth={1.4} fill={color}>
        <circle cx={x - 3} cy={petalY + 2} r={2.6} />
        <circle cx={x + 3} cy={petalY + 2} r={2.6} />
        <circle cx={x - 2} cy={petalY - 2} r={2.6} />
        <circle cx={x + 2} cy={petalY - 2} r={2.6} />
        <circle cx={x}     cy={petalY}     r={2.6} />
      </g>
      <circle cx={x} cy={petalY} r={1.4} fill={PALETTE.yellow} />
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
      {blades.map(([offsetX, offsetY, color], i) => (
        <line key={i} x1={x + offsetX} y1={baseY} x2={x + offsetX * 0.5} y2={baseY + offsetY} stroke={color} />
      ))}
    </g>
  );
}

function Mushroom({ x, baseY }: { x: number; baseY: number }) {
  return (
    <g stroke={PALETTE.ink} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M ${x - 3} ${baseY - 6} L ${x - 3} ${baseY} L ${x + 3} ${baseY} L ${x + 3} ${baseY - 6} Z`} fill={PALETTE.cream} />
      <path d={`M ${x - 6} ${baseY - 6} Q ${x} ${baseY - 14} ${x + 6} ${baseY - 6} Z`} fill={PALETTE.pink} />
      <circle cx={x - 2} cy={baseY - 8} r={0.9} fill={PALETTE.cream} stroke="none" />
      <circle cx={x + 2} cy={baseY - 9} r={0.9} fill={PALETTE.cream} stroke="none" />
    </g>
  );
}

function Bush({ x, baseY, size }: { x: number; baseY: number; size: number }) {
  const width = size;
  const height = size * 0.55;
  const pathData =
    `M ${x - width * 0.5} ${baseY} ` +
    `Q ${x - width * 0.55} ${baseY - height * 0.7}  ${x - width * 0.25} ${baseY - height * 0.85} ` +
    `Q ${x}                ${baseY - height * 1.1}   ${x + width * 0.18} ${baseY - height * 0.85} ` +
    `Q ${x + width * 0.5}  ${baseY - height * 0.95}  ${x + width * 0.5}  ${baseY - height * 0.5} ` +
    `Q ${x + width * 0.55} ${baseY}                  ${x + width * 0.3}  ${baseY} ` +
    `L ${x - width * 0.3} ${baseY} Z`;
  return (
    <g stroke={PALETTE.ink} strokeWidth={2.4} strokeLinejoin="round">
      <path d={pathData} fill="#3E7647" />
      <path
        d={`M ${x - width * 0.2} ${baseY - height * 0.65} Q ${x} ${baseY - height * 0.85} ${x + width * 0.18} ${baseY - height * 0.65}`}
        fill="none" stroke="#FFF6E5" strokeWidth={1.6} opacity={0.45}
      />
    </g>
  );
}
