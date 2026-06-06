// Rad Kid — Frame 02: CLIMB LEFT
// LEFT arm reaching straight up; RIGHT leg bent up (knee high, foot pressing wall).
// LEFT leg planted long below. Contralateral pairing (opposite arm + leg up)
// reads as natural climbing locomotion. Character always faces right.

export function RadKidClimbL() {
  return (
    <g stroke="#1A1A1A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">

      {/* === LEFT ARM REACHING STRAIGHT UP (back shoulder) === */}
      <path d="M48 50 L44 22 L56 22 L58 50 Z" fill="#1FD5C8" />
      <path d="M48 22 L44 6" stroke="#1A1A1A" strokeWidth="3.2" fill="none" />
      <path d="M52 22 L54 6" stroke="#1A1A1A" strokeWidth="3.2" fill="none" />
      <path d="M42 22 L58 22 L58 6 Q58 2 54 2 L46 2 Q42 2 42 6 Z" fill="#F2C9A0" />
      <path d="M46 8 L46 4 M50 8 L50 4 M54 8 L54 4" strokeWidth="2" />
      <circle cx="38" cy="14" r="3" fill="#FFF6E5" stroke="#1A1A1A" strokeWidth="1.4" opacity="0.85" />
      <circle cx="62" cy="10" r="2" fill="#FFF6E5" stroke="#1A1A1A" strokeWidth="1.2" opacity="0.7" />

      {/* === HOODIE TORSO === */}
      <path d="M42 50 Q40 80 48 92 L78 92 Q84 80 80 50 Q70 44 60 44 Q50 44 42 50 Z" fill="#1FD5C8" />
      <path d="M50 50 Q60 56 72 50" strokeWidth="2.6" fill="none" />
      <path d="M50 74 L72 74 L70 88 L52 88 Z" fill="#19B8AD" />
      <path d="M50 74 L72 74" strokeWidth="2.4" />
      <path d="M56 50 L56 64 M66 50 L66 62" strokeWidth="2" />
      <circle cx="56" cy="65" r="1.6" fill="#1A1A1A" stroke="none" />
      <circle cx="66" cy="63" r="1.6" fill="#1A1A1A" stroke="none" />

      {/* === RIGHT ARM bent (front, holding a hold at chest height) === */}
      <path d="M76 52 L92 50 L96 38" fill="#F2C9A0" stroke="none" />
      <path d="M78 50 L96 46 L94 38 L76 42 Z" fill="#1FD5C8" />
      <path d="M90 36 Q98 34 102 38 L102 46 Q94 48 90 44 Z" fill="#F2C9A0" />
      <path d="M96 40 L96 36 M100 41 L100 37" strokeWidth="2" />

      {/* === SHORTS === */}
      <path d="M42 88 L80 88 L78 106 L66 106 L62 96 L56 96 L52 106 L42 106 Z" fill="#7A2BD9" />

      {/* === LEFT LEG PLANTED LONG (back leg, low foot) === */}
      <path d="M44 106 L56 106 L54 122 L42 122 Z" fill="#F2C9A0" />
      <g transform="matrix(-1 0 0 1 92 0)">
        <path d="M38 118 L58 118 L60 124 L36 124 Q32 124 32 120 Z" fill="#FFD23F" />
        <path d="M40 121 L58 121" strokeWidth="2" />
        <path d="M40 122 Q48 120 58 122" strokeWidth="1.6" stroke="#FF3D8A" fill="none" />
      </g>

      {/* === RIGHT LEG BENT UP (front leg, knee high, foot pushing wall) === */}
      <path d="M62 90 L80 86 L74 102 L60 102 Z" fill="#7A2BD9" />
      <path d="M60 102 L74 102 L70 112 L58 112 Z" fill="#F2C9A0" />
      <g transform="matrix(-1 0 0 1 124 0)">
        <path d="M54 108 L74 108 L78 116 L52 116 Q46 114 48 110 Z" fill="#FFD23F" />
        <path d="M52 112 L74 112" strokeWidth="2" />
        <path d="M52 114 Q62 111 74 113" strokeWidth="1.6" stroke="#FF3D8A" fill="none" />
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
