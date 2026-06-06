// Rad Kid — Frame 09: WALK B (left leg forward, right arm forward)
// Opposite step of WALK-A. Contralateral arm + leg swing.

export function RadKidWalkB() {
  return (
    <g stroke="#1A1A1A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">

      {/* === RIGHT ARM swung FORWARD === */}
      <path d="M68 56 L86 70 L92 60" fill="#F2C9A0" stroke="none" />
      <path d="M66 54 L90 66 L94 58 L70 46 Z" fill="#1FD5C8" />
      <path d="M88 56 Q96 56 98 62 L94 70 Q86 70 84 64 Z" fill="#F2C9A0" />

      {/* === HOODIE TORSO === */}
      <path d="M46 52 Q44 80 50 92 L78 92 Q84 80 82 52 Q72 46 62 46 Q52 46 46 52 Z" fill="#1FD5C8" />
      <path d="M52 52 Q62 58 74 52" strokeWidth="2.6" fill="none" />
      <path d="M52 74 L74 74 L72 88 L54 88 Z" fill="#19B8AD" />
      <path d="M52 74 L74 74" strokeWidth="2.4" />
      <path d="M58 52 L58 66 M68 52 L68 64" strokeWidth="2" />
      <circle cx="58" cy="67" r="1.6" fill="#1A1A1A" stroke="none" />
      <circle cx="68" cy="65" r="1.6" fill="#1A1A1A" stroke="none" />

      {/* === LEFT ARM swung BACK === */}
      <path d="M44 56 L30 70 L24 60" fill="#F2C9A0" stroke="none" />
      <path d="M46 54 L26 68 L20 60 L42 46 Z" fill="#1FD5C8" />
      <path d="M18 54 Q24 52 28 58 L26 66 Q20 68 16 62 Z" fill="#F2C9A0" />

      {/* === SHORTS === */}
      <path d="M46 88 L82 88 L80 106 L68 106 L64 96 L58 96 L54 106 L46 106 Z" fill="#7A2BD9" />

      {/* === LEFT LEG STRIDING FORWARD (bent knee, foot lifted) === */}
      <path d="M50 104 L68 100 L72 116 L58 116 Z" fill="#7A2BD9" />
      <path d="M66 114 L72 116 L74 122 L60 124 Z" fill="#F2C9A0" />
      <g transform="matrix(-1 0 0 1 132 0)">
        <path d="M58 122 L78 118 L80 124 L58 126 Q52 126 52 122 Z" fill="#FFD23F" />
        <path d="M60 124 L78 122" strokeWidth="2" />
        <path d="M60 125 Q68 122 78 124" strokeWidth="1.6" stroke="#FF3D8A" fill="none" />
      </g>

      {/* === RIGHT LEG PLANTED BACK (straight, slightly behind body axis) === */}
      <path d="M66 104 L78 104 L74 122 L62 122 Z" fill="#7A2BD9" />
      <path d="M66 110 L76 110 L74 124 L64 124 Z" fill="#F2C9A0" />
      <g transform="matrix(-1 0 0 1 128 0)">
        <path d="M56 120 L76 120 L78 126 L56 126 Q50 126 50 122 Z" fill="#FFD23F" />
        <path d="M58 123 L76 123" strokeWidth="2" />
        <path d="M58 124 Q66 122 76 124" strokeWidth="1.6" stroke="#FF3D8A" fill="none" />
      </g>

      {/* === HEAD === */}
      <path d="M54 24 Q52 40 60 46 Q72 46 78 38 Q80 30 78 22 Q72 14 62 16 Q56 18 54 24 Z" fill="#F2C9A0" />
      <path d="M54 32 Q52 34 53 38 Q56 38 56 35 Z" fill="#F2C9A0" />
      <path d="M68 24 L74 23" strokeWidth="2.4" />
      <circle cx="72" cy="27" r="1.7" fill="#1A1A1A" stroke="none" />
      <path d="M66 38 L74 38" strokeWidth="2.2" />

      {/* === BACKWARDS SNAPBACK === */}
      <path d="M52 20 Q50 6 64 4 Q78 4 80 16 L80 22 L54 22 Z" fill="#FF3D8A" />
      <path d="M52 20 L44 24 L44 27 L54 26 Z" fill="#E62873" />
      <path d="M54 20 L80 20" strokeWidth="2.2" />
      <path d="M58 10 Q62 7 66 10 T74 9" strokeWidth="1.8" stroke="#FFF6E5" fill="none" />
      <circle cx="66" cy="6" r="1.8" fill="#FFF6E5" />
    </g>
  );
}
