/**
 * HeroBg.jsx
 *
 * Full-bleed editorial hero background — recreated from the supplied reference image.
 *
 * Composition:
 *   • Warm off-white / cream background with soft gradient depth
 *   • Diagonal window-light rays from the top-right
 *   • Oversized ZEVRA wordmark centred behind the model
 *   • Male model — white overshirt, dark navy trousers, hands in pockets
 *   • Clothing rack (left) with hanging garments
 *   • Tropical plant (right) in a white pot
 *
 * Replace with a real photograph by setting HERO_ASSETS.bgSrc in config/brand.js
 */

export default function HeroBg({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 720"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Background gradient — slightly warmer at the bottom */}
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#EDEAE3"/>
          <stop offset="100%" stopColor="#E4E0D8"/>
        </linearGradient>

        {/* Window light rays — soft diagonal from top-right */}
        <linearGradient id="rayGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#F5F0E8" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#F5F0E8" stopOpacity="0"/>
        </linearGradient>

        {/* Soft vignette on the left edge */}
        <linearGradient id="vigLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#D8D4CC" stopOpacity="0.35"/>
          <stop offset="30%"  stopColor="#D8D4CC" stopOpacity="0"/>
        </linearGradient>

        {/* Floor shadow */}
        <radialGradient id="floorShadow" cx="50%" cy="100%" rx="45%" ry="8%">
          <stop offset="0%"   stopColor="#1A1610" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#1A1610" stopOpacity="0"/>
        </radialGradient>

        {/* Model body soft shadow */}
        <radialGradient id="modelShadow" cx="50%" cy="100%" rx="30%" ry="6%">
          <stop offset="0%"   stopColor="#1A1610" stopOpacity="0.14"/>
          <stop offset="100%" stopColor="#1A1610" stopOpacity="0"/>
        </radialGradient>

        {/* Plant pot shadow */}
        <radialGradient id="potShadow" cx="50%" cy="100%" rx="40%" ry="18%">
          <stop offset="0%"   stopColor="#1A1610" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#1A1610" stopOpacity="0"/>
        </radialGradient>

        {/* Shirt fabric texture gradient */}
        <linearGradient id="shirtGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#F0EDE8"/>
        </linearGradient>

        {/* Trouser gradient */}
        <linearGradient id="trouserGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2A2E3A"/>
          <stop offset="100%" stopColor="#1E2230"/>
        </linearGradient>
      </defs>

      {/* ── Background ───────────────────────────────────── */}
      <rect width="1440" height="720" fill="url(#bgGrad)"/>

      {/* Window light — two soft diagonal shafts from top-right */}
      <polygon points="940,0 1040,0 1440,460 1440,540" fill="url(#rayGrad)" opacity="0.4"/>
      <polygon points="1080,0 1160,0 1440,340 1440,420" fill="url(#rayGrad)" opacity="0.3"/>
      <polygon points="1180,0 1240,0 1440,200 1440,260" fill="url(#rayGrad)" opacity="0.2"/>

      {/* Vignette */}
      <rect width="1440" height="720" fill="url(#vigLeft)"/>

      {/* Floor shadow */}
      <ellipse cx="720" cy="715" rx="680" ry="40" fill="url(#floorShadow)"/>

      {/* ── ZEVRA Wordmark — large serif, centred behind model ── */}
      {/*
        Font: high-contrast display serif — thin horizontals, thick verticals.
        Rendered as SVG paths to match the reference exactly.
        The wordmark spans roughly 70% of the viewport width.
      */}
      <text
        x="720"
        y="420"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', 'Georgia', serif"
        fontSize="330"
        fontWeight="600"
        letterSpacing="12"
        fill="#1A1814"
        opacity="0.88"
        style={{ userSelect: 'none' }}
      >
        ZEVRA
      </text>


      {/* ── Clothing Rack (left) ─────────────────────────── */}
      {/* Vertical pole */}
      <rect x="142" y="110" width="7" height="490" rx="3.5" fill="#2A2420"/>
      {/* Base cross-bar */}
      <rect x="90"  y="594" width="111" height="6" rx="3" fill="#2A2420"/>
      {/* Base feet */}
      <rect x="90"  y="594" width="32" height="5" rx="2" fill="#2A2420" transform="rotate(-8,106,597)"/>
      <rect x="169" y="594" width="32" height="5" rx="2" fill="#2A2420" transform="rotate(8,185,597)"/>
      {/* Top cross-bar (horizontal rail) */}
      <rect x="64"  y="110" width="163" height="7" rx="3.5" fill="#2A2420"/>
      {/* Top finial */}
      <circle cx="146" cy="110" r="8" fill="#2A2420"/>

      {/* Hanging garments — 4 items on S-hooks */}
      {/* Hook curves */}
      {[82, 108, 136, 164, 190].map((x, i) => (
        <path
          key={i}
          d={`M${x} 117 Q${x} 105 ${x+6} 105 Q${x+12} 105 ${x+12} 114`}
          stroke="#3A3430"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      ))}

      {/* Garment 1 — white shirt, leftmost */}
      <g transform="translate(64, 117)">
        <path d="M10 0 L0 14 L7 19 L13 12 L13 120 L37 120 L37 12 L43 19 L50 14 L40 0 L33 5 Q25 9 17 5 Z"
              fill="#F5F3EE" stroke="#E0DDD6" strokeWidth="1"/>
        <line x1="25" y1="5" x2="25" y2="120" stroke="#E8E5DE" strokeWidth="0.75"/>
      </g>

      {/* Garment 2 — olive/sage tee */}
      <g transform="translate(100, 117)">
        <path d="M10 0 L0 13 L8 17 L14 11 L14 105 L34 105 L34 11 L40 17 L48 13 L38 0 L32 5 Q24 9 16 5 Z"
              fill="#7A8068" stroke="#6A7058" strokeWidth="1"/>
      </g>

      {/* Garment 3 — dark charcoal shirt */}
      <g transform="translate(136, 117)">
        <path d="M10 0 L0 14 L7 19 L13 12 L13 125 L35 125 L35 12 L41 19 L48 14 L38 0 L32 5 Q24 9 16 5 Z"
              fill="#2C2A28" stroke="#1E1C1A" strokeWidth="1"/>
        <line x1="24" y1="5" x2="24" y2="125" stroke="#363430" strokeWidth="0.75"/>
      </g>

      {/* Garment 4 — light grey */}
      <g transform="translate(170, 117)">
        <path d="M10 0 L0 13 L8 17 L13 11 L13 108 L33 108 L33 11 L38 17 L46 13 L36 0 L30 5 Q22 9 14 5 Z"
              fill="#D0CEC8" stroke="#C0BEB8" strokeWidth="1"/>
      </g>


      {/* ── Male Model (centre) ──────────────────────────── */}
      <g transform="translate(556, 80)">

        {/* ── Shoes ── */}
        <ellipse cx="105" cy="634" rx="42" ry="11" fill="#1A1814" opacity="0.9"/>
        <ellipse cx="175" cy="636" rx="38" ry="10" fill="#1A1814" opacity="0.9"/>
        {/* Left shoe detail */}
        <path d="M66 630 Q86 624 130 628 L128 638 Q100 642 66 638 Z" fill="#141210"/>
        {/* Right shoe detail */}
        <path d="M140 632 Q162 626 210 630 L208 640 Q178 644 140 640 Z" fill="#141210"/>

        {/* ── Trousers ── */}
        {/* Left leg */}
        <path d="M84 330 L72 634 L140 634 L142 420 Z" fill="url(#trouserGrad)"/>
        {/* Right leg */}
        <path d="M196 330 L210 636 L146 636 L144 420 Z" fill="#222638"/>
        {/* Crotch join */}
        <path d="M84 330 L140 385 L144 385 L196 330 Z" fill="#1E2230"/>
        {/* Waistband */}
        <rect x="80" y="318" width="120" height="18" rx="3" fill="#181C28"/>
        {/* Belt */}
        <rect x="80" y="310" width="120" height="12" rx="2" fill="#1A1814"/>
        {/* Belt buckle */}
        <rect x="131" y="308" width="18" height="16" rx="2" fill="#5C4E38"/>
        <rect x="134" y="311" width="12" height="10" rx="1.5" fill="#8A7458"/>
        {/* Trouser crease lines */}
        <line x1="108" y1="420" x2="96"  y2="632" stroke="#303648" strokeWidth="1.5" opacity="0.6"/>
        <line x1="172" y1="420" x2="184" y2="634" stroke="#2C3242" strokeWidth="1.5" opacity="0.6"/>
        {/* Pocket openings */}
        <path d="M84 360 Q90 355 98 362" stroke="#2E3444" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M196 360 Q190 355 182 362" stroke="#2E3444" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Hands in pockets — slight fist shapes */}
        <ellipse cx="84"  cy="390" rx="14" ry="16" fill="#C8A07A" opacity="0.85"/>
        <ellipse cx="196" cy="390" rx="13" ry="15" fill="#C8A07A" opacity="0.85"/>

        {/* ── White Tee underneath (visible at neck) ── */}
        <path d="M124 220 Q140 226 156 220 Q154 210 140 212 Q126 210 124 220 Z" fill="#FAFAF8" stroke="#EEEAE4" strokeWidth="0.5"/>

        {/* ── Overshirt (white / off-white) ── */}
        {/* Main body */}
        <path d="M88 200 L60 178 L32 220 L54 256 L88 242 L88 318 L192 318 L192 242 L226 256 L248 220 L220 178 L192 200"
              fill="url(#shirtGrad)" stroke="#E0DDD6" strokeWidth="1.5"/>
        {/* Left front panel */}
        <path d="M88 200 L88 318 L138 318 L138 220 L110 210 Z" fill="#FAFAF6" stroke="#E4E0DA" strokeWidth="0.75"/>
        {/* Right front panel */}
        <path d="M192 200 L192 318 L142 318 L142 220 L170 210 Z" fill="#F5F2EC" stroke="#E0DDD6" strokeWidth="0.75"/>
        {/* Collar — spread */}
        <path d="M112 200 L140 226 L168 200 L162 180 L140 200 L118 180 Z" fill="#F0EDE6" stroke="#DDDAD2" strokeWidth="1"/>
        {/* Button placket */}
        <line x1="140" y1="226" x2="140" y2="317" stroke="#E0DDD6" strokeWidth="1.5"/>
        <circle cx="140" cy="242" r="3"   fill="none" stroke="#D8D5CE" strokeWidth="1"/>
        <circle cx="140" cy="264" r="3"   fill="none" stroke="#D8D5CE" strokeWidth="1"/>
        <circle cx="140" cy="286" r="3"   fill="none" stroke="#D8D5CE" strokeWidth="1"/>
        {/* Chest pocket */}
        <rect x="100" y="240" width="26" height="28" rx="1" fill="none" stroke="#DEDAD2" strokeWidth="1"/>
        <line x1="100" y1="256" x2="126" y2="256" stroke="#DEDAD2" strokeWidth="0.75"/>
        {/* Left sleeve */}
        <path d="M88 242 L54 256 L38 350 L64 358 L85 268" fill="url(#shirtGrad)" stroke="#E0DDD6" strokeWidth="1.5"/>
        {/* Right sleeve */}
        <path d="M192 242 L226 256 L242 350 L216 358 L195 268" fill="#F5F2EC" stroke="#E0DDD6" strokeWidth="1.5"/>
        {/* Left cuff */}
        <rect x="36" y="350" width="52" height="14" rx="3" fill="#EEEAE2" stroke="#D8D5CE" strokeWidth="1"/>
        {/* Right cuff */}
        <rect x="192" y="350" width="52" height="14" rx="3" fill="#EEEAE2" stroke="#D8D5CE" strokeWidth="1"/>
        {/* Watch on left wrist */}
        <rect x="50"  y="352" width="22" height="10" rx="2" fill="#2A2420"/>
        <rect x="53"  y="354" width="16" height="6"  rx="1" fill="#3A3430"/>
        {/* Shirt hem — slight curve */}
        <path d="M88 315 Q114 324 140 321 Q166 324 192 315" stroke="#E0DDD6" strokeWidth="1.5" fill="none"/>
        {/* Shoulder seams */}
        <line x1="112" y1="200" x2="88"  y2="250" stroke="#DEDAD2" strokeWidth="1"/>
        <line x1="168" y1="200" x2="192" y2="250" stroke="#DEDAD2" strokeWidth="1"/>

        {/* ── Neck ── */}
        <rect x="126" y="148" width="28" height="42" rx="10" fill="#C8A07A"/>
        {/* Adam's apple */}
        <ellipse cx="140" cy="166" rx="5" ry="4" fill="#BC9870" opacity="0.5"/>

        {/* ── Head ── */}
        <ellipse cx="140" cy="108" rx="44" ry="50" fill="#C8A07A"/>
        {/* Ear left */}
        <ellipse cx="96"  cy="112" rx="9" ry="11" fill="#BC9870"/>
        <path d="M99 106 Q97 112 99 118" stroke="#B08A68" strokeWidth="1" fill="none"/>
        {/* Ear right */}
        <ellipse cx="184" cy="112" rx="9" ry="11" fill="#BC9870"/>

        {/* ── Hair — short, dark, neat ── */}
        <path d="M97 88 Q96 52 140 46 Q184 52 183 88
                 Q180 68 174 62 Q168 70 158 68 Q148 72 140 70
                 Q132 72 122 68 Q112 70 106 62
                 Q100 68 97 88 Z"
              fill="#1A1410"/>
        {/* Side hair line */}
        <path d="M97 88 Q96 96 100 104" stroke="#1A1410" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M183 88 Q184 96 180 104" stroke="#1A1410" strokeWidth="5" fill="none" strokeLinecap="round"/>
        {/* Top hair texture */}
        <path d="M120 52 Q130 48 140 48 Q150 48 160 52" stroke="#2A2018" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

        {/* ── Face ── */}
        {/* Eyebrows */}
        <path d="M114 96 Q122 90 130 93" stroke="#2A1E14" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M150 93 Q158 90 166 96" stroke="#2A1E14" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Eyes */}
        <ellipse cx="122" cy="106" rx="8"   ry="7"   fill="#1A1410"/>
        <ellipse cx="158" cy="106" rx="8"   ry="7"   fill="#1A1410"/>
        <ellipse cx="158" cy="106" rx="7.5" ry="6.5" fill="#2C2018"/>
        <ellipse cx="122" cy="106" rx="7.5" ry="6.5" fill="#2C2018"/>
        {/* Iris */}
        <ellipse cx="122" cy="107" rx="5"   ry="5"   fill="#4A3420"/>
        <ellipse cx="158" cy="107" rx="5"   ry="5"   fill="#4A3420"/>
        {/* Pupil */}
        <circle  cx="122" cy="107" r="3"   fill="#0A0806"/>
        <circle  cx="158" cy="107" r="3"   fill="#0A0806"/>
        {/* Eye shine */}
        <circle  cx="124" cy="105" r="1.5" fill="white" opacity="0.7"/>
        <circle  cx="160" cy="105" r="1.5" fill="white" opacity="0.7"/>
        {/* Lower eyelid */}
        <path d="M115 110 Q122 114 129 110" stroke="#B89070" strokeWidth="0.75" fill="none"/>
        <path d="M151 110 Q158 114 165 110" stroke="#B89070" strokeWidth="0.75" fill="none"/>
        {/* Nose */}
        <path d="M136 116 Q138 122 140 124 Q142 122 144 116" stroke="#B08868" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <ellipse cx="135" cy="124" rx="5" ry="3" fill="#B89070" opacity="0.35"/>
        <ellipse cx="145" cy="124" rx="5" ry="3" fill="#B89070" opacity="0.35"/>
        {/* Mouth — slight smile */}
        <path d="M126 136 Q134 143 140 142 Q146 143 154 136" stroke="#A07050" strokeWidth="1.75" fill="none" strokeLinecap="round"/>
        <path d="M126 136 Q128 132 132 134" stroke="#A07050" strokeWidth="1" fill="none" strokeLinecap="round"/>
        {/* Cheek warmth */}
        <ellipse cx="110" cy="122" rx="12" ry="8" fill="#D49070" opacity="0.18"/>
        <ellipse cx="170" cy="122" rx="12" ry="8" fill="#D49070" opacity="0.18"/>
        {/* Jawline definition */}
        <path d="M98 130 Q106 154 140 162 Q174 154 182 130" stroke="#B89070" strokeWidth="1" fill="none" opacity="0.4"/>

        {/* ── Model floor shadow ── */}
        <ellipse cx="140" cy="638" rx="90" ry="10" fill="url(#modelShadow)"/>
      </g>


      {/* ── Tropical Plant (right) ───────────────────────── */}
      <g transform="translate(1130, 220)">
        {/* Pot */}
        <path d="M55 430 L42 500 L118 500 L105 430 Z" fill="#F0EDE6" stroke="#E0DDD6" strokeWidth="1.5"/>
        <rect x="38" y="424" width="84" height="12" rx="3" fill="#E8E4DC"/>
        {/* Soil */}
        <ellipse cx="80" cy="430" rx="42" ry="7" fill="#4A3C2E" opacity="0.7"/>
        {/* Pot shadow */}
        <ellipse cx="80" cy="502" rx="46" ry="8" fill="url(#potShadow)"/>

        {/* Main stems */}
        <path d="M80 424 Q78 360 82 290 Q85 230 78 170" stroke="#4A5C38" strokeWidth="7" fill="none" strokeLinecap="round"/>
        <path d="M80 400 Q55 340 35 260" stroke="#4A5C38" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M80 380 Q108 310 125 230" stroke="#4A5C38" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M80 350 Q42 300 20 220" stroke="#4A5C38" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M80 360 Q118 300 148 215" stroke="#4A5C38" strokeWidth="4" fill="none" strokeLinecap="round"/>

        {/* Large leaves — bird of paradise style */}
        {/* Leaf 1 — arching left */}
        <path d="M35 260 Q-10 180 -40 120 Q-20 150 10 170 Q5 140 35 260"
              fill="#3A5830" stroke="#2A4820" strokeWidth="1" opacity="0.95"/>
        <line x1="35"  y1="260" x2="-20" y2="130" stroke="#2A4820" strokeWidth="1.5" opacity="0.6"/>

        {/* Leaf 2 — centre upward */}
        <path d="M78 170 Q55 90 40 20 Q60 60 68 100 Q56 70 78 170"
              fill="#3E6034" stroke="#2E5024" strokeWidth="1" opacity="0.9"/>
        <line x1="78"  y1="170" x2="54"  y2="30"  stroke="#2E5024" strokeWidth="1.5" opacity="0.6"/>

        {/* Leaf 3 — arching right */}
        <path d="M125 230 Q170 155 195 90 Q175 130 152 158 Q168 128 125 230"
              fill="#3A5830" stroke="#2A4820" strokeWidth="1" opacity="0.9"/>
        <line x1="125" y1="230" x2="185" y2="95"  stroke="#2A4820" strokeWidth="1.5" opacity="0.6"/>

        {/* Leaf 4 — left sweep */}
        <path d="M20 220 Q-30 165 -60 110 Q-35 145 -5 162 Q-25 138 20 220"
              fill="#446638" stroke="#345828" strokeWidth="1" opacity="0.88"/>
        <line x1="20"  y1="220" x2="-48" y2="115" stroke="#345828" strokeWidth="1.5" opacity="0.55"/>

        {/* Leaf 5 — right sweep */}
        <path d="M148 215 Q188 148 210 88 Q192 125 165 148 Q182 118 148 215"
              fill="#3E6034" stroke="#2E5024" strokeWidth="1" opacity="0.88"/>
        <line x1="148" y1="215" x2="202" y2="92"  stroke="#2E5024" strokeWidth="1.5" opacity="0.55"/>

        {/* Leaf 6 — centre tall */}
        <path d="M82 290 Q60 210 52 140 Q68 180 74 210 Q64 178 82 290"
              fill="#4A6840" stroke="#3A5830" strokeWidth="1" opacity="0.85"/>
        <line x1="82"  y1="290" x2="58"  y2="145" stroke="#3A5830" strokeWidth="1.5" opacity="0.5"/>

        {/* Shadow on wall — soft diagonal */}
        <path d="M148 215 Q220 140 280 60" stroke="#B8B4AC" strokeWidth="18" fill="none" opacity="0.14" strokeLinecap="round"/>
        <path d="M35  260 Q-40 190 -90 100" stroke="#B8B4AC" strokeWidth="16" fill="none" opacity="0.12" strokeLinecap="round"/>
      </g>

      {/* ── Global floor line ────────────────────────────── */}
      <rect x="0" y="706" width="1440" height="14" fill="#D8D4CC" opacity="0.4"/>

    </svg>
  );
}
