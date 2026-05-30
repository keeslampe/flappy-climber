// Rad Kid — Frame 06: SUMMIT
// Standing upright on top, fist pumped overhead, victorious grin.
// Sparkle bursts radiate.

export function RadKidSummit() {
  return (
    <g stroke="#1A1A1A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">

      {/* sparkle bursts around the figure */}
      <g stroke="#FFD23F" fill="#FFD23F" strokeWidth="2">
        <path d="M22 18 L22 8 M17 13 L27 13" />
        <path d="M104 22 L104 14 M100 18 L108 18" />
        <path d="M18 50 L14 50 M16 48 L16 52" />
        <path d="M110 48 L114 48 M112 46 L112 50" />
      </g>
      <g stroke="#FF3D8A" fill="none" strokeWidth="2.2">
        <circle cx="14" cy="32" r="3" />
        <circle cx="112" cy="34" r="3" />
      </g>

      {/* === RAISED FIST (right arm up high) === */}
      <path d="M44 44 L40 12" fill="none" strokeWidth="3.2" />
      <path d="M38 42 L38 14 L48 12 L52 44 Z" fill="#1FD5C8" />
      {/* fist clenched */}
      <path d="M36 6 Q40 2 50 4 L52 14 Q44 16 36 12 Z" fill="#F2C9A0" />
      <path d="M38 6 L38 2 M42 5 L42 1 M46 5 L46 1 M50 6 L50 2" strokeWidth="2" />

      {/* === LEFT ARM down by side, thumbs-up === */}
      <path d="M70 50 L80 70 L86 84" fill="#F2C9A0" stroke="none" />
      <path d="M72 50 L80 70 L86 70 L78 50 Z" fill="#1FD5C8" />
      {/* hand thumbs-up */}
      <g transform="translate(86 82)">
        <path d="M-4 -4 Q-2 -8 4 -6 L6 4 Q-2 6 -6 2 Z" fill="#F2C9A0" />
        <path d="M0 -8 L0 -14" strokeWidth="2.5" />
        <path d="M-2 -14 Q0 -16 2 -14 L2 -8 L-2 -8 Z" fill="#F2C9A0" />
      </g>

      {/* === HOODIE TORSO (proud chest out) === */}
      <path d="M40 52 Q38 78 46 92 L74 92 Q82 78 80 52 Q66 46 58 46 Q48 46 40 52 Z" fill="#1FD5C8" />
      <path d="M48 50 Q60 56 72 50" strokeWidth="2.6" fill="none" />
      <path d="M48 74 L72 74 L70 88 L50 88 Z" fill="#19B8AD" />
      <path d="M48 74 L72 74" strokeWidth="2.4" />
      <path d="M52 50 L52 64 M68 50 L68 62" strokeWidth="2" />
      <circle cx="52" cy="65" r="1.6" fill="#1A1A1A" stroke="none" />
      <circle cx="68" cy="63" r="1.6" fill="#1A1A1A" stroke="none" />
      <path d="M52 60 Q56 56 60 60 T68 60" strokeWidth="2.2" stroke="#FF3D8A" fill="none" />

      {/* === HEAD (proud, big grin) === */}
      <path d="M50 22 Q48 38 54 44 Q66 46 70 38 Q72 32 70 22 Q66 14 60 14 Q54 14 50 22 Z" fill="#F2C9A0" />
      <path d="M54 30 Q52 32 53 36 Q56 36 56 33 Z" fill="#F2C9A0" />
      {/* squinty happy eye */}
      <path d="M62 28 Q66 26 70 28" strokeWidth="2.4" fill="none" />
      {/* big grin */}
      <path d="M60 36 Q66 44 72 36" strokeWidth="2.4" fill="#FFF6E5" />
      <path d="M60 36 L72 36" strokeWidth="2" />

      {/* === BACKWARDS SNAPBACK === */}
      <path d="M48 18 Q46 6 60 4 Q74 4 76 16 L76 22 L50 22 Z" fill="#FF3D8A" />
      <path d="M48 19 L42 22 L42 25 L50 24 Z" fill="#E62873" />
      <path d="M50 20 L76 20" strokeWidth="2.2" />
      <path d="M54 10 Q58 7 62 10 T70 9" strokeWidth="1.8" stroke="#FFF6E5" fill="none" />
      <circle cx="62" cy="6" r="1.8" fill="#FFF6E5" />

      {/* === SHORTS === */}
      <path d="M40 88 L80 88 L78 106 L68 106 L64 96 L56 96 L52 106 L42 106 Z" fill="#7A2BD9" />
      <path d="M48 100 L52 94 L56 100 Z" fill="#FFD23F" stroke="#1A1A1A" strokeWidth="1.6" />
      <path d="M64 102 L68 96 L72 102 Z" fill="#FF3D8A" stroke="#1A1A1A" strokeWidth="1.6" />

      {/* === BOTH LEGS PLANTED FIRMLY === */}
      <path d="M42 106 L52 106 L50 122 L40 122 Z" fill="#F2C9A0" />
      <path d="M34 118 L54 118 L56 124 L34 124 Q28 124 28 120 Z" fill="#FFD23F" />
      <path d="M36 121 L54 121" strokeWidth="2" />
      <path d="M38 122 Q46 120 54 122" strokeWidth="1.6" stroke="#FF3D8A" fill="none" />

      <path d="M68 106 L80 106 L82 122 L70 122 Z" fill="#F2C9A0" />
      <path d="M64 118 L86 118 L88 124 L66 124 Q62 124 62 120 Z" fill="#FFD23F" />
      <path d="M66 121 L86 121" strokeWidth="2" />
      <path d="M68 122 Q76 120 86 122" strokeWidth="1.6" stroke="#FF3D8A" fill="none" />

      <ellipse cx="38" cy="93" rx="4.5" ry="6" fill="#FFF6E5" />
      <path d="M34 89 L42 89" strokeWidth="2" />
    </g>
  );
}
