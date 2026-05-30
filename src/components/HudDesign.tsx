// === Climber Game — HUD chrome ===
// Converted from hud.jsx (Claude Design). Standalone DOM + SVG components.
// These use inline styles so they can render outside the game SVG context.

import type { CSSProperties, ReactNode } from 'react';

const MONO: CSSProperties = {
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
};

// ---- STAT PILL ----
interface HudStatProps { label?: string; value?: string | number; accent?: string; wide?: boolean }
export function HudStat({ label = 'TIME', value = '0', accent = '#FFD23F', wide = false }: HudStatProps) {
  return (
    <div style={{
      ...MONO,
      background: '#1A1A1A',
      border: '3px solid #1A1A1A',
      borderRadius: 8,
      padding: '8px 14px',
      minWidth: wide ? 140 : 96,
      boxShadow: '4px 4px 0 rgba(0,0,0,0.4)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 10, letterSpacing: '0.18em', color: accent, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 22, color: '#FFF6E5', fontWeight: 800, marginTop: 2 }}>{value}</div>
    </div>
  );
}

// ---- HUD BAR (row wrapper) ----
export function HudBar({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'flex-start' }}>
      {children}
    </div>
  );
}

// ---- TOP ROW: TIME / SCORE / KG ----
interface HudTopProps { time?: string; score?: number; kg?: string }
export function HudTop({ time = '0:00', score = 0, kg = '0kg' }: HudTopProps) {
  return (
    <HudBar>
      <HudStat label="TIME"  value={time}  accent="#FFD23F" />
      <HudStat label="SCORE" value={score} accent="#1FD5C8" />
      <HudStat label="KG"    value={kg}    accent="#FF3D8A" />
    </HudBar>
  );
}

// ---- SENSOR READOUT ----
interface HudReadoutProps { raw?: string; smooth?: string; connected?: boolean }
export function HudReadout({ raw = '0.00 kg', smooth = '0.00 kg', connected = true }: HudReadoutProps) {
  return (
    <div style={{
      ...MONO,
      background: '#1A1A1A',
      border: '3px solid #1A1A1A',
      borderRadius: 8,
      padding: '10px 14px',
      color: '#FFD23F',
      fontSize: 12,
      lineHeight: 1.6,
      boxShadow: '4px 4px 0 rgba(0,0,0,0.4)',
      minWidth: 240,
    }}>
      <div>TINDEQ RAW &nbsp; : <span style={{ color: '#FFF6E5' }}>{raw}</span></div>
      <div>TINDEQ SMOOTH: <span style={{ color: '#FFF6E5' }}>{smooth}</span></div>
      <div>CONNECTED &nbsp; &nbsp; : <span style={{ color: connected ? '#7BE38C' : '#FF3D8A' }}>{connected ? '✓ yes' : '✗ no'}</span></div>
    </div>
  );
}

// ---- DIRECTION ARROW ----
interface DirectionArrowProps { direction?: 'left' | 'right'; length?: number }
export function DirectionArrow({ direction = 'right', length = 140 }: DirectionArrowProps) {
  const W = length, H = 22;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={length} height={H} xmlns="http://www.w3.org/2000/svg"
         style={{ display: 'block', transform: direction === 'left' ? 'scaleX(-1)' : 'none' }}>
      <g stroke="#1A1A1A" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        <line x1="4" y1={H / 2} x2={W - 22} y2={H / 2} stroke="#FF3D5A" strokeWidth="6" strokeDasharray="10 6" />
        <path d={`M ${W - 28} ${H / 2 - 9} L ${W - 6} ${H / 2} L ${W - 28} ${H / 2 + 9} Z`} fill="#FFD23F" />
      </g>
    </svg>
  );
}

// ---- VERTICAL RULER ----
// Design version uses kg units. The game's HeightMeter uses metres and game
// coordinates — keep both. This one is for layout previews / menus.
interface HeightRulerProps {
  maxValue?: number;
  step?:     number;
  height?:   number;
  style?:    'panel' | 'minimal';
  unit?:     string;
}
export function HeightRuler({ maxValue = 70, step = 10, height = 600, style: cardStyle = 'panel', unit = 'kg' }: HeightRulerProps) {
  const ticks: number[] = [];
  for (let v = 0; v <= maxValue; v += step / 2) ticks.push(v);
  const isPanel = cardStyle === 'panel';
  const W = isPanel ? 58 : 44;
  const padTop = 14, padBottom = 14;
  const usable = height - padTop - padBottom;
  const yFor = (v: number) => height - padBottom - (v / maxValue) * usable;

  return (
    <div style={{
      ...MONO,
      position: 'relative',
      width: W,
      height: '100%',
      maxHeight: height,
      background: isPanel ? '#FFF6E5' : 'transparent',
      border: isPanel ? '3px solid #1A1A1A' : 'none',
      borderRadius: isPanel ? 6 : 0,
      boxShadow: isPanel ? '3px 3px 0 #1A1A1A' : 'none',
      overflow: 'visible',
    }}>
      {isPanel && (
        <div style={{
          position: 'absolute', top: -1, left: -1, right: -1,
          background: '#1A1A1A', color: '#FFD23F',
          fontSize: 10, fontWeight: 800, letterSpacing: '0.18em',
          textAlign: 'center', padding: '4px 0 3px',
          borderRadius: '4px 4px 0 0',
        }}>{unit.toUpperCase()}</div>
      )}
      <svg viewBox={`0 0 ${W} ${height}`} width={W} height="100%"
           preserveAspectRatio="xMidYMin meet"
           xmlns="http://www.w3.org/2000/svg"
           style={{ display: 'block', overflow: 'visible' }}>
        <line x1={W - 12} y1={padTop + (isPanel ? 14 : 0)} x2={W - 12} y2={height - padBottom}
              stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
        {ticks.map((v) => {
          const y = yFor(v);
          const major = v % step === 0;
          const tickLen = major ? 16 : 8;
          return (
            <g key={v}>
              <line x1={W - 12 - tickLen} y1={y} x2={W - 12} y2={y}
                    stroke="#1A1A1A" strokeWidth={major ? 3 : 2} strokeLinecap="round" />
              {major && v > 0 && (
                <text x={W - 12 - tickLen - 4} y={y + 4} fontSize="11" fontWeight="800"
                      fill="#1A1A1A" textAnchor="end" letterSpacing="0.02em">{v}</text>
              )}
            </g>
          );
        })}
        <text x={W - 12 - 18} y={height - padBottom + 4} fontSize="10" fontWeight="700"
              fill="#1A1A1A" textAnchor="end" opacity="0.55">0</text>
      </svg>
    </div>
  );
}

// ---- POWER BAR ----
interface PowerBarProps { value?: number; height?: number }
export function PowerBar({ value = 0.4, height = 200 }: PowerBarProps) {
  return (
    <div style={{
      width: 26,
      height,
      background: '#1A1A1A',
      border: '3px solid #1A1A1A',
      borderRadius: 6,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '3px 3px 0 rgba(0,0,0,0.4)',
    }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: `${Math.round(value * 100)}%`,
        background: 'linear-gradient(180deg, #FF3D8A 0%, #FFD23F 70%, #1FD5C8 100%)',
      }} />
      {([0.25, 0.5, 0.75] as const).map((p, i) => (
        <div key={i} style={{ position: 'absolute', left: 0, right: 0, bottom: `${p * 100}%`, height: 2, background: 'rgba(0,0,0,0.4)' }} />
      ))}
    </div>
  );
}
