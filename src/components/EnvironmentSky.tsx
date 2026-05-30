// === Climber Game — Sky / atmosphere assets ===
// Converted from env-sky.jsx (Claude Design). Standalone SVG components;
// each renders its own <svg> wrapper so they can be used anywhere.

// ---- SKY GRADIENT ----
type SkyVariant = 'day' | 'forest' | 'meadow' | 'dusk' | 'night';

export function Sky({ variant = 'day' }: { variant?: SkyVariant }) {
  const stops: Record<SkyVariant, [string, string, string]> = {
    day:    ['#A8DFFF', '#CFEFFF', '#E9F7FF'],
    forest: ['#8FB6C6', '#9FC8B0', '#B6D29A'],
    meadow: ['#B4D77A', '#C9E095', '#D9E8A6'],
    dusk:   ['#FFB47A', '#FFD089', '#FFE9BF'],
    night:  ['#1B2347', '#2C2F66', '#4A3E7E'],
  };
  const [s0, s1, s2] = stops[variant];
  return (
    <svg viewBox="0 0 200 300" width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`skyG-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={s0} />
          <stop offset="60%"  stopColor={s1} />
          <stop offset="100%" stopColor={s2} />
        </linearGradient>
      </defs>
      <rect width="200" height="300" fill={`url(#skyG-${variant})`} />
    </svg>
  );
}

// ---- SUN ----
export function Sun({ rays = true }: { rays?: boolean }) {
  return (
    <svg viewBox="0 0 128 128" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <g stroke="#1A1A1A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        {rays && (
          <g fill="#FFD23F">
            <path d="M64 6 L70 22 L58 22 Z" />
            <path d="M64 122 L58 106 L70 106 Z" />
            <path d="M6 64 L22 58 L22 70 Z" />
            <path d="M122 64 L106 70 L106 58 Z" />
            <path d="M22 22 L34 30 L30 34 Z" />
            <path d="M106 22 L94 30 L98 34 Z" />
            <path d="M22 106 L30 94 L34 98 Z" />
            <path d="M106 106 L98 94 L94 98 Z" />
          </g>
        )}
        <circle cx="64" cy="64" r="32" fill="#FFD23F" />
        <circle cx="56" cy="58" r="3" fill="#1A1A1A" stroke="none" />
        <circle cx="72" cy="58" r="3" fill="#1A1A1A" stroke="none" />
        <path d="M54 74 Q64 84 74 74" strokeWidth="3" fill="none" />
        <circle cx="48" cy="70" r="3.4" fill="#FF3D8A" stroke="none" />
        <circle cx="80" cy="70" r="3.4" fill="#FF3D8A" stroke="none" />
      </g>
    </svg>
  );
}

// ---- CLOUD (3 chunky variants) ----
type CloudVariant = 'a' | 'b' | 'c';

export function Cloud({ variant = 'a' }: { variant?: CloudVariant }) {
  const paths: Record<CloudVariant, string> = {
    a: 'M18 60 Q8 60 8 50 Q8 40 18 40 Q20 28 36 30 Q44 18 60 24 Q74 18 86 30 Q104 28 108 44 Q120 46 118 58 Q118 66 108 66 L22 66 Q18 66 18 60 Z',
    b: 'M12 56 Q4 56 4 48 Q4 38 16 38 Q22 28 36 32 Q48 22 60 30 Q70 26 78 36 Q92 34 96 48 Q104 50 102 58 Z',
    c: 'M14 50 Q4 50 4 42 Q6 32 18 32 Q26 22 40 28 Q56 22 62 32 Q72 28 78 38 Q92 40 90 50 Z',
  };
  const widths:  Record<CloudVariant, number> = { a: 128, b: 104, c: 96 };
  const heights: Record<CloudVariant, number> = { a: 72,  b: 64,  c: 56 };
  return (
    <svg viewBox={`0 0 ${widths[variant]} ${heights[variant]}`} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <g stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d={paths[variant]} fill="#FFF6E5" />
      </g>
    </svg>
  );
}

// ---- MOON ----
export function Moon() {
  return (
    <svg viewBox="0 0 128 128" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <g stroke="#1A1A1A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="60" cy="64" r="36" fill="#FFF6E5" />
        <circle cx="76" cy="56" r="28" fill="#1B2347" stroke="none" />
        <circle cx="74" cy="60" r="28" fill="#FFF6E5" stroke="none" />
        <circle cx="50" cy="58" r="3" fill="#1A1A1A" stroke="none" />
        <circle cx="58" cy="72" r="2.5" fill="#1A1A1A" stroke="none" />
      </g>
    </svg>
  );
}

// ---- MOUNTAIN RANGE ----
// tone='far'  pale, jagged, snow-capped
// tone='mid'  closer, rounder, no snow
type MountainTone = 'far' | 'mid';

export function Mountains({ tone = 'far' }: { tone?: MountainTone }) {
  if (tone === 'far') {
    return (
      <svg viewBox="0 0 400 140" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
        <g stroke="#1A1A1A" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
          <path d="M0 140 L0 60 L30 50 L60 78 L95 18 L130 70 L170 36 L210 82 L255 24 L300 70 L340 44 L370 70 L400 60 L400 140 Z" fill="#9DB4C9" />
          <path d="M88 28 L95 18 L102 28 L99 36 L91 36 Z" fill="#F0F5FB" />
          <path d="M249 34 L255 24 L262 34 L259 42 L252 42 Z" fill="#F0F5FB" />
          <path d="M166 44 L170 36 L174 44 L172 50 L168 50 Z" fill="#F0F5FB" />
          <path d="M333 52 L340 44 L347 52 L344 58 L336 58 Z" fill="#F0F5FB" />
          <path d="M30 50 L42 64" stroke="#C6D5E2" strokeWidth="2.5" fill="none" opacity="0.7" />
          <path d="M130 70 L142 84" stroke="#C6D5E2" strokeWidth="2.5" fill="none" opacity="0.7" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 140" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <g stroke="#1A1A1A" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M0 140 L0 90
                 L 30 78 L 55 96 L 90 60 L 130 100
                 L 165 72 L 210 104 L 245 64 L 290 102
                 L 330 80 L 365 100 L 400 90 L 400 140 Z"
              fill="#5F7E94" />
        <path d="M55 96 L 72 88 L 90 60" stroke="#3E5A6E" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M210 104 L 228 92 L 245 64" stroke="#3E5A6E" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M90 60 L 108 78" stroke="#8AA5BA" strokeWidth="2.2" fill="none" opacity="0.7" />
        <path d="M245 64 L 263 82" stroke="#8AA5BA" strokeWidth="2.2" fill="none" opacity="0.7" />
        <path d="M330 80 L 345 92" stroke="#8AA5BA" strokeWidth="2" fill="none" opacity="0.65" />
      </g>
    </svg>
  );
}

// ---- MIDGROUND HILLS ----
export function MidgroundHills({ color = '#5C8A4E', topColor }: { color?: string; topColor?: string }) {
  const top = topColor ?? color;
  const id = `hillG-${color.replace('#', '')}`;
  return (
    <svg viewBox="0 0 400 200" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={top} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <path d="
        M 0 200 L 0 50
        Q 30 30 60 40 Q 100 22 140 36 Q 180 18 220 32
        Q 260 14 300 28 Q 340 16 380 30 Q 400 22 400 40
        L 400 200 Z
      " fill={`url(#${id})`} stroke="#1A1A1A" strokeWidth="2" strokeOpacity="0.25" />
    </svg>
  );
}

// ---- ATMOSPHERIC HAZE ----
export function AtmoHaze({ color = '#9FC8B0', opacity = 0.85 }: { color?: string; opacity?: number }) {
  const id = `hazeG-${color.replace('#', '')}`;
  return (
    <svg viewBox="0 0 200 300" width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0" />
          <stop offset="55%"  stopColor={color} stopOpacity={opacity * 0.5} />
          <stop offset="100%" stopColor={color} stopOpacity={opacity} />
        </linearGradient>
      </defs>
      <rect width="200" height="300" fill={`url(#${id})`} />
    </svg>
  );
}
