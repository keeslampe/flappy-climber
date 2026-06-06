// Rad Kid — Frame 01: IDLE
// Hanging from holds, both arms straight up, weight settled. Calm smirk.

export function RadKidIdle() {
  return (
    <g stroke="#1A1A1A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">

      {/* === RIGHT ARM (left of screen) reaching up === */}
      <path d="M40 50 L36 14 L48 12 L52 48 Z" fill="#1FD5C8" />
      <circle cx="42" cy="10" r="6" fill="#F2C9A0" />
      <path d="M38 6 L42 3 M45 7 L48 4" strokeWidth="2" fill="none" />

      {/* === LEFT ARM (right of screen) reaching up === */}
      <path d="M68 48 L72 12 L84 14 L80 50 Z" fill="#1FD5C8" />
      <circle cx="78" cy="10" r="6" fill="#F2C9A0" />
      <path d="M74 6 L78 3 M80 7 L84 4" strokeWidth="2" fill="none" />

      {/* === HOODIE TORSO === */}
      <path d="M40 52 Q38 78 46 92 L74 92 Q82 78 80 52 Q66 46 58 46 Q48 46 40 52 Z" fill="#1FD5C8" />
      <path d="M48 50 Q60 56 72 50" strokeWidth="2.6" fill="none" />
      <path d="M48 74 L72 74 L70 88 L50 88 Z" fill="#19B8AD" />
      <path d="M48 74 L72 74" strokeWidth="2.4" />
      <path d="M52 50 L52 64 M68 50 L68 62" strokeWidth="2" />
      <circle cx="52" cy="65" r="1.6" fill="#1A1A1A" stroke="none" />
      <circle cx="68" cy="63" r="1.6" fill="#1A1A1A" stroke="none" />

      {/* === HEAD === */}
      <path d="M50 22 Q48 36 54 42 Q66 44 70 36 Q72 30 70 22 Q66 14 60 14 Q54 14 50 22 Z" fill="#F2C9A0" />
      <path d="M54 30 Q52 32 53 36 Q56 36 56 33 Z" fill="#F2C9A0" />
      <path d="M62 26 L66 25" strokeWidth="2.4" />
      <circle cx="64" cy="29" r="1.6" fill="#1A1A1A" stroke="none" />
      <path d="M62 37 Q66 38 70 36" strokeWidth="2" fill="none" />

      {/* === BACKWARDS SNAPBACK === */}
      <path d="M48 18 Q46 8 58 6 Q72 4 74 16 L74 22 L50 22 Z" fill="#FF3D8A" />
      <path d="M48 19 L42 22 L42 25 L50 24 Z" fill="#E62873" />
      <path d="M50 20 L74 20" strokeWidth="2.2" />
      <path d="M54 12 Q58 9 62 12 T70 11" strokeWidth="1.8" stroke="#FFF6E5" fill="none" />
      <circle cx="60" cy="7" r="1.8" fill="#FFF6E5" />

      {/* === SHORTS === */}
      <path d="M40 88 L80 88 L78 106 L68 106 L64 96 L56 96 L52 106 L42 106 Z" fill="#7A2BD9" />

      {/* === RIGHT LEG (left on screen) — planted === */}
      <path d="M42 106 L52 106 L50 120 L40 120 Z" fill="#F2C9A0" />
      <g transform="matrix(-1 0 0 1 86 0)">
        <path d="M36 118 L54 118 L56 124 L36 124 Q30 124 30 120 Z" fill="#FFD23F" />
        <path d="M38 121 L54 121" strokeWidth="2" />
        <path d="M40 122 Q46 120 54 122" strokeWidth="1.8" stroke="#FF3D8A" fill="none" />
      </g>

      {/* === LEFT LEG (right on screen) — planted === */}
      <path d="M68 106 L80 106 L82 120 L70 120 Z" fill="#F2C9A0" />
      <g transform="matrix(-1 0 0 1 150 0)">
        <path d="M64 118 L86 118 L88 124 L66 124 Q62 124 62 120 Z" fill="#FFD23F" />
        <path d="M68 121 L86 121" strokeWidth="2" />
        <path d="M70 122 Q78 120 86 122" strokeWidth="1.8" stroke="#FF3D8A" fill="none" />
      </g>
    </g>
  );
}
