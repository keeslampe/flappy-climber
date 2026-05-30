// === Climber Game — Trees & foliage assets ===
// Converted from env-trees.jsx (Claude Design). Standalone SVG components.
// depth='far' | 'mid' | 'near' controls tone and stroke weight.

type Depth = 'far' | 'mid' | 'near';

interface Tone {
  dark:    string;
  light:   string;
  trunk:   string;
  ink:     string;
  stroke:  number;
  opacity: number;
}

const treeTones: Record<Depth, Tone> = {
  far:  { dark: '#3B6F4A', light: '#5B8E62', trunk: '#5C4632', ink: '#1A1A1A', stroke: 2.2, opacity: 0.85 },
  mid:  { dark: '#2F6240', light: '#4F8252', trunk: '#4A3322', ink: '#1A1A1A', stroke: 2.6, opacity: 1 },
  near: { dark: '#235437', light: '#3E7647', trunk: '#3C2A1B', ink: '#1A1A1A', stroke: 3.0, opacity: 1 },
};

// ---- PINE TREE ----
export function PineTree({ depth = 'mid' }: { depth?: Depth }) {
  const t = treeTones[depth];
  return (
    <svg viewBox="0 0 80 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', opacity: t.opacity }}>
      <g stroke={t.ink} strokeWidth={t.stroke} strokeLinejoin="round" strokeLinecap="round">
        <rect x="34" y="116" width="12" height="20" fill={t.trunk} />
        <path d="M40 14 L60 50 L20 50 Z" fill={t.dark} />
        <path d="M40 36 L66 78 L14 78 Z" fill={t.light} />
        <path d="M40 62 L72 118 L8 118 Z" fill={t.dark} />
        <path d="M40 22 L46 32" strokeWidth={t.stroke * 0.8} stroke="#FFF6E5" opacity="0.4" fill="none" />
      </g>
    </svg>
  );
}

// ---- ROUND / OAK TREE ----
export function RoundTree({ depth = 'mid' }: { depth?: Depth }) {
  const t = treeTones[depth];
  return (
    <svg viewBox="0 0 100 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', opacity: t.opacity }}>
      <g stroke={t.ink} strokeWidth={t.stroke} strokeLinejoin="round" strokeLinecap="round">
        <rect x="44" y="86" width="12" height="26" fill={t.trunk} />
        <path d="M44 96 L52 92 L52 110 L44 108 Z" stroke="none" fill="#3C2A1B" opacity="0.4" />
        <circle cx="30" cy="62" r="20" fill={t.dark} />
        <circle cx="68" cy="60" r="22" fill={t.dark} />
        <circle cx="50" cy="40" r="24" fill={t.light} />
        <circle cx="44" cy="72" r="18" fill={t.light} />
        <circle cx="74" cy="76" r="16" fill={t.dark} />
        <path d="M40 28 Q48 22 56 26" strokeWidth={t.stroke * 0.7} stroke="#FFF6E5" opacity="0.45" fill="none" />
      </g>
    </svg>
  );
}

// ---- SMALL PINE ----
export function SmallPine({ depth = 'mid' }: { depth?: Depth }) {
  const t = treeTones[depth];
  return (
    <svg viewBox="0 0 60 90" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', opacity: t.opacity }}>
      <g stroke={t.ink} strokeWidth={t.stroke} strokeLinejoin="round" strokeLinecap="round">
        <rect x="26" y="74" width="8" height="14" fill={t.trunk} />
        <path d="M30 10 L48 42 L12 42 Z" fill={t.dark} />
        <path d="M30 32 L52 76 L8 76 Z" fill={t.light} />
      </g>
    </svg>
  );
}

// ---- BUSH ----
export function Bush({ depth = 'near' }: { depth?: Depth }) {
  const t = treeTones[depth];
  return (
    <svg viewBox="0 0 100 50" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', opacity: t.opacity }}>
      <g stroke={t.ink} strokeWidth={t.stroke} strokeLinejoin="round" strokeLinecap="round">
        <path d="M6 44 Q4 28 18 26 Q22 14 36 18 Q44 8 56 14 Q66 6 78 16 Q94 16 94 30 Q98 44 86 46 L14 46 Q6 46 6 44 Z" fill={t.light} />
        <path d="M30 28 Q40 22 50 28" strokeWidth={t.stroke * 0.7} stroke="#FFF6E5" opacity="0.4" fill="none" />
        <circle cx="62" cy="30" r="2.5" fill={t.dark} stroke="none" />
        <circle cx="34" cy="34" r="2.5" fill={t.dark} stroke="none" />
      </g>
    </svg>
  );
}

// ---- TREELINE STRIP ----
// Composes a horizontal forest band as absolutely-positioned divs.
// seed controls pseudo-random placement; density < 1 tightens spacing.
interface TreeLineProps {
  depth?:   Depth;
  seed?:    number;
  width?:   number;
  height?:  number | string;
  density?: number;
  opacity?: number;
}

export function TreeLine({ depth = 'mid', seed = 0, width = 800, height = '100%', density = 0.55, opacity = 1 }: TreeLineProps) {
  const r = (n: number) => {
    const x = Math.sin((seed + 1) * (n + 1) * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const items: { type: 'round' | 'pine'; x: number; w: number; h: number; k: number }[] = [];
  let x = -30;
  let i = 0;
  const bandH = typeof height === 'number' ? height : 180;
  while (x < width) {
    const type = r(i) > 0.55 ? 'round' : 'pine';
    const w = type === 'round' ? 90 + r(i + 7) * 30 : 60 + r(i + 3) * 30;
    const h = type === 'round' ? Math.min(bandH, 110 + r(i + 9) * 20) : Math.min(bandH, 130 + r(i + 5) * 20);
    items.push({ type, x, w, h, k: i });
    x += w * density;
    i++;
  }
  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden', opacity }}>
      {items.map((it) => (
        <div key={it.k} style={{ position: 'absolute', left: it.x, bottom: 0, width: it.w, height: it.h }}>
          {it.type === 'round' ? <RoundTree depth={depth} /> : <PineTree depth={depth} />}
        </div>
      ))}
    </div>
  );
}
