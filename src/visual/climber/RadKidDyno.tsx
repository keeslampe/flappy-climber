// Rad Kid — Frame 04: DYNO
// Mid-jump explosion. Both arms shot up overhead, body fully extended,
// legs trailing back, hoodie flap-up. Mouth open in determined yell.

export function RadKidDyno() {
  return (
    <g stroke="#1A1A1A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">

      {/* motion lines below feet */}
      <path d="M30 116 L24 124 M48 118 L42 126 M70 118 L76 126 M90 116 L96 124" strokeWidth="2.4" stroke="#FF3D8A" fill="none" />
      <path d="M58 122 L58 128" strokeWidth="2.4" stroke="#FFD23F" fill="none" />

      {/* === BOTH ARMS SHOT STRAIGHT UP === */}
      {/* Right arm */}
      <path d="M40 50 L38 14 L48 10 L52 48 Z" fill="#1FD5C8" />
      {/* hand reaching */}
      <path d="M40 8 Q42 4 50 6 L50 14 Q44 16 38 14 Z" fill="#F2C9A0" />
      <path d="M42 8 L42 4 M46 7 L46 3 M49 8 L49 4" strokeWidth="2" fill="none" />

      {/* Left arm */}
      <path d="M68 48 L72 10 L82 14 L80 50 Z" fill="#1FD5C8" />
      <path d="M70 6 Q74 2 82 4 L82 12 Q76 14 70 12 Z" fill="#F2C9A0" />
      <path d="M72 6 L72 2 M76 5 L76 1 M80 6 L80 2" strokeWidth="2" fill="none" />

      {/* === HOODIE (slightly stretched/lifted) === */}
      <path d="M40 52 Q40 80 46 92 L74 92 Q80 80 80 52 Q68 44 60 44 Q48 44 40 52 Z" fill="#1FD5C8" />
      {/* hood flap-up (wind) */}
      <path d="M52 50 Q60 38 70 52" strokeWidth="2.6" fill="none" />
      <path d="M48 74 L72 74 L70 88 L50 88 Z" fill="#19B8AD" />
      <path d="M48 74 L72 74" strokeWidth="2.4" />
      <path d="M52 52 L54 66 M66 52 L66 64" strokeWidth="2" />
      <circle cx="54" cy="67" r="1.6" fill="#1A1A1A" stroke="none" />
      <circle cx="66" cy="65" r="1.6" fill="#1A1A1A" stroke="none" />
      <path d="M52 62 Q56 58 60 62 T68 62" strokeWidth="2.2" stroke="#FF3D8A" fill="none" />

      {/* === HEAD (looking up) === */}
      <path d="M50 24 Q48 38 54 44 Q66 46 70 38 Q72 32 70 24 Q66 16 60 16 Q54 16 50 24 Z" fill="#F2C9A0" />
      <path d="M54 32 Q52 34 53 38 Q56 38 56 35 Z" fill="#F2C9A0" />
      {/* eye wide looking up */}
      <circle cx="64" cy="28" r="2.4" fill="#FFF6E5" stroke="#1A1A1A" strokeWidth="2" />
      <circle cx="65" cy="28" r="1.2" fill="#1A1A1A" stroke="none" />
      {/* mouth open yell */}
      <path d="M62 38 Q66 44 70 38 Q66 36 62 38 Z" fill="#1A1A1A" />

      {/* === BACKWARDS SNAPBACK === */}
      <path d="M48 20 Q46 10 60 8 Q74 8 76 18 L76 24 L50 24 Z" fill="#FF3D8A" />
      <path d="M48 21 L42 24 L42 27 L50 26 Z" fill="#E62873" />
      <path d="M50 22 L76 22" strokeWidth="2.2" />
      <path d="M54 14 Q58 11 62 14 T70 13" strokeWidth="1.8" stroke="#FFF6E5" fill="none" />
      <circle cx="62" cy="10" r="1.8" fill="#FFF6E5" />

      {/* === SHORTS === */}
      <path d="M40 88 L80 88 L78 104 L68 104 L64 96 L56 96 L52 104 L42 104 Z" fill="#7A2BD9" />
      <path d="M48 98 L52 92 L56 98 Z" fill="#FFD23F" stroke="#1A1A1A" strokeWidth="1.6" />
      <path d="M64 100 L68 94 L72 100 Z" fill="#FF3D8A" stroke="#1A1A1A" strokeWidth="1.6" />

      {/* === LEGS trailing slightly bent === */}
      {/* Right leg (left of screen) — slightly back/down */}
      <path d="M42 104 L52 104 L54 116 L40 118 Z" fill="#F2C9A0" />
      <path d="M34 114 L54 112 L58 122 L36 124 Q30 124 30 120 Z" fill="#FFD23F" />
      <path d="M36 119 L56 118" strokeWidth="2" />

      {/* Left leg */}
      <path d="M68 104 L78 104 L82 116 L70 118 Z" fill="#F2C9A0" />
      <path d="M64 114 L86 112 L90 122 L66 124 Q62 124 62 120 Z" fill="#FFD23F" />
      <path d="M66 119 L86 118" strokeWidth="2" />

      <ellipse cx="36" cy="94" rx="4.5" ry="6" fill="#FFF6E5" />
      <path d="M32 90 L40 90" strokeWidth="2" />
    </g>
  );
}
