// === Mountain Climb Scene ===
// You're high on a mountain face. Distant peaks sit behind in the sky. Three
// bolt anchors lead up the face; the climber clings to the LEFT, and the belay
// rope runs in from the LEFT edge of the screen to the climber's waist.
//
// Renders inside a portrait phone-sized artboard. Takes a `cfg` describing the
// palette + silhouettes so each variant reads as a genuinely different mountain.

// -------- tiny deterministic PRNG (local, so we don't depend on env-wall's) --------
function mcRng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

// -------- geometry helpers (all coords are PERCENT of the scene box) --------
const poly = (pts) => 'polygon(' + pts.map(([x, y]) => `${x}% ${y}%`).join(', ') + ')';
const line = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ');

// Build a jagged distant range across the full width. Returns the closed fill
// path AND the top silhouette points (so we can paint a snow line on it).
function buildRange(seed, baseY, amp, n) {
  const r = mcRng(seed);
  const top = [[0, baseY - amp * (0.3 + 0.4 * r())]];
  for (let i = 1; i <= n; i++) {
    const x = (i / n) * 100;
    const peakX = x - (100 / n) * (0.45 + 0.1 * r());
    top.push([+peakX.toFixed(1), +(baseY - amp * (0.55 + 0.45 * r())).toFixed(1)]); // a peak
    top.push([+x.toFixed(1), +(baseY - amp * (0.05 + 0.22 * r())).toFixed(1)]);       // a saddle
  }
  const fill = `M 0 100 L ${top.map(([x, y]) => `${x} ${y}`).join(' L ')} L 100 100 Z`;
  return { fill, top };
}

// ----------------------------------------------------------------------------
// One mountain, drawn at any size. Layers, back → front:
//   sky · far peaks · mid peaks · horizon haze · foreground face (+snow) ·
//   ridge ink line · belay rope + route + lead · anchors · climber · HUD
// ----------------------------------------------------------------------------
const MountainClimbScene = ({ cfg }) => {
  const far = buildRange(cfg.seed * 7 + 1, cfg.farBase ?? 56, cfg.farAmp ?? 20, cfg.farN ?? 7);
  const mid = buildRange(cfg.seed * 13 + 5, cfg.midBase ?? 50, cfg.midAmp ?? 15, cfg.midN ?? 6);

  // foreground polygon = ridge silhouette, closed down the right edge + floor
  const ridge = cfg.ridge;
  const fgPoly = [...ridge, [100, 100], [0, 100]];

  // fixed staging — climber pinned LEFT, anchors lead up-right, rope from LEFT
  const ANCHORS = [
    { x: 31, y: 53 }, // clipped
    { x: 44, y: 44 }, // next  (pulses)
    { x: 58, y: 34 }, // locked
  ];
  const STATES = ['hit', 'next', 'locked'];
  const climber = { x: 22, y: 63 };
  const waist = { x: 25.5, y: 65.5 };
  const ropeIn = { x: 0, y: 73 }; // enters from the left edge

  const SW = 100, SH = 178; // overlay viewBox (portrait); y scaled below
  const Y = (yPct) => (yPct / 100) * SH;
  const P = (p) => ({ x: p.x, y: Y(p.y) });

  // belay rope: left edge → waist, with a little catenary sag
  const a = P(ropeIn), w = P(waist);
  const sag = 10;
  const belayD = `M ${a.x} ${a.y} Q ${(a.x + w.x) / 2} ${Math.max(a.y, w.y) + sag} ${w.x} ${w.y}`;
  // lead rope: waist → first (clipped) anchor
  const a0 = P(ANCHORS[0]);
  const leadD = `M ${w.x} ${w.y} Q ${(w.x + a0.x) / 2 - 4} ${(w.y + a0.y) / 2 + 6} ${a0.x} ${a0.y}`;
  // route line through the anchors (the planned path ahead)
  const routeD = line(ANCHORS.map((p) => [p.x, Y(p.y)]));

  const ink = '#1A1A1A';

  return (
    <div className="mc-scene" style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: cfg.sky[2] }}>
      {/* 1 — sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, ${cfg.sky[0]} 0%, ${cfg.sky[1]} 52%, ${cfg.sky[2]} 100%)`,
      }} />

      {/* sun / glow — halo width = cfg.sun.size%; an opaque disc rides at ~1/3 of it */}
      {cfg.sun && (() => {
        const halo = cfg.sun.size ?? (cfg.sun.big ? 64 : 34);
        const disc = cfg.sun.disc ?? (cfg.sun.big ? 20 : 0);
        return (
          <React.Fragment>
            <div style={{
              position: 'absolute', left: `${cfg.sun.x}%`, top: `${cfg.sun.y}%`,
              width: `${halo}%`, aspectRatio: '1', transform: 'translate(-50%,-50%)',
              background: `radial-gradient(circle, ${cfg.sun.color} 0%, ${cfg.sun.color}00 62%)`,
              borderRadius: '50%', opacity: cfg.sun.opacity ?? 0.9, pointerEvents: 'none',
            }} />
            {disc > 0 && (
              <div style={{
                position: 'absolute', left: `${cfg.sun.x}%`, top: `${cfg.sun.y}%`,
                width: `${disc}%`, aspectRatio: '1', transform: 'translate(-50%,-50%)',
                background: cfg.sun.color, borderRadius: '50%', opacity: 0.95, pointerEvents: 'none',
              }} />
            )}
          </React.Fragment>
        );
      })()}

      {/* 2 — far peaks (palest) */}
      <svg viewBox={`0 0 100 ${SH}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <g transform={`scale(1 ${SH / 100})`}>
          <path d={far.fill} fill={cfg.farFill} />
          {cfg.snow && <polyline points={far.top.map(([x, y]) => `${x},${y}`).join(' ')}
            fill="none" stroke="#F2F6FB" strokeWidth="2.4" strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity="0.9" />}
        </g>
      </svg>

      {/* 3 — mid peaks (deeper) */}
      <svg viewBox={`0 0 100 ${SH}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <g transform={`scale(1 ${SH / 100})`}>
          <path d={mid.fill} fill={cfg.midFill} />
          {cfg.snow && <polyline points={mid.top.map(([x, y]) => `${x},${y}`).join(' ')}
            fill="none" stroke="#E7EEF6" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity="0.8" />}
        </g>
      </svg>

      {/* horizon haze — settles the distant ranges into the air */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: '30%', height: '34%',
        background: `linear-gradient(180deg, ${cfg.haze}00 0%, ${cfg.haze}cc 55%, ${cfg.haze}00 100%)`,
        pointerEvents: 'none',
      }} />

      {/* clouds — chunky Rad-Kid puffs drifting in the sky, behind the face */}
      {(cfg.clouds || []).map((c, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${c.x}%`, top: `${c.y}%`, width: `${c.w}%`,
          transform: 'translate(-50%,-50%)', opacity: c.o ?? 0.95, pointerEvents: 'none',
        }}>
          <Cloud variant={c.v || 'a'} />
        </div>
      ))}

      {/* 4 — foreground face: rock texture clipped to the mountain silhouette */}
      <div style={{ position: 'absolute', inset: 0, clipPath: poly(fgPoly), WebkitClipPath: poly(fgPoly) }}>
        <RockWall w={420} h={760} variant={cfg.rock} seed={cfg.rockSeed} ledges={false} />
        {/* aerial-perspective tint so the face reads lit by the same sky */}
        <div style={{ position: 'absolute', inset: 0, background: cfg.faceTint, mixBlendMode: 'soft-light', opacity: 0.6 }} />
        {/* snow dusting on the upper face */}
        {cfg.faceSnow && <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.5) 14%, rgba(255,255,255,0) 34%)',
        }} />}
      </div>

      {/* ground level — valley floor far below the climber (optional) */}
      {cfg.ground && (() => {
        const g = cfg.ground;
        const gy = g.y; // top of ground band, in %
        const wob = [
          [0, gy + 1.5], [14, gy - 1.2], [28, gy + 1], [42, gy - 1.6],
          [56, gy + 0.6], [70, gy - 1.4], [84, gy + 1.2], [100, gy - 0.6],
        ];
        const gPoly = poly([...wob, [100, 100], [0, 100]]);
        return (
          <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}>
            {/* haze the foot of the wall into the valley */}
            <div style={{
              position: 'absolute', left: 0, right: 0, top: `${gy - 12}%`, height: '14%',
              background: `linear-gradient(180deg, ${g.haze || g.color}00 0%, ${g.haze || g.color}aa 100%)`,
            }} />
            <div style={{ position: 'absolute', inset: 0, clipPath: gPoly, WebkitClipPath: gPoly,
              background: `linear-gradient(180deg, ${g.top || g.color} 0%, ${g.color} 60%)` }} />
            {/* grass/snow rim line on the ground edge */}
            <svg viewBox={`0 0 100 ${SH}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
              <g transform={`scale(1 ${SH / 100})`}>
                <path d={line(wob)} fill="none" stroke={g.rim || '#1A1A1A'} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </g>
            </svg>
          </div>
        );
      })()}

      {/* ridge ink line + snow cap on the foreground silhouette */}
      <svg viewBox={`0 0 100 ${SH}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
        <g transform={`scale(1 ${SH / 100})`} fill="none" strokeLinejoin="round" strokeLinecap="round">
          {cfg.faceSnow && <path d={line(ridge)} stroke="#FFFFFF" strokeWidth="6" vectorEffect="non-scaling-stroke" opacity="0.95" />}
          <path d={line(ridge)} stroke={ink} strokeWidth="3.2" vectorEffect="non-scaling-stroke" />
          {/* a sunlit rim just under the ridge */}
          <path d={line(ridge)} stroke={cfg.rim} strokeWidth="1.6" vectorEffect="non-scaling-stroke" transform="translate(0 2)" opacity="0.6" />
        </g>
      </svg>

      {/* 5 — belay rope (from LEFT) · route · lead */}
      <svg viewBox={`0 0 100 ${SH}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
        {/* planned route ahead (dotted) */}
        <path d={routeD} fill="none" stroke={cfg.route} strokeWidth="3" strokeDasharray="0.5 6"
          strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.75" />
        {/* lead rope through the clipped draw */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={leadD} stroke={ink} strokeWidth="4.4" vectorEffect="non-scaling-stroke" />
          <path d={leadD} stroke="#E63946" strokeWidth="2.6" vectorEffect="non-scaling-stroke" />
        </g>
        {/* belay rope in from the left edge → waist (the hero rope) */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={belayD} stroke={ink} strokeWidth="7.5" vectorEffect="non-scaling-stroke" />
          <path d={belayD} stroke="#E63946" strokeWidth="4.6" vectorEffect="non-scaling-stroke" />
          <path d={belayD} stroke="#FFF6E5" strokeWidth="1.2" strokeDasharray="5 7" vectorEffect="non-scaling-stroke" opacity="0.7" />
        </g>
      </svg>

      {/* 6 — anchors */}
      {ANCHORS.map((p, i) => (
        <div key={i} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: '17%', transform: 'translate(-50%,-50%)', zIndex: 5 }}>
          <BoltAnchor state={STATES[i]} design={i === 2 ? 'chain' : 'quickdraw'} size={92} slingColor={cfg.sling} pulse />
        </div>
      ))}

      {/* 7 — climber, pinned LEFT */}
      <div style={{ position: 'absolute', left: `${climber.x}%`, top: `${climber.y}%`, width: '22%', transform: 'translate(-50%,-50%)', zIndex: 6 }}>
        <RadKidIdle />
      </div>

      {/* 8 — HUD */}
      <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 8 }}>
        <span className="mc-chip"><span style={{ color: cfg.route }}>CLIPPED</span> 1/3</span>
      </div>
      <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 8 }}>
        <span className="mc-chip"><span className="mc-dot" /> {cfg.alt}</span>
      </div>
    </div>
  );
};

window.MountainClimbScene = MountainClimbScene;
