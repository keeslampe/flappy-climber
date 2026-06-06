// === Climber Game — Big-Wall Route pack ===
// Natural rock cliff face for a left→right TRAVERSE, sport-climbing bolt +
// quickdraw anchors (the clear targets the climber must hit), and route lines.
// Same Rad Kid vocabulary: chunky ink outlines, flat color.

// ---------- deterministic PRNG (so walls/holds are stable across renders) ----------
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ---------- ROCK PALETTES ----------
const wallTones = {
  granite:   { base: '#8C8A86', dark: '#6E6C68', light: '#ABA9A4', deep: '#56544F', crack: '#2A2926', moss: '#5C7A4E' },
  sandstone: { base: '#CCA06A', dark: '#A87C46', light: '#E3BE8A', deep: '#86602F', crack: '#5A3D1E', moss: '#7E8A4A' },
  redrock:   { base: '#B66B4C', dark: '#8E4D34', light: '#D49072', deep: '#6E3A26', crack: '#3E2014', moss: '#7A7A3C' },
  basalt:    { base: '#6E7682', dark: '#515862', light: '#8C95A2', deep: '#3C424B', crack: '#20242A', moss: '#4E6A5C' },
};

// =====================================================================
// ROCK WALL — natural cliff face. Fills any w×h, tiles horizontally.
// Strata bands + cracks + pockets + a couple of traversable ledges.
// =====================================================================
const RockWall = ({ w = 800, h = 360, variant = 'granite', seed = 1, ledges = true, tileable = false, bottomLedge = false }) => {
  const c = wallTones[variant] || wallTones.granite;
  const r = rng(seed * 97 + 13);
  const TAU = Math.PI * 2;
  const ledgeTop = h - Math.max(26, h * 0.13);

  // periodic vertical offset: value at x=0 == value at x=w, so the panel tiles seamlessly
  const mkTerms = (a1, a2) => [
    { amp: a1 * (0.55 + r() * 0.6), freq: 1, phase: r() * TAU },
    { amp: a2 * (0.55 + r() * 0.6), freq: 2, phase: r() * TAU },
    { amp: a2 * 0.5 * (0.55 + r() * 0.6), freq: 3, phase: r() * TAU },
  ];
  const wave = (x, terms) => terms.reduce((s, t) => s + t.amp * Math.sin(TAU * t.freq * x / w + t.phase), 0);

  // ---- strata bands (periodic → seamless edges) ----
  const strata = [];
  const bandCount = Math.max(6, Math.round(h / 46));
  for (let i = 1; i <= bandCount; i++) {
    const baseY = (i / (bandCount + 1)) * h + (r() - 0.5) * 12;
    const terms = mkTerms(7, 5);
    const steps = 22;
    const pts = [];
    for (let k = 0; k <= steps; k++) {
      const x = (k / steps) * w;
      pts.push(`${k === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${(baseY + wave(x, terms)).toFixed(1)}`);
    }
    strata.push({ d: pts.join(' '), dark: i % 2 === 0 });
  }

  // ---- cracks — jagged fissures (wrapped at the edges when tileable) ----
  const cracks = [];
  const crackCount = Math.max(4, Math.round(w / 140));
  for (let i = 0; i < crackCount; i++) {
    let x = r() * w, y = -6;
    const pts = [`M ${x.toFixed(1)} ${y}`];
    const branches = [];
    while (y < ledgeTop + 6) {
      y += 16 + r() * 24;
      x += (r() - 0.5) * 44;
      pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
      if (r() > 0.8) branches.push(`M ${x.toFixed(1)} ${y.toFixed(1)} l ${((r() - 0.5) * 26).toFixed(1)} ${(12 + r() * 18).toFixed(1)}`);
    }
    cracks.push({ d: pts.join(' '), sw: 2.2 + r() * 2, branches });
  }

  // ---- short hairline fractures (extra lines / texture) ----
  const hairs = [];
  const hairCount = Math.round((w * h) / 4600);
  for (let i = 0; i < hairCount; i++) {
    const x0 = r() * w, y0 = r() * ledgeTop;
    const len = 9 + r() * 24, ang = (r() - 0.5) * 1.3;
    hairs.push(`M ${x0.toFixed(1)} ${y0.toFixed(1)} l ${(Math.cos(ang) * len).toFixed(1)} ${(Math.abs(Math.sin(ang)) * len + len * 0.3).toFixed(1)}`);
  }

  // ---- broad tonal blotches ----
  const blotches = [];
  const blotchCount = Math.max(5, Math.round((w * h) / 24000));
  for (let i = 0; i < blotchCount; i++) {
    blotches.push({ cx: r() * w, cy: r() * h, rx: 34 + r() * (w * 0.18), ry: 26 + r() * (h * 0.15), light: r() > 0.5 });
  }

  // ---- mineral veins ----
  const streaks = [];
  const streakCount = Math.max(4, Math.round(w / 130));
  for (let i = 0; i < streakCount; i++) {
    streaks.push({ x0: r() * w, y0: r() * ledgeTop * 0.9, dx: (r() - 0.5) * 150, dy: 50 + r() * 150, light: r() > 0.45 });
  }

  // ---- pockets / pock-marks ----
  const pockets = [];
  const pocketCount = Math.round((w * h) / 10000);
  for (let i = 0; i < pocketCount; i++) {
    pockets.push({ cx: r() * w, cy: r() * ledgeTop, rx: 4 + r() * 8, ry: 3 + r() * 5 });
  }

  // ---- loose pebbles / stones (lots more) ----
  const pebbles = [];
  const pebbleCount = Math.round((w * h) / 6200);
  for (let i = 0; i < pebbleCount; i++) {
    pebbles.push({ cx: r() * w, cy: r() * (ledgeTop - 8), rx: 3 + r() * 6, ry: 2.4 + r() * 4, dark: r() > 0.5 });
  }

  // ---- rubble sitting along the bottom ledge ----
  const rubble = [];
  if (bottomLedge) {
    const n = Math.max(6, Math.round(w / 24));
    for (let i = 0; i < n; i++) {
      const x = (i + 0.5) * (w / n) + (r() - 0.5) * 10;
      rubble.push({ cx: x, cy: ledgeTop + 3 + r() * 4, rx: 5 + r() * 8, ry: 3 + r() * 4 });
    }
  }
  const ledgeTerms = mkTerms(4, 3);

  // ---- mid-wall traversable shelves ----
  const shelves = [];
  if (ledges) {
    const shelfCount = Math.max(2, Math.round(w / 280));
    for (let i = 0; i < shelfCount; i++) {
      const y = ledgeTop * (0.3 + 0.22 * i + (r() - 0.5) * 0.06);
      const x = r() * w;
      const lw = 90 + r() * 150;
      shelves.push({ x, y, lw });
    }
  }

  const WRAP = tileable ? [-w, 0, w] : [0];
  const clip = `wallClip-${variant}-${seed}-${w}-${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        <clipPath id={clip}><rect x="0" y="0" width={w} height={h} /></clipPath>
        <linearGradient id={`${clip}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="55%" stopColor={c.base} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
      </defs>

      <g clipPath={`url(#${clip})`}>
        {/* base */}
        <rect x="0" y="0" width={w} height={h} fill={`url(#${clip}-g)`} />

        {/* broad tonal blotches (wrapped) */}
        {WRAP.map((ox) => (
          <g key={`wblo${ox}`} transform={`translate(${ox} 0)`}>
            {blotches.map((b, i) => (
              <ellipse key={`bl${i}`} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry}
                fill={b.light ? c.light : c.deep} opacity={b.light ? 0.16 : 0.22} />
            ))}
          </g>
        ))}

        {/* strata bands (periodic → seamless) */}
        {strata.map((b, i) => (
          <path key={`st${i}`} d={`${b.d} L ${w} ${h} L 0 ${h} Z`}
            fill={b.dark ? c.dark : c.light} opacity={b.dark ? 0.34 : 0.22} />
        ))}
        {strata.map((b, i) => (
          <path key={`sl${i}`} d={b.d} fill="none" stroke={c.crack} strokeWidth="1.7" opacity="0.4" />
        ))}

        {/* detail texture (wrapped): veins, hairlines, pockets, pebbles, cracks, shelves */}
        {WRAP.map((ox) => (
          <g key={`wtex${ox}`} transform={`translate(${ox} 0)`}>
            {streaks.map((s, i) => (
              <path key={`mv${i}`} d={`M ${s.x0.toFixed(1)} ${s.y0.toFixed(1)} l ${s.dx.toFixed(1)} ${s.dy.toFixed(1)}`}
                fill="none" strokeLinecap="round"
                stroke={s.light ? c.light : c.crack} strokeWidth={s.light ? 2.6 : 1.6}
                opacity={s.light ? 0.3 : 0.4} />
            ))}
            {hairs.map((d, i) => (
              <path key={`hr${i}`} d={d} fill="none" stroke={c.crack} strokeWidth="1.1" opacity="0.32" strokeLinecap="round" />
            ))}
            {pockets.map((p, i) => (
              <g key={`pk${i}`}>
                <ellipse cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} fill={c.deep} opacity="0.45" />
                <ellipse cx={p.cx} cy={p.cy - p.ry * 0.4} rx={p.rx * 0.7} ry={p.ry * 0.5} fill={c.light} opacity="0.28" />
              </g>
            ))}
            {pebbles.map((p, i) => (
              <g key={`pb${i}`} stroke="#1A1A1A" strokeWidth="1.4" strokeLinejoin="round">
                <ellipse cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} fill={p.dark ? c.deep : c.light} opacity="0.92" />
                <ellipse cx={p.cx - p.rx * 0.25} cy={p.cy - p.ry * 0.3} rx={p.rx * 0.4} ry={p.ry * 0.35} fill="#FFF6E5" stroke="none" opacity="0.3" />
              </g>
            ))}
            {cracks.map((ck, i) => (
              <g key={`cr${i}`}>
                <path d={ck.d} fill="none" stroke={c.crack} strokeWidth={ck.sw} strokeLinejoin="round" strokeLinecap="round" opacity="0.72" />
                {ck.branches.map((bd, j) => (
                  <path key={j} d={bd} fill="none" stroke={c.crack} strokeWidth={ck.sw * 0.7} strokeLinecap="round" opacity="0.6" />
                ))}
                <path d={ck.d} fill="none" stroke={c.light} strokeWidth="1.1" opacity="0.35" transform="translate(1.6,0)" />
              </g>
            ))}
            {shelves.map((s, i) => (
              <g key={`sh${i}`}>
                <path d={`M ${s.x} ${s.y} q ${s.lw * 0.5} ${-10} ${s.lw} 0 l 0 14 q ${-s.lw * 0.5} 10 ${-s.lw} 0 Z`} fill={c.deep} opacity="0.5" />
                <path d={`M ${s.x} ${s.y} q ${s.lw * 0.5} ${-10} ${s.lw} 0`} fill="none" stroke={c.crack} strokeWidth="3" strokeLinecap="round" />
                <path d={`M ${s.x} ${s.y - 4} q ${s.lw * 0.5} ${-10} ${s.lw} 0`} fill="none" stroke={c.light} strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
              </g>
            ))}
          </g>
        ))}

        {/* ===== BOTTOM LEDGE — runs the full width, tiles seamlessly ===== */}
        {bottomLedge && (() => {
          const steps = 24;
          const pts = [];
          for (let k = 0; k <= steps; k++) {
            const x = (k / steps) * w;
            pts.push(`${k === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${(ledgeTop + wave(x, ledgeTerms)).toFixed(1)}`);
          }
          const topD = pts.join(' ');
          return (
            <g>
              {/* soft shadow the ledge casts up the wall */}
              <path d={`${topD} L ${w} ${ledgeTop - 28} L 0 ${ledgeTop - 28} Z`} fill="#1A1A1A" opacity="0.15" />
              {/* ledge body */}
              <path d={`${topD} L ${w} ${h} L 0 ${h} Z`} fill={c.dark} />
              <path d={`${topD} L ${w} ${h} L 0 ${h} Z`} fill={c.deep} opacity="0.5" />
              {/* rubble resting on the ledge */}
              {WRAP.map((ox) => (
                <g key={`rb${ox}`} transform={`translate(${ox} 0)`} stroke="#1A1A1A" strokeWidth="1.6" strokeLinejoin="round">
                  {rubble.map((p, i) => (
                    <ellipse key={i} cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} fill={i % 2 ? c.base : c.light} />
                  ))}
                </g>
              ))}
              {/* crisp top edge + highlight lip */}
              <path d={topD} fill="none" stroke="#1A1A1A" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d={topD} fill="none" stroke={c.light} strokeWidth="2" strokeLinecap="round" opacity="0.7" transform="translate(0,-3)" />
            </g>
          );
        })()}
      </g>

      {/* borders: full frame when standalone; only top/bottom when tileable (sides stay open to wrap) */}
      {tileable ? (
        <g stroke="#1A1A1A" strokeWidth="3">
          <line x1="0" y1="1.5" x2={w} y2="1.5" />
          <line x1="0" y1={h - 1.5} x2={w} y2={h - 1.5} />
        </g>
      ) : (
        <rect x="1.5" y="1.5" width={w - 3} height={h - 3} fill="none" stroke="#1A1A1A" strokeWidth="3" />
      )}
    </svg>
  );
};

// =====================================================================
// HOLD — a natural rock knob, chalk-marked, with an optional route-color tag.
// type: 'jug' | 'crimp' | 'sloper' | 'pinch'
// =====================================================================
const Hold = ({ type = 'jug', color = '#FF3D8A', rock = '#8C8A86', size = 44, chalk = true }) => {
  const shapes = {
    jug:    'M8 34 Q4 16 22 12 Q40 8 52 18 Q60 26 54 34 Q40 40 26 38 Q14 38 8 34 Z',
    crimp:  'M8 30 Q8 20 30 18 Q52 16 54 26 Q54 32 46 33 L14 34 Q8 34 8 30 Z',
    sloper: 'M6 34 Q6 12 32 10 Q58 12 56 34 Q32 30 6 34 Z',
    pinch:  'M14 34 Q8 18 20 14 Q32 10 30 26 Q44 8 50 22 Q54 34 44 35 Q30 33 14 34 Z',
  };
  return (
    <svg viewBox="0 0 60 44" width={size * 60 / 44} height={size} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <g stroke="#1A1A1A" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
        <path d={shapes[type]} fill={rock} />
        {/* top highlight lip */}
        <path d={shapes[type].replace(/Z$/, '')} fill="none" stroke="#FFF6E5" strokeWidth="1.4" opacity="0.4" />
        {/* chalk smudges */}
        {chalk && (
          <g stroke="none" fill="#FFFFFF" opacity="0.55">
            <ellipse cx="22" cy="20" rx="6" ry="3" />
            <ellipse cx="38" cy="22" rx="5" ry="2.6" />
            <circle cx="30" cy="17" r="2.2" />
          </g>
        )}
        {/* route-color tag (climbing tape) */}
        <rect x="2" y="20" width="7" height="14" rx="1.5" fill={color} stroke="#1A1A1A" strokeWidth="1.8" />
      </g>
    </svg>
  );
};

// =====================================================================
// BOLT ANCHOR — the clear target. Bolt hanger + quickdraw (two carabiners
// joined by a dogbone sling). The rope clips through the lower biner.
// state: 'next' | 'hit' | 'missed' | 'locked'
// design: 'quickdraw' | 'screwgate' | 'chain'
// =====================================================================
const stateColors = {
  next:   { accent: '#1FD5C8', glow: '#FFD23F', badge: '#1FD5C8', icon: 'arrow' },
  hit:    { accent: '#4CC66B', glow: '#7BE38C', badge: '#4CC66B', icon: 'check' },
  missed: { accent: '#E63946', glow: '#FF8585', badge: '#E63946', icon: 'cross' },
  locked: { accent: '#9A9A95', glow: '#BFBFBA', badge: '#7A7A75', icon: 'lock' },
};

const Carabiner = ({ cx, cy, rx = 9, ry = 13, gate = '#C7CDD4', open = false, dim = false }) => (
  <g stroke="#1A1A1A" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" opacity={dim ? 0.55 : 1}>
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#1A1A1A" strokeWidth="5.4" />
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={gate} strokeWidth="3" />
    {/* gate */}
    {open
      ? <path d={`M ${cx + rx} ${cy - 3} q 7 4 2 11`} fill="none" stroke="#E63946" strokeWidth="2.6" />
      : <line x1={cx + rx} y1={cy - 4} x2={cx + rx} y2={cy + 4} stroke="#1A1A1A" strokeWidth="2.4" />}
  </g>
);

const StateBadge = ({ icon, color, x = 58, y = 14 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle cx="0" cy="0" r="11" fill={color} stroke="#1A1A1A" strokeWidth="2.6" />
    <g stroke="#FFF6E5" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {icon === 'check' && <path d="M-5 0 L-1 4 L6 -5" />}
      {icon === 'cross' && <path d="M-4 -4 L4 4 M4 -4 L-4 4" />}
      {icon === 'arrow' && <path d="M-5 0 L4 0 M0 -4 L5 0 L0 4" />}
      {icon === 'lock' && (
        <g>
          <rect x="-5" y="-1" width="10" height="8" rx="1.6" fill="#FFF6E5" stroke="#FFF6E5" />
          <path d="M-3 -1 V-4 Q0 -7 3 -4 V-1" stroke="#FFF6E5" strokeWidth="2.2" fill="none" />
          <circle cx="0" cy="3" r="1.4" fill={color} stroke="none" />
        </g>
      )}
    </g>
  </g>
);

const BoltAnchor = ({ state = 'next', design = 'quickdraw', size = 120, slingColor = '#FF3D8A', pulse = true }) => {
  const s = stateColors[state] || stateColors.next;
  const dim = state === 'locked';
  // viewbox 80 x 130
  return (
    <svg viewBox="0 0 80 130" width={size * 80 / 130} height={size} xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}>

      {/* highlight ring for the NEXT target */}
      {state === 'next' && (
        <g className={pulse ? 'anchor-pulse' : ''} style={{ transformOrigin: '40px 64px' }}>
          <circle cx="40" cy="64" r="40" fill="none" stroke={s.glow} strokeWidth="3.5"
            strokeDasharray="5 9" strokeLinecap="round" opacity="0.95" />
          <circle cx="40" cy="64" r="40" fill={s.glow} opacity="0.10" />
        </g>
      )}

      <g opacity={dim ? 0.6 : 1}>
        {/* ---- bolt hanger plate bolted to the rock ---- */}
        <g stroke="#1A1A1A" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
          <path d="M28 12 Q40 6 52 12 Q56 22 48 30 L32 30 Q24 22 28 12 Z" fill="#B9C0C8" />
          <circle cx="40" cy="16" r="5" fill="#7E858E" />
          <circle cx="40" cy="16" r="1.8" fill="#1A1A1A" stroke="none" />
          {/* hanger eye */}
          <circle cx="40" cy="27" r="5.5" fill="#3C424B" />
          <circle cx="40" cy="27" r="5.5" fill="none" stroke="#1A1A1A" strokeWidth="3" />
        </g>

        {design === 'chain' ? (
          // ---- CHAIN / TOP-STATION ANCHOR ----
          <g stroke="#1A1A1A" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
            {[36, 48, 60, 72].map((cy, i) => (
              <ellipse key={i} cx="40" cy={cy} rx="6" ry="7.5" fill="none" stroke="#1A1A1A" strokeWidth="5" />
            ))}
            {[36, 48, 60, 72].map((cy, i) => (
              <ellipse key={`h${i}`} cx="40" cy={cy} rx="6" ry="7.5" fill="none" stroke="#C7CDD4" strokeWidth="2.4" />
            ))}
            <ellipse cx="40" cy="88" rx="11" ry="15" fill="none" stroke="#1A1A1A" strokeWidth="5.4" />
            <ellipse cx="40" cy="88" rx="11" ry="15" fill="none" stroke={s.accent} strokeWidth="3" />
          </g>
        ) : design === 'screwgate' ? (
          // ---- SINGLE SCREWGATE CARABINER ----
          <g>
            <line x1="40" y1="32" x2="40" y2="48" stroke="#1A1A1A" strokeWidth="6" />
            <line x1="40" y1="32" x2="40" y2="48" stroke="#C7CDD4" strokeWidth="3" />
            <Carabiner cx={40} cy={70} rx={13} ry={19} gate={s.accent} open={state === 'missed'} dim={dim} />
            {/* screwgate sleeve */}
            <rect x="49" y="62" width="7" height="16" rx="3" fill="#FFD23F" stroke="#1A1A1A" strokeWidth="2.4" />
          </g>
        ) : (
          // ---- QUICKDRAW (default) ----
          <g>
            {/* top carabiner clipped to hanger */}
            <Carabiner cx={40} cy={40} rx={8} ry={11} gate="#C7CDD4" dim={dim} />
            {/* dogbone sling */}
            <path d="M33 50 Q31 64 33 78 L47 78 Q49 64 47 50 Q40 47 33 50 Z"
              fill={slingColor} stroke="#1A1A1A" strokeWidth="3" strokeLinejoin="round" />
            <path d="M36 54 L36 74 M44 54 L44 74" stroke="#1A1A1A" strokeWidth="1.6" opacity="0.4" />
            {/* bottom carabiner — the rope clips here */}
            <Carabiner cx={40} cy={90} rx={9} ry={13} gate={s.accent} open={state === 'missed'} dim={dim} />
          </g>
        )}

      </g>

      {/* state badge */}
      <StateBadge icon={s.icon} color={s.badge} x={60} y={14} />
    </svg>
  );
};

// =====================================================================
// ROUTE CONNECTOR — a horizontal sample segment linking anchors.
// style: 'dashed' | 'rope' | 'dotted' | 'chevron'
// =====================================================================
const RouteConnector = ({ style = 'dashed', w = 240, color = '#1FD5C8' }) => {
  const y = 24;
  const d = `M 8 ${y} Q ${w * 0.5} ${y - 16} ${w - 8} ${y}`;
  return (
    <svg viewBox={`0 0 ${w} 48`} width="100%" height="48" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', overflow: 'visible' }}>
      {/* endpoint anchor dots */}
      {[8, w - 8].map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy={y} r="7" fill="#1A1A1A" />
          <circle cx={cx} cy={y} r="4" fill={color} />
        </g>
      ))}
      {style === 'dashed' && (
        <path d={d} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="2 10" />
      )}
      {style === 'dotted' && (
        <g>
          <path d={d} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray="0.1 16" opacity="0.25" />
          <path d={d} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray="0.1 16" />
        </g>
      )}
      {style === 'rope' && (
        <g fill="none" strokeLinecap="round">
          <path d={d} stroke="#1A1A1A" strokeWidth="7" />
          <path d={d} stroke="#E63946" strokeWidth="4" />
          <path d={d} stroke="#FFF6E5" strokeWidth="1.2" opacity="0.7" strokeDasharray="6 8" />
        </g>
      )}
      {style === 'chevron' && (
        <g stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {Array.from({ length: 5 }).map((_, i) => {
            const t = (i + 1) / 6;
            const cx = 8 + t * (w - 16);
            const cy = y - 16 * Math.sin(Math.PI * t) - 0;
            return <path key={i} d={`M ${cx - 5} ${cy - 5} L ${cx + 2} ${cy} L ${cx - 5} ${cy + 5}`} />;
          })}
        </g>
      )}
    </svg>
  );
};

Object.assign(window, { RockWall, Hold, BoltAnchor, Carabiner, RouteConnector, wallTones });
