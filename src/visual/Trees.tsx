import { useMemo } from 'react';
import { PALETTE } from '../game/constants';
import { createRandom } from '../game/randomNumberGenerator';

interface Props {
  layer: 0 | 1;
  worldWidth: number;
  groundY: number;
  backgroundScrollY: number;
}

interface Tree {
  x: number;
  baseOffset: number;
  height: number;
  width: number;
  type: 'pine' | 'round';
  layer: 0 | 1;
  seed: number;
}

const BACKGROUND_TREES: Tree[] = (() => {
  const trees: Tree[] = [];
  for (let i = 0; i < 32; i++) {
    const random = createRandom(i * 137 + 7);
    const layer: 0 | 1 = random() < 0.55 ? 0 : 1;
    trees.push({
      x: random() * (420 + 80),
      baseOffset: layer === 0 ? -28 - random() * 10 : -10 + random() * 6,
      height: layer === 0 ? 110 + random() * 50 : 140 + random() * 60,
      width: layer === 0 ? 50 + random() * 20 : 72 + random() * 28,
      type: random() < 0.55 ? 'pine' : 'round',
      layer,
      seed: Math.floor(random() * 9999),
    });
  }
  trees.sort((a, b) => a.layer - b.layer);
  return trees;
})();

interface TreeColors {
  dark: string;
  light: string;
  trunk: string;
  strokeWidth: number;
}
const TREE_COLORS: Record<0 | 1, TreeColors> = {
  0: { dark: '#3B6F4A', light: '#5B8E62', trunk: '#5C4632', strokeWidth: 2.2 },
  1: { dark: '#235437', light: '#3E7647', trunk: '#3C2A1B', strokeWidth: 2.8 },
};

export function Trees({ layer, worldWidth, groundY, backgroundScrollY }: Props) {
  const colors = TREE_COLORS[layer];
  const parallax = layer === 0 ? 0.25 : 0.45;
  const span = worldWidth + 100;
  const trees = useMemo(() => BACKGROUND_TREES.filter((tree) => tree.layer === layer), [layer]);

  return (
    <g strokeLinejoin="round" strokeLinecap="round" stroke={PALETTE.ink} strokeWidth={colors.strokeWidth}>
      {trees.map((tree, i) => {
        const treeX = ((tree.x - backgroundScrollY * parallax) % span + span) % span - 50;
        const baseY = groundY + tree.baseOffset;
        return tree.type === 'pine' ? (
          <Pine key={i} x={treeX} baseY={baseY} width={tree.width} height={tree.height} colors={colors} />
        ) : (
          <RoundTree key={i} x={treeX} baseY={baseY} width={tree.width} height={tree.height} colors={colors} />
        );
      })}
    </g>
  );
}

interface ShapeProps {
  x: number;
  baseY: number;
  width: number;
  height: number;
  colors: TreeColors;
}

function Pine({ x, baseY, width, height, colors }: ShapeProps) {
  const trunk = { x: x - width * 0.07, y: baseY - height * 0.13, width: width * 0.14, height: height * 0.13 };
  const tiers = [
    { fill: colors.dark, baseY: baseY - height * 0.10, topY: baseY - height * 0.46, halfWidth: width * 0.50 },
    { fill: colors.light, baseY: baseY - height * 0.42, topY: baseY - height * 0.74, halfWidth: width * 0.42 },
    { fill: colors.dark, baseY: baseY - height * 0.68, topY: baseY - height * 1.00, halfWidth: width * 0.32 },
  ];
  return (
    <g>
      <rect x={trunk.x} y={trunk.y} width={trunk.width} height={trunk.height} fill={colors.trunk} />
      {tiers.map((tier, i) => (
        <polygon
          key={i}
          points={`${x},${tier.topY} ${x + tier.halfWidth},${tier.baseY} ${x - tier.halfWidth},${tier.baseY}`}
          fill={tier.fill}
        />
      ))}
    </g>
  );
}

function RoundTree({ x, baseY, width, height, colors }: ShapeProps) {
  const centerY = baseY - height * 0.55;
  return (
    <g>
      <rect x={x - width * 0.08} y={baseY - height * 0.22} width={width * 0.16} height={height * 0.22} fill={colors.trunk} />
      <circle cx={x - width * 0.32} cy={centerY + height * 0.05} r={width * 0.36} fill={colors.dark} />
      <circle cx={x + width * 0.34} cy={centerY + height * 0.02} r={width * 0.42 * 0.95} fill={colors.dark} />
      <circle cx={x + width * 0.20} cy={centerY + height * 0.20} r={width * 0.30} fill={colors.dark} />
      <circle cx={x - width * 0.05} cy={centerY - height * 0.10} r={width * 0.42} fill={colors.light} />
      <circle cx={x - width * 0.22} cy={centerY + height * 0.16} r={width * 0.30 * 0.9} fill={colors.light} />
    </g>
  );
}
