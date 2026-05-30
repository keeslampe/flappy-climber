// Rad Kid — Frame 08: WALK A (right leg forward, left arm forward)
// Standard side-view walk, body facing right. Contralateral swing.

export function RadKidWalkA() {
  return (
    <g stroke="#1A1A1A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">

      {/* === LEFT ARM swung FORWARD (in front of torso) === */}
      <path d="M60 56 L78 70 L84 60" fill="#F2C9A0" stroke="none" />
      <path d="M58 54 L82 66 L86 58 L62 46 Z" fill="#1FD5C8" />
      <path d="M80 56 Q88 56 90 62 L86 70 Q78 70 76 64 Z" fill="#F2C9A0" />

      {/* === HOODIE TORSO === */}
      <path d="M46 52 Q44 80 50 92 L78 92 Q84 80 82 52 Q72 46 62 46 Q52 46 46 52 Z" fill="#1FD5C8" />
      <path d="M52 52 Q62 58 74 52" strokeWidth="2.6" fill="none" />
      <path d="M52 74 L74 74 L72 88 L54 88 Z" fill="#19B8AD" />
      <path d="M52 74 L74 74" strokeWidth="2.4" />
      <path d="M58 52 L58 66 M68 52 L68 64" strokeWidth="2" />
      <circle cx="58" cy="67" r="1.6" fill="#1A1A1A" stroke="none" />
      <circle cx="68" cy="65" r="1.6" fill="#1A1A1A" stroke="none" />

      {/* === RIGHT ARM swung BACK (behind torso) === */}
      <path d="M48 56 L34 70 L28 58" fill="#F2C9A0" stroke="none" />
      <path d="M50 54 L30 68 L24 60 L46 46 Z" fill="#1FD5C8" />
      <path d="M22 54 Q28 52 32 58 L30 66 Q24 68 20 62 Z" fill="#F2C9A0" />

      {/* === SHORTS === */}
      <path d="M46 88 L82 88 L80 106 L68 106 L64 96 L58 96 L54 106 L46 106 Z" fill="#7A2BD9" />
      <path d="M52 98 L56 92 L60 98 Z" fill="#FFD23F" stroke="#1A1A1A" strokeWidth="1.6" />
      <path d="M66 100 L70 94 L74 100 Z" fill="#FF3D8A" stroke="#1A1A1A" strokeWidth="1.6" />

      {/* === RIGHT LEG STRIDING FORWARD (bent knee, foot lifted) === */}
      <path d="M64 104 L82 100 L88 116 L74 116 Z" fill="#7A2BD9" />
      <path d="M82 114 L88 116 L92 122 L78 124 Z" fill="#F2C9A0" />
      <path d="M76 122 L96 118 L100 124 L78 126 Q72 126 72 122 Z" fill="#FFD23F" />
      <path d="M78 124 L96 122" strokeWidth="2" />
      <path d="M78 125 Q86 122 96 124" strokeWidth="1.6" stroke="#FF3D8A" fill="none" />

      {/* === LEFT LEG PLANTED BACK (straight, slightly behind) === */}
      <path d="M50 104 L62 104 L58 122 L46 122 Z" fill="#7A2BD9" />
      <path d="M50 110 L60 110 L58 124 L48 124 Z" fill="#F2C9A0" />
      <path d="M40 120 L60 120 L62 126 L40 126 Q34 126 34 122 Z" fill="#FFD23F" />
      <path d="M42 123 L60 123" strokeWidth="2" />
      <path d="M42 124 Q50 122 60 124" strokeWidth="1.6" stroke="#FF3D8A" fill="none" />

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
