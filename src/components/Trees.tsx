import { useMemo } from 'react';
import { PAL } from '../game/constants';
import { rng } from '../game/rng';

interface Props {
  layer: 0 | 1;
  W: number;
  groundY: number;
  bgScrollY: number;
}

interface Tree {
  x: number;
  baseOff: number;
  h: number;
  w: number;
  type: 'pine' | 'round';
  layer: 0 | 1;
  seed: number;
}

const BG_TREES: Tree[] = (() => {
  const trees: Tree[] = [];
  for (let i = 0; i < 32; i++) {
    const r2 = rng(i * 137 + 7);
    const layer: 0 | 1 = r2() < 0.55 ? 0 : 1;
    trees.push({
      x: r2() * (420 + 80),
      baseOff: layer === 0 ? -28 - r2() * 10 : -10 + r2() * 6,
      h: layer === 0 ? 110 + r2() * 50 : 140 + r2() * 60,
      w: layer === 0 ? 50 + r2() * 20 : 72 + r2() * 28,
      type: r2() < 0.55 ? 'pine' : 'round',
      layer,
      seed: Math.floor(r2() * 9999),
    });
  }
  trees.sort((a, b) => a.layer - b.layer);
  return trees;
})();

interface TreePalette {
  dark: string;
  light: string;
  trunk: string;
  strokeW: number;
}
const TREE_PAL: Record<0 | 1, TreePalette> = {
  0: { dark: '#3B6F4A', light: '#5B8E62', trunk: '#5C4632', strokeW: 2.2 },
  1: { dark: '#235437', light: '#3E7647', trunk: '#3C2A1B', strokeW: 2.8 },
};

export function Trees({ layer, W, groundY, bgScrollY }: Props) {
  const pal = TREE_PAL[layer];
  const parallax = layer === 0 ? 0.25 : 0.45;
  const span = W + 100;
  const trees = useMemo(() => BG_TREES.filter((t) => t.layer === layer), [layer]);

  return (
    <g strokeLinejoin="round" strokeLinecap="round" stroke={PAL.ink} strokeWidth={pal.strokeW}>
      {trees.map((t, i) => {
        const tx = ((t.x - bgScrollY * parallax) % span + span) % span - 50;
        const baseY = groundY + t.baseOff;
        return t.type === 'pine' ? (
          <Pine key={i} x={tx} baseY={baseY} w={t.w} h={t.h} pal={pal} />
        ) : (
          <RoundTree key={i} x={tx} baseY={baseY} w={t.w} h={t.h} pal={pal} />
        );
      })}
    </g>
  );
}

interface ShapeProps {
  x: number;
  baseY: number;
  w: number;
  h: number;
  pal: TreePalette;
}

function Pine({ x, baseY, w, h, pal }: ShapeProps) {
  const trunk = { x: x - w * 0.07, y: baseY - h * 0.13, w: w * 0.14, h: h * 0.13 };
  const tiers = [
    { fill: pal.dark, baseY: baseY - h * 0.10, topY: baseY - h * 0.46, halfW: w * 0.50 },
    { fill: pal.light, baseY: baseY - h * 0.42, topY: baseY - h * 0.74, halfW: w * 0.42 },
    { fill: pal.dark, baseY: baseY - h * 0.68, topY: baseY - h * 1.00, halfW: w * 0.32 },
  ];
  return (
    <g>
      <rect x={trunk.x} y={trunk.y} width={trunk.w} height={trunk.h} fill={pal.trunk} />
      {tiers.map((t, i) => (
        <polygon
          key={i}
          points={`${x},${t.topY} ${x + t.halfW},${t.baseY} ${x - t.halfW},${t.baseY}`}
          fill={t.fill}
        />
      ))}
    </g>
  );
}

function RoundTree({ x, baseY, w, h, pal }: ShapeProps) {
  const cy = baseY - h * 0.55;
  return (
    <g>
      <rect x={x - w * 0.08} y={baseY - h * 0.22} width={w * 0.16} height={h * 0.22} fill={pal.trunk} />
      <circle cx={x - w * 0.32} cy={cy + h * 0.05} r={w * 0.36} fill={pal.dark} />
      <circle cx={x + w * 0.34} cy={cy + h * 0.02} r={w * 0.42 * 0.95} fill={pal.dark} />
      <circle cx={x + w * 0.20} cy={cy + h * 0.20} r={w * 0.30} fill={pal.dark} />
      <circle cx={x - w * 0.05} cy={cy - h * 0.10} r={w * 0.42} fill={pal.light} />
      <circle cx={x - w * 0.22} cy={cy + h * 0.16} r={w * 0.30 * 0.9} fill={pal.light} />
    </g>
  );
}
