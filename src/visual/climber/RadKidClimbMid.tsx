// Rad Kid — Frame 04: CLIMB MID (transition)
// Both arms at mid-height (passing through), both feet on the wall.
// Softens the arm switch between CLIMB-L and CLIMB-R so the cycle reads smoother.

export function RadKidClimbMid() {
  return (
    <g stroke="#1A1A1A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">

      {/* === LEFT ARM mid-height (back arm, bent upward) === */}
      <path d="M44 50 L34 32 L38 16" fill="#F2C9A0" stroke="none" />
      <path d="M44 50 L34 32 L42 28 L52 48 Z" fill="#1FD5C8" />
      <path d="M34 12 Q40 10 44 16 L42 26 Q36 28 32 22 Z" fill="#F2C9A0" />
      <path d="M36 16 L36 12 M40 14 L40 10" strokeWidth="2" />
      <circle cx="30" cy="22" r="2.4" fill="#FFF6E5" stroke="#1A1A1A" strokeWidth="1.2" opacity="0.7" />

      {/* === HOODIE TORSO === */}
      <path d="M42 50 Q40 80 48 92 L78 92 Q84 80 80 50 Q70 44 60 44 Q50 44 42 50 Z" fill="#1FD5C8" />
      <path d="M50 50 Q60 56 72 50" strokeWidth="2.6" fill="none" />
      <path d="M50 74 L72 74 L70 88 L52 88 Z" fill="#19B8AD" />
      <path d="M50 74 L72 74" strokeWidth="2.4" />
      <path d="M56 50 L56 64 M66 50 L66 62" strokeWidth="2" />
      <circle cx="56" cy="65" r="1.6" fill="#1A1A1A" stroke="none" />
      <circle cx="66" cy="63" r="1.6" fill="#1A1A1A" stroke="none" />

      {/* === RIGHT ARM mid-height (front, bent upward — mirror of left) === */}
      <path d="M78 50 L92 32 L88 16" fill="#F2C9A0" stroke="none" />
      <path d="M78 50 L94 32 L86 28 L74 48 Z" fill="#1FD5C8" />
      <path d="M84 12 Q92 10 94 16 L92 26 Q86 28 82 22 Z" fill="#F2C9A0" />
      <path d="M86 16 L86 12 M90 14 L90 10" strokeWidth="2" />
      <circle cx="100" cy="22" r="2.4" fill="#FFF6E5" stroke="#1A1A1A" strokeWidth="1.2" opacity="0.7" />

      {/* === SHORTS === */}
      <path d="M42 88 L80 88 L78 106 L66 106 L62 96 L56 96 L52 106 L42 106 Z" fill="#7A2BD9" />

      {/* === BOTH LEGS straight (mid-step, slightly staggered for forward feel) === */}
      <path d="M46 106 L58 106 L56 122 L44 122 Z" fill="#F2C9A0" />
      <g transform="matrix(-1 0 0 1 96 0)">
        <path d="M40 118 L60 118 L62 124 L38 124 Q34 124 34 120 Z" fill="#FFD23F" />
        <path d="M42 121 L60 121" strokeWidth="2" />
      </g>

      <path d="M64 106 L78 106 L76 122 L64 122 Z" fill="#F2C9A0" />
      <g transform="matrix(-1 0 0 1 138 0)">
        <path d="M60 118 L80 118 L82 124 L60 124 Q56 124 56 120 Z" fill="#FFD23F" />
        <path d="M62 121 L80 121" strokeWidth="2" />
      </g>

      {/* === HEAD === */}
      <path d="M52 22 Q50 38 58 44 Q70 44 76 36 Q78 28 76 20 Q70 12 60 14 Q54 16 52 22 Z" fill="#F2C9A0" />
      <path d="M52 30 Q50 32 51 36 Q54 36 54 33 Z" fill="#F2C9A0" />
      <path d="M66 22 L72 21" strokeWidth="2.4" />
      <circle cx="70" cy="25" r="1.7" fill="#1A1A1A" stroke="none" />
      <path d="M64 36 L72 36" strokeWidth="2.2" />

      {/* === BACKWARDS SNAPBACK === */}
      <path d="M50 18 Q48 4 62 2 Q76 2 78 14 L78 20 L52 20 Z" fill="#FF3D8A" />
      <path d="M50 18 L42 22 L42 25 L52 24 Z" fill="#E62873" />
      <path d="M52 18 L78 18" strokeWidth="2.2" />
      <path d="M56 8 Q60 5 64 8 T72 7" strokeWidth="1.8" stroke="#FFF6E5" fill="none" />
      <circle cx="64" cy="4" r="1.8" fill="#FFF6E5" />
    </g>
  );
}
