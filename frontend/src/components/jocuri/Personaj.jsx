export default function Personaj({ latime = 60 }) {
  return (
    <svg viewBox="0 0 60 92" width={latime} height={(latime * 92) / 60} aria-hidden="true">
      <path d="M21 50 L13 24" stroke="#f2c29b" strokeWidth="6" strokeLinecap="round" />
      <path d="M39 50 L47 24" stroke="#f2c29b" strokeWidth="6" strokeLinecap="round" />
      <path d="M21 50 L16 36" stroke="#0e9f6e" strokeWidth="7" strokeLinecap="round" />
      <path d="M39 50 L44 36" stroke="#0e9f6e" strokeWidth="7" strokeLinecap="round" />

      <path d="M4 6 H56 L50 24 H10 Z" fill="#c68a3e" stroke="#7a4b1c" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 12 H53 M9 18 H51" stroke="#7a4b1c" strokeWidth="1.2" opacity="0.7" />
      <path d="M17 6 L19 24 M30 6 V24 M43 6 L41 24" stroke="#7a4b1c" strokeWidth="1.2" opacity="0.7" />
      <rect x="2" y="3" width="56" height="5" rx="2.5" fill="#a86e2c" stroke="#7a4b1c" strokeWidth="1.5" />
      <circle cx="13" cy="24" r="3.5" fill="#f2c29b" />
      <circle cx="47" cy="24" r="3.5" fill="#f2c29b" />

      <path d="M21 42 L16 37 L22 39 Z" fill="#f2c29b" />
      <path d="M39 42 L44 37 L38 39 Z" fill="#f2c29b" />
      <circle cx="30" cy="40" r="9" fill="#f2c29b" />
      <path d="M21 38 Q22 30 30 30 Q38 30 39 38 Q35 34 30 35 Q25 34 21 38 Z" fill="#7c4a1e" />
      <circle cx="26.5" cy="40" r="1.4" fill="#1f2937" />
      <circle cx="33.5" cy="40" r="1.4" fill="#1f2937" />
      <path d="M26 44 Q30 47.5 34 44" stroke="#1f2937" strokeWidth="1.3" fill="none" strokeLinecap="round" />

      <path d="M20 50 H40 L44 74 H16 Z" fill="#10b981" stroke="#065f46" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="17.5" y="62" width="25" height="3.5" fill="#065f46" />
      <rect x="27.5" y="61.5" width="5" height="4.5" rx="1" fill="#fbbf24" />

      <rect x="21" y="74" width="6" height="11" fill="#374151" />
      <rect x="33" y="74" width="6" height="11" fill="#374151" />
      <path d="M18 85 H28 V90 H15 Q15 86 18 85 Z" fill="#7a4b1c" />
      <path d="M42 85 H32 V90 H45 Q45 86 42 85 Z" fill="#7a4b1c" />
    </svg>
  );
}
