import { PALETTE } from '../game/constants';
import { createRandom } from '../game/randomNumberGenerator';
import { GroundBase } from '../visual/GroundBase';

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

export function Ground({ worldWidth, groundY, viewportHeight, groundOffset }: Props) {
  const propY = groundY + 2;

  return (
    <>
      <GroundBase worldWidth={worldWidth} groundY={groundY} viewportHeight={viewportHeight} groundOffset={groundOffset} />
      {GROUND_PROPS.map((prop, i) => {
        const propX =
          (((prop.x - groundOffset) % GROUND_PROPS_SPAN) + GROUND_PROPS_SPAN) % GROUND_PROPS_SPAN - 100;
        if (propX < -60 || propX > worldWidth + 60) return null;
        if (prop.type === 'flower')   return <Flower    key={i} x={propX} baseY={propY} color={prop.color!} />;
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
