/**
 * HeroModel.jsx
 *
 * An editorial-style SVG illustration of a male fashion model:
 * ivory/white shirt, tailored dark trousers, clean lines.
 *
 * Used when no real photography cutout PNG is available.
 * Replace this by setting HERO_ASSETS.modelSrc in config/brand.js.
 *
 * The illustration is designed to sit on the off-white page background
 * with no frame, panel, or rectangle behind it.
 */

export default function HeroModel({ style, className }) {
  return (
    <svg
      viewBox="0 0 340 720"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* ── Head ───────────────────────────────────────────── */}
      {/* Neck */}
      <rect x="152" y="94" width="36" height="46" rx="8" fill="#D4B898"/>
      {/* Head */}
      <ellipse cx="170" cy="76" rx="40" ry="48" fill="#D4B898"/>
      {/* Hair */}
      <path d="M132 62 Q130 28 170 22 Q210 28 208 62 Q205 44 200 40 Q190 50 170 48 Q150 50 140 40 Q135 44 132 62Z" fill="#1A1410"/>
      {/* Ears */}
      <ellipse cx="130" cy="78" rx="8" ry="10" fill="#C8A882"/>
      <ellipse cx="210" cy="78" rx="8" ry="10" fill="#C8A882"/>
      {/* Face details */}
      <ellipse cx="156" cy="82" rx="5" ry="6" fill="#B89070" opacity="0.6"/>
      <ellipse cx="184" cy="82" rx="5" ry="6" fill="#B89070" opacity="0.6"/>
      <path d="M160 96 Q170 102 180 96" stroke="#C09070" strokeWidth="1.5" fill="none"/>

      {/* ── Shirt (ivory) ──────────────────────────────────── */}
      {/* Main shirt body */}
      <path d="M105 140 L72 118 L38 168 L62 205 L105 192 L105 400 L235 400 L235 192 L278 205 L302 168 L268 118 L235 140" fill="#F5F3EE" stroke="#DDD9D0" strokeWidth="1.5"/>
      {/* Collar */}
      <path d="M130 140 L170 162 L210 140 L205 122 L170 142 L135 122 Z" fill="#EEEAE2" stroke="#D5D1C8" strokeWidth="1"/>
      {/* Button placket */}
      <line x1="170" y1="162" x2="170" y2="399" stroke="#DDD9D0" strokeWidth="1.5"/>
      <circle cx="170" cy="180" r="3" fill="#D0CDC6"/>
      <circle cx="170" cy="208" r="3" fill="#D0CDC6"/>
      <circle cx="170" cy="236" r="3" fill="#D0CDC6"/>
      <circle cx="170" cy="264" r="3" fill="#D0CDC6"/>
      <circle cx="170" cy="292" r="3" fill="#D0CDC6"/>
      <circle cx="170" cy="320" r="3" fill="#D0CDC6"/>
      {/* Shoulder seams */}
      <line x1="130" y1="140" x2="105" y2="200" stroke="#DDD9D0" strokeWidth="1"/>
      <line x1="210" y1="140" x2="235" y2="200" stroke="#DDD9D0" strokeWidth="1"/>
      {/* Left sleeve */}
      <path d="M105 192 L62 205 L40 320 L70 330 L95 225" fill="#F5F3EE" stroke="#DDD9D0" strokeWidth="1.5"/>
      {/* Right sleeve */}
      <path d="M235 192 L278 205 L300 320 L270 330 L245 225" fill="#F5F3EE" stroke="#DDD9D0" strokeWidth="1.5"/>
      {/* Cuffs */}
      <rect x="40" y="320" width="50" height="16" rx="3" fill="#EEEBE3" stroke="#D5D1C8" strokeWidth="1"/>
      <rect x="250" y="320" width="50" height="16" rx="3" fill="#EEEBE3" stroke="#D5D1C8" strokeWidth="1"/>
      {/* Shirt hem tucked into trousers */}
      <path d="M105 395 Q140 406 170 403 Q200 406 235 395" stroke="#DDD9D0" strokeWidth="1.5" fill="none"/>

      {/* ── Belt ───────────────────────────────────────────── */}
      <rect x="105" y="397" width="130" height="12" rx="2" fill="#2A2420"/>
      <rect x="164" y="396" width="12" height="14" rx="1" fill="#8A7060"/>
      <rect x="167" y="399" width="6" height="8" rx="0.5" fill="#C0A888"/>

      {/* ── Trousers (dark charcoal) ───────────────────────── */}
      {/* Waistband */}
      <rect x="105" y="408" width="130" height="22" rx="2" fill="#2C2C2C" stroke="#202020" strokeWidth="1.5"/>
      {/* Trouser body */}
      <path d="M105 430 L100 600 L148 600 L165 720 L175 720 L175 600 L175 600 L175 720 L165 720 L165 600 L175 600 L175 720 L184 720 L200 600 L240 600 L235 430Z" fill="#323232" stroke="#242424" strokeWidth="1.5"/>
      {/* Restate legs clearly */}
      <path d="M105 430 L100 600 L148 600 L165 720 L175 720 L175 600" fill="#323232"/>
      <path d="M235 430 L240 600 L192 600 L175 720 L175 600" fill="#2E2E2E"/>
      {/* Trouser crease */}
      <line x1="148" y1="600" x2="162" y2="720" stroke="#404040" strokeWidth="1.5"/>
      <line x1="192" y1="600" x2="178" y2="720" stroke="#3C3C3C" strokeWidth="1.5"/>
      {/* Knee area */}
      <path d="M102 540 Q103 545 108 542" stroke="#3A3A3A" strokeWidth="1" fill="none"/>
      <path d="M232 540 Q231 545 226 542" stroke="#3A3A3A" strokeWidth="1" fill="none"/>
      {/* Fly */}
      <path d="M175 430 L175 500 Q171 512 166 500 L164 430" fill="#2E2E2E" stroke="#222" strokeWidth="1"/>
      {/* Side seam subtle */}
      <line x1="105" y1="430" x2="100" y2="600" stroke="#404040" strokeWidth="0.75"/>
      <line x1="235" y1="430" x2="240" y2="600" stroke="#404040" strokeWidth="0.75"/>
      {/* Hem */}
      <line x1="148" y1="713" x2="148" y2="720" stroke="#242424" strokeWidth="3"/>
      <line x1="202" y1="713" x2="202" y2="720" stroke="#242424" strokeWidth="3"/>

      {/* ── Shoes (dark leather) ───────────────────────────── */}
      <ellipse cx="155" cy="722" rx="28" ry="8" fill="#1A1A1A"/>
      <ellipse cx="188" cy="722" rx="28" ry="8" fill="#1A1A1A"/>
    </svg>
  );
}
