// Rad Kid — Frame 03: CLIMB RIGHT
// RIGHT arm reaching straight up; LEFT leg bent up (knee high behind).
// RIGHT leg planted long below. Contralateral pairing — opposite of CLIMB-L.

export function RadKidClimbR() {
  return (
    <g stroke="#1A1A1A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">

      {/* === LEFT ARM bent (back, holding hold at chest height) === */}
      <path d="M44 52 L30 50 L26 38" fill="#F2C9A0" stroke="none" />
      <path d="M42 50 L26 46 L28 38 L46 42 Z" fill="#1FD5C8" />
      <path d="M20 36 Q26 34 30 38 L30 46 Q24 48 20 44 Z" fill="#F2C9A0" />
      <path d="M24 40 L24 36 M28 41 L28 37" strokeWidth="2" />

      {/* === HOODIE TORSO === */}
      <path d="M42 50 Q40 80 48 92 L78 92 Q84 80 80 50 Q70 44 60 44 Q50 44 42 50 Z" fill="#1FD5C8" />
      <path d="M50 50 Q60 56 72 50" strokeWidth="2.6" fill="none" />
      <path d="M50 74 L72 74 L70 88 L52 88 Z" fill="#19B8AD" />
      <path d="M50 74 L72 74" strokeWidth="2.4" />
      <path d="M56 50 L56 64 M66 50 L66 62" strokeWidth="2" />
      <circle cx="56" cy="65" r="1.6" fill="#1A1A1A" stroke="none" />
      <circle cx="66" cy="63" r="1.6" fill="#1A1A1A" stroke="none" />

      {/* === RIGHT ARM REACHING STRAIGHT UP (front shoulder) === */}
      <path d="M68 50 L72 22 L84 22 L80 50 Z" fill="#1FD5C8" />
      <path d="M76 22 L78 6" stroke="#1A1A1A" strokeWidth="3.2" fill="none" />
      <path d="M80 22 L84 6" stroke="#1A1A1A" strokeWidth="3.2" fill="none" />
      <path d="M70 22 L86 22 L88 6 Q88 2 84 2 L74 2 Q70 2 70 6 Z" fill="#F2C9A0" />
      <path d="M74 8 L74 4 M78 8 L78 4 M82 8 L82 4 M86 8 L86 4" strokeWidth="2" />
      <circle cx="92" cy="14" r="3" fill="#FFF6E5" stroke="#1A1A1A" strokeWidth="1.4" opacity="0.85" />
      <circle cx="68" cy="10" r="2" fill="#FFF6E5" stroke="#1A1A1A" strokeWidth="1.2" opacity="0.7" />

      {/* === SHORTS === */}
      <path d="M42 88 L80 88 L78 106 L66 106 L62 96 L56 96 L52 106 L42 106 Z" fill="#7A2BD9" />

      {/* === RIGHT LEG PLANTED LONG (front, low foot) === */}
      <path d="M66 106 L78 106 L80 122 L66 122 Z" fill="#F2C9A0" />
      <g transform="matrix(-1 0 0 1 140 0)">
        <path d="M62 118 L82 118 L84 124 L60 124 Q56 124 56 120 Z" fill="#FFD23F" />
        <path d="M64 121 L84 121" strokeWidth="2" />
        <path d="M64 122 Q72 120 84 122" strokeWidth="1.6" stroke="#FF3D8A" fill="none" />
      </g>

      {/* === LEFT LEG BENT UP (back leg, knee high behind) === */}
      <path d="M40 90 L58 86 L54 102 L40 102 Z" fill="#7A2BD9" />
      <path d="M40 102 L54 102 L50 112 L38 112 Z" fill="#F2C9A0" />
      <g transform="matrix(-1 0 0 1 74 0)">
        <path d="M30 108 L52 108 L52 116 L28 116 Q22 114 24 110 Z" fill="#FFD23F" />
        <path d="M30 112 L52 112" strokeWidth="2" />
        <path d="M30 114 Q40 111 52 113" strokeWidth="1.6" stroke="#FF3D8A" fill="none" />
      </g>

      {/* === HEAD (facing right, looking up at reach) === */}
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
