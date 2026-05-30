// Rad Kid — Frame 07: HURT
// Recoiled, head back, X eyes, stars circling. "Oof" expression.

export function RadKidHurt() {
  return (
    <g stroke="#1A1A1A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">

      {/* stars circling the head */}
      <g stroke="#FFD23F" fill="#FFD23F" strokeWidth="1.6">
        <path d="M16 14 L18 18 L22 18 L19 20 L20 24 L16 22 L12 24 L13 20 L10 18 L14 18 Z" />
        <path d="M104 10 L106 14 L110 14 L107 16 L108 20 L104 18 L100 20 L101 16 L98 14 L102 14 Z" />
        <path d="M108 36 L110 40 L114 40 L111 42 L112 46 L108 44 L104 46 L105 42 L102 40 L106 40 Z" />
      </g>
      {/* "ow!" speech indicator */}
      <g transform="translate(94 56)">
        <path d="M-12 -8 Q-14 0 -12 6 L-2 8 Q0 6 0 -6 Q-2 -10 -12 -8 Z" fill="#FFF6E5" />
        <path d="M-8 0 L-4 0 M-8 4 L-6 4" strokeWidth="2.2" />
      </g>

      {/* === RIGHT ARM up clutching head === */}
      <path d="M44 50 L36 32 L48 22" fill="#F2C9A0" stroke="none" />
      <path d="M40 50 L32 32 L42 24 L50 48 Z" fill="#1FD5C8" />
      <path d="M44 18 Q48 14 54 18 L56 26 Q50 28 44 26 Z" fill="#F2C9A0" />
      <path d="M46 18 L46 14 M50 17 L50 13 M54 18 L54 14" strokeWidth="2" />

      {/* === LEFT ARM hanging limp === */}
      <path d="M72 54 L80 80" fill="#F2C9A0" stroke="none" />
      <path d="M72 52 L82 52 L84 80 L74 82 Z" fill="#1FD5C8" />
      <circle cx="80" cy="86" r="5.5" fill="#F2C9A0" />
      <path d="M78 90 L82 92" strokeWidth="2" />

      {/* === HOODIE TORSO (slumped) === */}
      <path d="M40 54 Q40 80 46 94 L74 94 Q80 80 78 54 Q68 50 58 50 Q48 50 40 54 Z" fill="#1FD5C8" />
      <path d="M48 54 Q60 60 72 54" strokeWidth="2.6" fill="none" />
      <path d="M48 76 L70 76 L68 90 L50 90 Z" fill="#19B8AD" />
      <path d="M48 76 L70 76" strokeWidth="2.4" />
      <path d="M52 54 L52 66 M66 54 L66 64" strokeWidth="2" />
      <circle cx="52" cy="67" r="1.6" fill="#1A1A1A" stroke="none" />
      <circle cx="66" cy="65" r="1.6" fill="#1A1A1A" stroke="none" />
      <path d="M52 62 Q56 58 60 62 T68 62" strokeWidth="2.2" stroke="#FF3D8A" fill="none" />

      {/* === HEAD (tilted back, dazed) === */}
      <g transform="translate(60 30) rotate(-12) translate(-60 -30)">
        <path d="M50 22 Q48 38 54 44 Q66 46 70 38 Q72 32 70 22 Q66 14 60 14 Q54 14 50 22 Z" fill="#F2C9A0" />
        <path d="M54 30 Q52 32 53 36 Q56 36 56 33 Z" fill="#F2C9A0" />
        {/* X eyes */}
        <path d="M60 26 L66 32 M66 26 L60 32" strokeWidth="2.4" />
        {/* dazed open mouth */}
        <ellipse cx="64" cy="40" rx="3" ry="2" fill="#1A1A1A" />
        {/* tongue */}
        <path d="M62 41 Q64 43 66 41" strokeWidth="1.6" stroke="#FF3D8A" fill="#FF3D8A" />

        {/* hat askew */}
        <g transform="translate(60 18) rotate(8) translate(-60 -18)">
          <path d="M48 18 Q46 6 60 4 Q74 4 76 16 L76 22 L50 22 Z" fill="#FF3D8A" />
          <path d="M48 19 L42 22 L42 25 L50 24 Z" fill="#E62873" />
          <path d="M50 20 L76 20" strokeWidth="2.2" />
          <circle cx="62" cy="6" r="1.8" fill="#FFF6E5" />
        </g>
      </g>

      {/* === SHORTS === */}
      <path d="M40 90 L80 90 L78 108 L68 108 L64 98 L56 98 L52 108 L42 108 Z" fill="#7A2BD9" />
      <path d="M48 100 L52 94 L56 100 Z" fill="#FFD23F" stroke="#1A1A1A" strokeWidth="1.6" />

      {/* === LEGS (one buckled in) === */}
      <path d="M42 108 L54 108 L56 122 L40 124 Z" fill="#F2C9A0" />
      <path d="M34 120 L58 120 L60 126 L36 128 Q30 128 30 124 Z" fill="#FFD23F" />
      <path d="M36 123 L58 123" strokeWidth="2" />

      <path d="M64 108 L78 108 L80 122 L70 122 Z" fill="#F2C9A0" />
      <path d="M62 120 L86 120 L88 126 L66 126 Q62 126 62 122 Z" fill="#FFD23F" />
      <path d="M64 123 L86 123" strokeWidth="2" />

      <ellipse cx="38" cy="94" rx="4.5" ry="6" fill="#FFF6E5" />
    </g>
  );
}
