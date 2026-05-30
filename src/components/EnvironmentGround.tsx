// === Climber Game — Ground, rocky obstacles, props ===
// Converted from env-ground.jsx (Claude Design). Standalone SVG components.

// ---- GROUND BAND ----
// Tileable horizontally. height = total band height in px.
export function GroundBand({ height = 120 }: { height?: number }) {
  const W = 800;
  const grassH = Math.max(14, height * 0.18);
  const bumps: string[] = [];
  for (let i = 0; i <= 16; i++) {
    const x = (i / 16) * W;
    const dy = (i % 2 === 0 ? 0 : -6) + ((i * 53) % 5);
    bumps.push(`${i === 0 ? 'M' : 'L'} ${x} ${grassH + dy}`);
  }
  const grassPath = `M 0 ${grassH} ${bumps.slice(1).join(' ')} L ${W} ${grassH} L ${W} 0 L 0 0 Z`;
  return (
    <svg viewBox={`0 0 ${W} ${height}`} width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <rect x="0" y="0" width={W} height={height} fill="#7A4F2E" />
      <rect x="0" y={height * 0.55} width={W} height={height * 0.45} fill="#5C3A20" />
      <g fill="#3C2412">
        {Array.from({ length: 28 }).map((_, i) => {
          const x = (i * 71) % W;
          const y = grassH + 8 + ((i * 37) % (height - grassH - 12));
          const r = 1.5 + ((i * 13) % 3);
          return <circle key={`s${i}`} cx={x} cy={y} r={r} />;
        })}
      </g>
      <g stroke="#1A1A1A" strokeWidth="1.6" strokeLinejoin="round">
        {Array.from({ length: 6 }).map((_, i) => {
          const x = 40 + ((i * 137) % (W - 80));
          const y = height - 14 - ((i * 23) % 8);
          return <ellipse key={`p${i}`} cx={x} cy={y} rx="10" ry="4.5" fill="#A98266" />;
        })}
      </g>
      <path d={grassPath} fill="#4F8252" stroke="#1A1A1A" strokeWidth="3" strokeLinejoin="round" />
      <path d={`M 0 ${grassH * 0.55} L ${W} ${grassH * 0.55}`} stroke="#7BB07F" strokeWidth="3" opacity="0.6" />
      <g stroke="#2A4A2E" strokeWidth="2" strokeLinecap="round" fill="none">
        {Array.from({ length: 22 }).map((_, i) => {
          const x = (i * 47 + 10) % W;
          const tilt = (i % 2 === 0 ? -2 : 2);
          return <path key={`b${i}`} d={`M ${x} ${grassH - 2} L ${x + tilt} ${grassH - 9}`} />;
        })}
      </g>
    </svg>
  );
}

// ---- ROCKY OBSTACLE ----
type RockVariant = 'a' | 'b' | 'c';

export function RockObstacle({ w = 160, h = 200, variant = 'a' }: { w?: number; h?: number; variant?: RockVariant }) {
  const inset = 6;
  const xL = inset, xR = w - inset;
  const yT = inset, yB = h - inset;
  const t1 = w * 0.18, t2 = w * 0.42, t3 = w * 0.68, t4 = w * 0.86;
  const variants: Record<RockVariant, string> = {
    a: `M ${xL} ${yB} L ${xL + 4} ${yT + h * 0.35} L ${t1} ${yT + h * 0.12} L ${t2} ${yT} L ${t3} ${yT + h * 0.08} L ${t4} ${yT + h * 0.18} L ${xR} ${yT + h * 0.42} L ${xR - 4} ${yB} Z`,
    b: `M ${xL} ${yB} L ${xL + w * 0.06} ${yT + h * 0.5} L ${xL + w * 0.22} ${yT + h * 0.22} L ${xL + w * 0.48} ${yT + h * 0.06} L ${xR - w * 0.18} ${yT} L ${xR - w * 0.04} ${yT + h * 0.25} L ${xR} ${yB} Z`,
    c: `M ${xL} ${yB} L ${xL + 2} ${yT + h * 0.55} L ${xL + w * 0.18} ${yT + h * 0.3} L ${xL + w * 0.32} ${yT + h * 0.05} L ${xL + w * 0.58} ${yT + h * 0.18} L ${xL + w * 0.78} ${yT} L ${xR - 4} ${yT + h * 0.35} L ${xR} ${yB} Z`,
  };
  const rock = variants[variant];
  const bands = [0.35, 0.55, 0.72, 0.86].map(p => yT + h * p);
  const crackX = w * 0.45;
  const clipId = `rockClip-${w}-${h}-${variant}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        <clipPath id={clipId}><path d={rock} /></clipPath>
      </defs>
      <path d={rock} fill="#9A8A78" stroke="#1A1A1A" strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" />
      <g clipPath={`url(#${clipId})`}>
        {bands.map((y, i) => (
          <rect key={i} x="0" y={y} width={w} height={Math.max(6, h * 0.04)} fill={i % 2 === 0 ? '#7E6E5E' : '#867464'} opacity="0.85" />
        ))}
        {bands.map((y, i) => (
          <line key={`l${i}`} x1="0" y1={y} x2={w} y2={y} stroke="#1A1A1A" strokeWidth="2" opacity="0.6" />
        ))}
        <rect x="0" y={yT + h * 0.86} width={w} height={h * 0.2} fill="#6F5F4E" opacity="0.6" />
        <path d={`M ${w * 0.3} ${yT + h * 0.04} L ${w * 0.55} ${yT - 2} L ${w * 0.5} ${yT + h * 0.1} Z`} fill="#C2B5A2" opacity="0.7" />
        <path d={`M ${crackX} ${yT + h * 0.12} L ${crackX + 4} ${yT + h * 0.35} L ${crackX - 4} ${yT + h * 0.58} L ${crackX + 6} ${yT + h * 0.82}`} stroke="#1A1A1A" strokeWidth="2.2" fill="none" strokeLinejoin="round" strokeLinecap="round" opacity="0.7" />
        <path d={`M ${w * 0.78} ${yT + h * 0.4} L ${w * 0.72} ${yT + h * 0.6} L ${w * 0.82} ${yT + h * 0.78}`} stroke="#1A1A1A" strokeWidth="2" fill="none" opacity="0.65" />
        <g fill="#4F8252" stroke="#1A1A1A" strokeWidth="2" strokeLinejoin="round">
          <path d={`M ${w * 0.2} ${yT + h * 0.1} q 8 -10 16 0 q 6 -8 10 2 z`} />
          <path d={`M ${w * 0.6} ${yT + h * 0.05} q 6 -8 12 0 q 5 -7 8 2 z`} />
        </g>
      </g>
    </svg>
  );
}

// ---- PEBBLE ----
export function Pebble({ size = 28, color = '#A98266' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 60 28" width={size * 60 / 28} height={size} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <g stroke="#1A1A1A" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M6 22 Q4 10 18 8 Q34 2 48 10 Q58 14 54 22 Z" fill={color} />
        <path d="M14 14 Q22 10 32 12" stroke="#FFF6E5" strokeWidth="1.6" opacity="0.5" fill="none" />
      </g>
    </svg>
  );
}

// ---- GRASS TUFT ----
export function GrassTuft({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 36 30" width={size * 36 / 30} height={size} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <g stroke="#1A1A1A" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" fill="none">
        <path d="M6 28 L4 12" stroke="#2A4A2E" />
        <path d="M12 28 L10 6" stroke="#3E7647" />
        <path d="M18 28 L18 2"  stroke="#4F8252" />
        <path d="M24 28 L26 6" stroke="#3E7647" />
        <path d="M30 28 L32 14" stroke="#2A4A2E" />
      </g>
    </svg>
  );
}

// ---- FLOWER ----
export function Flower({ color = '#FF3D8A' }: { color?: string }) {
  return (
    <svg viewBox="0 0 40 50" width="40" height="50" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <g stroke="#1A1A1A" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M20 48 L20 24" stroke="#3E7647" />
        <path d="M20 36 L12 30" stroke="#3E7647" />
        <circle cx="20" cy="14" r="6" fill={color} />
        <circle cx="13" cy="18" r="5" fill={color} />
        <circle cx="27" cy="18" r="5" fill={color} />
        <circle cx="16" cy="8" r="5" fill={color} />
        <circle cx="24" cy="8" r="5" fill={color} />
        <circle cx="20" cy="14" r="2.5" fill="#FFD23F" stroke="none" />
      </g>
    </svg>
  );
}

// ---- MUSHROOM ----
export function Mushroom({ color = '#FF3D8A' }: { color?: string }) {
  return (
    <svg viewBox="0 0 40 44" width="40" height="44" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <g stroke="#1A1A1A" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M6 24 Q4 6 20 6 Q36 6 34 24 Z" fill={color} />
        <circle cx="14" cy="14" r="2.5" fill="#FFF6E5" stroke="none" />
        <circle cx="26" cy="12" r="2"   fill="#FFF6E5" stroke="none" />
        <circle cx="22" cy="20" r="2.2" fill="#FFF6E5" stroke="none" />
        <path d="M12 24 L12 38 Q12 42 16 42 L24 42 Q28 42 28 38 L28 24 Z" fill="#FFF6E5" />
      </g>
    </svg>
  );
}

// ---- LOG ----
export function Log({ w = 120, h = 36 }: { w?: number; h?: number }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <g stroke="#1A1A1A" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <rect x="3" y="3" width={w - 6} height={h - 6} rx={h / 2 - 4} fill="#7A4F2E" />
        <ellipse cx={h / 2 + 2} cy={h / 2} rx={h / 4} ry={h / 3} fill="#5C3A20" />
        <ellipse cx={h / 2 + 2} cy={h / 2} rx={h / 8} ry={h / 6} fill="#3C2412" stroke="none" />
        <path d={`M ${h} ${h * 0.35} L ${w - h * 0.5} ${h * 0.35}`} stroke="#A0734F" strokeWidth="2" opacity="0.6" />
        <path d={`M ${h} ${h * 0.65} L ${w - h * 0.5} ${h * 0.65}`} stroke="#A0734F" strokeWidth="2" opacity="0.6" />
      </g>
    </svg>
  );
}

// ---- ROPE ----
// Standalone design version. The game uses src/components/Rope.tsx which
// integrates with world state. This version is for layout previews.
export function RopeDesign({ length = 220, slack = 24, color = '#E63946', height = 80 }: { length?: number; slack?: number; color?: string; height?: number }) {
  const W = length;
  const H = height;
  const startX = W - 4, startY = H * 0.5;
  const endX = 4,       endY   = H * 0.45;
  const midX = W * 0.5, midY   = startY + slack;
  const p = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', overflow: 'visible' }}>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={p} stroke="#1A1A1A" strokeWidth="8" />
        <path d={p} stroke={color}   strokeWidth="5" />
        <path d={p} stroke="#FFF6E5" strokeWidth="1.4" opacity="0.7" strokeDasharray="6 8" />
        <circle cx={startX - 2} cy={startY} r="6" fill={color} stroke="#1A1A1A" strokeWidth="2.4" />
      </g>
    </svg>
  );
}
