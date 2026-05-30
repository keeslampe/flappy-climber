// Rad Kid — Frame 05: FALL
// Body tilted/tumbling. Arms out flailing, legs scrambling, hat flying off.
// Eyes wide, O-mouth.

export function RadKidFall() {
  return (
    <>
    {/* Hat tumbling above (free-floating, separate from body rotation) */}
    <g stroke="#1A1A1A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(96 22) rotate(-35) scale(0.78)">
        <path d="M-14 0 Q-16 -10 -2 -12 Q12 -10 14 0 L14 4 L-12 4 Z" fill="#FF3D8A" />
        <path d="M-14 1 L-20 4 L-20 7 L-12 6 Z" fill="#E62873" />
        <path d="M-12 2 L14 2" strokeWidth="2.2" />
        <circle cx="0" cy="-10" r="1.8" fill="#FFF6E5" />
      </g>

      {/* motion swoosh from top-right showing where Rad Kid came from */}
      <path d="M118 4 Q104 18 90 26" strokeWidth="2.4" stroke="#FFD23F" strokeDasharray="3 4" fill="none" />
      <path d="M124 12 Q108 22 96 30" strokeWidth="2" stroke="#FF3D8A" strokeDasharray="3 4" fill="none" />

      {/* === BODY tilted -18° around center, scaled 0.85 to stay in canvas === */}
      <g transform="translate(64 70) rotate(-18) scale(0.85) translate(-64 -70)">

        {/* Right arm flailing up-right */}
        <path d="M44 60 L26 42 L18 30" fill="#F2C9A0" stroke="none" />
        <path d="M42 58 L26 42 L20 32 L36 54 Z" fill="#1FD5C8" />
        <g transform="translate(16 28)">
          <circle cx="0" cy="0" r="5.5" fill="#F2C9A0" />
          <path d="M-3 -4 L-1 -8 M1 -5 L3 -9 M5 -4 L7 -8" strokeWidth="2" fill="none" />
        </g>

        {/* Left arm flailing up-left direction (opposite, also out) */}
        <path d="M76 60 L94 50 L108 50" fill="#F2C9A0" stroke="none" />
        <path d="M74 58 L92 48 L98 56 L80 64 Z" fill="#1FD5C8" />
        <g transform="translate(108 48)">
          <circle cx="0" cy="0" r="5.5" fill="#F2C9A0" />
          <path d="M3 -4 L7 -4 M2 0 L6 0 M3 4 L7 4" strokeWidth="2" fill="none" />
        </g>

        {/* Hoodie torso */}
        <path d="M42 60 Q40 86 46 100 L74 100 Q80 86 78 60 Q68 54 60 54 Q50 54 42 60 Z" fill="#1FD5C8" />
        <path d="M48 60 Q60 66 72 60" strokeWidth="2.6" fill="none" />
        <path d="M48 82 L70 82 L68 96 L50 96 Z" fill="#19B8AD" />
        <path d="M48 82 L70 82" strokeWidth="2.4" />
        <path d="M52 60 L52 72 M66 60 L66 70" strokeWidth="2" />
        <circle cx="52" cy="73" r="1.6" fill="#1A1A1A" stroke="none" />
        <circle cx="66" cy="71" r="1.6" fill="#1A1A1A" stroke="none" />
        <path d="M52 68 Q56 64 60 68 T68 68" strokeWidth="2.2" stroke="#FF3D8A" fill="none" />

        {/* Head — hat-free, hair messy */}
        <path d="M50 32 Q48 48 54 54 Q66 56 70 48 Q72 42 70 32 Q66 22 60 22 Q54 22 50 32 Z" fill="#F2C9A0" />
        <path d="M54 40 Q52 42 53 46 Q56 46 56 43 Z" fill="#F2C9A0" />
        {/* hair tufts (now visible without hat) */}
        <path d="M52 22 L50 16 L54 22 L56 14 L60 22 L64 14 L66 22 L70 18 L70 26" strokeWidth="2" fill="#3A1E5C" />
        {/* shocked eye */}
        <circle cx="64" cy="38" r="3" fill="#FFF6E5" stroke="#1A1A1A" strokeWidth="2" />
        <circle cx="64" cy="38" r="1.4" fill="#1A1A1A" stroke="none" />
        {/* sweat drop */}
        <path d="M48 38 Q46 42 48 44 Q50 44 50 42 Z" fill="#1FD5C8" />
        {/* O-mouth */}
        <ellipse cx="64" cy="48" rx="3" ry="3.5" fill="#1A1A1A" />

        {/* Shorts */}
        <path d="M42 96 L78 96 L76 114 L66 114 L62 104 L58 104 L54 114 L42 114 Z" fill="#7A2BD9" />
        <path d="M48 106 L52 100 L56 106 Z" fill="#FFD23F" stroke="#1A1A1A" strokeWidth="1.6" />

        {/* Legs scrambling — right kicks out, left bent up */}
        <path d="M42 114 L52 114 L60 124 L46 126 Z" fill="#F2C9A0" />
        <path d="M40 122 L62 120 L64 128 L42 130 Q36 130 36 126 Z" fill="#FFD23F" />
        <path d="M42 125 L62 124" strokeWidth="2" />

        <path d="M64 114 L76 114 L80 122 L68 124 Z" fill="#F2C9A0" />
        <path d="M64 120 L84 118 L86 126 L66 128 Q62 128 62 124 Z" fill="#FFD23F" />
        <path d="M66 123 L84 122" strokeWidth="2" />

        <ellipse cx="38" cy="98" rx="4.5" ry="6" fill="#FFF6E5" />
      </g>
    </g>
    </>
  );
}
