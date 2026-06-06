// Rad Kid — ABSEIL (rappel)
// Sitting back in the harness, legs braced straight out against the wall to the
// right (feet pointing right), brake hand low behind the hip, guide hand high on
// the rope. The belay rope ties in at the harness loop in the middle of the body.
// Faces right.

export function RadKidAbseil() {
  return (
    <g stroke="#1A1A1A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" transform="matrix(-1 0 0 1 128 0)">
      {/* mirrored to face LEFT; whole body leaned back ~ -14° around the waist */}
      <g transform="rotate(-14 60 92)">

        {/* === GUIDE ARM up to the rope (back arm) === */}
        <path d="M50 56 L40 38 L48 34 L58 54 Z" fill="#1FD5C8" />
        <circle cx="47" cy="20" r="5.5" fill="#F2C9A0" />
        <path d="M44 16 L46 12 M49 17 L51 13" strokeWidth="2" fill="none" />

        {/* === HOODIE TORSO === */}
        <path d="M44 54 Q42 80 50 92 L78 92 Q84 80 82 54 Q72 48 62 48 Q52 48 44 54 Z" fill="#1FD5C8" />
        <path d="M52 54 Q62 60 74 54" strokeWidth="2.6" fill="none" />
        <path d="M52 74 L74 74 L72 88 L54 88 Z" fill="#19B8AD" />
        <path d="M52 74 L74 74" strokeWidth="2.4" />
        <path d="M58 54 L58 66 M68 54 L68 64" strokeWidth="2" />
        <circle cx="58" cy="67" r="1.6" fill="#1A1A1A" stroke="none" />
        <circle cx="68" cy="65" r="1.6" fill="#1A1A1A" stroke="none" />

        {/* === HARNESS belt + belay loop (the rope ties in here, mid-body) === */}
        <path d="M48 90 L80 90" strokeWidth="4.4" stroke="#5E2BB0" />
        <ellipse cx="64" cy="95" rx="4" ry="5.2" fill="none" strokeWidth="2.6" />

        {/* === BRAKE ARM low behind the hip, gripping the rope === */}
        <path d="M74 68 L90 84 L84 92 L68 76 Z" fill="#1FD5C8" />
        <circle cx="84" cy="94" r="5.5" fill="#F2C9A0" />
        <path d="M81 98 L85 96 M86 92 L89 91" strokeWidth="2" fill="none" />

        {/* === HEAD (facing right, looking down the rope) === */}
        <path d="M52 24 Q50 40 58 46 Q70 46 76 38 Q78 30 76 22 Q70 14 60 16 Q54 18 52 24 Z" fill="#F2C9A0" />
        <path d="M66 26 L72 25" strokeWidth="2.4" />
        <circle cx="70" cy="30" r="1.7" fill="#1A1A1A" stroke="none" />
        <path d="M64 40 L72 40" strokeWidth="2.2" />

        {/* === BACKWARDS SNAPBACK === */}
        <path d="M50 20 Q48 6 62 4 Q76 4 78 16 L78 22 L52 22 Z" fill="#FF3D8A" />
        <path d="M50 20 L42 24 L42 27 L52 26 Z" fill="#E62873" />
        <path d="M52 20 L78 20" strokeWidth="2.2" />
        <circle cx="64" cy="6" r="1.8" fill="#FFF6E5" />

        {/* === SHORTS === */}
        <path d="M46 88 L82 88 L84 104 L72 104 L66 96 L60 96 L56 104 L46 104 Z" fill="#7A2BD9" />

        {/* === LEGS braced out to the wall (right), feet pointing right === */}
        {/* back leg */}
        <path d="M52 100 L92 96 L94 108 L54 112 Z" fill="#7A2BD9" />
        <path d="M88 98 L100 96 L98 108 L86 110 Z" fill="#F2C9A0" />
        <path d="M96 96 L112 94 L114 102 L96 106 Q92 104 94 100 Z" fill="#FFD23F" />
        <path d="M96 100 L112 99" strokeWidth="2" />
        {/* front leg, braced slightly higher */}
        <path d="M54 104 L94 104 L96 116 L56 118 Z" fill="#7A2BD9" />
        <path d="M90 106 L102 106 L100 118 L88 118 Z" fill="#F2C9A0" />
        <path d="M98 106 L114 106 L116 114 L98 118 Q94 116 96 112 Z" fill="#FFD23F" />
        <path d="M98 110 L114 110" strokeWidth="2" />
      </g>
    </g>
  );
}
