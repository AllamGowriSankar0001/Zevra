/**
 * HeroScene.jsx
 *
 * Full-width SVG lifestyle scene for the ZEVRA hero.
 * Modelled after the Clare.co hero pattern:
 *   - Wide background-coloured stage (matches hero bg)
 *   - Male model / lifestyle elements anchored to the bottom
 *   - Scene spans the full hero width edge-to-edge
 *   - No rectangular image frame or white box
 *
 * Replace by setting HERO_ASSETS.modelSrc in config/brand.js
 */

export default function HeroScene() {
  return (
    <svg
      viewBox="0 0 1440 420"
      preserveAspectRatio="xMidYMax meet"
      xmlns="http://www.w3.org/2000/svg"
      className="hero__scene-svg"
      aria-hidden="true"
    >

      {/* ─────────────────────────────────────────────────────
          DECORATIVE LEFT — clothing rail / wardrobe element
      ───────────────────────────────────────────────────── */}

      {/* Tall rail pole */}
      <rect x="68" y="60" width="6" height="300" rx="3" fill="#3A3530"/>
      {/* Horizontal bar */}
      <rect x="30" y="56" width="120" height="5" rx="2.5" fill="#3A3530"/>
      {/* Hanging clothes — simplified silhouettes */}

      {/* Garment 1 — shirt */}
      <g transform="translate(40, 62)">
        <path d="M12 0 L0 16 L8 22 L14 14 L14 68 L32 68 L32 14 L38 22 L46 16 L34 0 L28 6 Q23 10 18 6 Z"
              fill="#E8E4DC" stroke="#D0CCC4" strokeWidth="1"/>
        <line x1="23" y1="6" x2="23" y2="68" stroke="#D0CCC4" strokeWidth="0.75"/>
      </g>

      {/* Garment 2 — darker shirt */}
      <g transform="translate(92, 62)">
        <path d="M12 0 L0 16 L8 22 L14 14 L14 72 L30 72 L30 14 L36 22 L44 16 L32 0 L26 6 Q21 10 16 6 Z"
              fill="#4A4540" stroke="#3A3530" strokeWidth="1"/>
        <line x1="21" y1="6" x2="21" y2="72" stroke="#3A3530" strokeWidth="0.75"/>
      </g>

      {/* Garment 3 — trousers */}
      <g transform="translate(140, 62)">
        <rect x="4" y="0" width="26" height="8" rx="2" fill="#2C2828"/>
        <path d="M4 8 L0 90 L12 90 L17 50 L22 90 L34 90 L30 8 Z" fill="#363030" stroke="#2C2828" strokeWidth="0.75"/>
      </g>

      {/* ─────────────────────────────────────────────────────
          LEFT ACCENT — folded garments on stool
      ───────────────────────────────────────────────────── */}
      {/* Stool legs */}
      <line x1="200" y1="360" x2="190" y2="418" stroke="#3A3530" strokeWidth="4" strokeLinecap="round"/>
      <line x1="240" y1="360" x2="250" y2="418" stroke="#3A3530" strokeWidth="4" strokeLinecap="round"/>
      <line x1="200" y1="380" x2="240" y2="380" stroke="#3A3530" strokeWidth="3" strokeLinecap="round"/>
      {/* Stool seat */}
      <rect x="182" y="348" width="76" height="14" rx="4" fill="#4A4038"/>
      {/* Folded shirt on stool */}
      <rect x="190" y="320" width="60" height="30" rx="3" fill="#D8D0C4"/>
      <rect x="194" y="316" width="52" height="8" rx="2" fill="#E4DCD0"/>
      {/* Small fold line */}
      <line x1="190" y1="332" x2="250" y2="332" stroke="#C8C0B4" strokeWidth="0.75"/>


      {/* ─────────────────────────────────────────────────────
          CENTRE-LEFT — main standing male model
      ───────────────────────────────────────────────────── */}
      <g transform="translate(530, 20)">

        {/* Shoes */}
        <ellipse cx="88" cy="396" rx="34" ry="10" fill="#1E1A18"/>
        <ellipse cx="148" cy="396" rx="32" ry="9" fill="#201C1A"/>

        {/* Trousers */}
        {/* Left leg */}
        <path d="M70 240 L60 396 L116 396 L118 280 Z" fill="#2C2A28"/>
        {/* Right leg */}
        <path d="M168 240 L178 396 L124 396 L122 280 Z" fill="#302C2A"/>
        {/* Crotch */}
        <path d="M70 240 L118 280 L122 280 L168 240 Z" fill="#282624"/>
        {/* Waistband */}
        <rect x="66" y="228" width="106" height="18" rx="3" fill="#201E1C"/>
        {/* Crease lines */}
        <line x1="88" y1="280" x2="82" y2="394" stroke="#3A3836" strokeWidth="1.5"/>
        <line x1="148" y1="280" x2="154" y2="394" stroke="#383432" strokeWidth="1.5"/>
        {/* Belt */}
        <rect x="66" y="224" width="106" height="10" rx="2" fill="#1A1614"/>
        <rect x="113" y="222" width="14" height="14" rx="1.5" fill="#6A5A48"/>
        <rect x="116" y="225" width="8" height="8" rx="1" fill="#C0A880"/>

        {/* Shirt body */}
        <path d="M80 130 L52 110 L24 150 L46 180 L78 168 L78 232 L160 232 L160 168 L192 180 L214 150 L186 110 L158 130"
              fill="#F4F0E8" stroke="#DDD8CE" strokeWidth="1.5"/>
        {/* Collar */}
        <path d="M104 130 L119 150 L118 128 L114 116 Z" fill="#EAE6DC" stroke="#D0CBC2" strokeWidth="1"/>
        <path d="M134 130 L119 150 L120 128 L124 116 Z" fill="#EAE6DC" stroke="#D0CBC2" strokeWidth="1"/>
        {/* Collar band */}
        <path d="M104 130 Q119 144 134 130 Q127 116 119 118 Q111 116 104 130 Z" fill="#DEDAD2" stroke="#C8C4BB" strokeWidth="1"/>
        {/* Button placket */}
        <line x1="119" y1="150" x2="119" y2="231" stroke="#DDD8CE" strokeWidth="1.5"/>
        <circle cx="119" cy="166" r="2.5" fill="#CCCABF"/>
        <circle cx="119" cy="184" r="2.5" fill="#CCCABF"/>
        <circle cx="119" cy="202" r="2.5" fill="#CCCABF"/>
        <circle cx="119" cy="220" r="2.5" fill="#CCCABF"/>
        {/* Pocket */}
        <rect x="88" y="172" width="24" height="26" rx="1" fill="none" stroke="#DDD8CE" strokeWidth="1"/>
        {/* Left sleeve */}
        <path d="M78 168 L46 180 L28 280 L54 288 L74 200" fill="#F4F0E8" stroke="#DDD8CE" strokeWidth="1.5"/>
        {/* Right sleeve */}
        <path d="M160 168 L192 180 L210 280 L184 288 L164 200" fill="#F4F0E8" stroke="#DDD8CE" strokeWidth="1.5"/>
        {/* Cuffs */}
        <rect x="26" y="280" width="46" height="12" rx="3" fill="#ECEAE0" stroke="#D0CBC2" strokeWidth="1"/>
        <rect x="168" y="280" width="46" height="12" rx="3" fill="#ECEAE0" stroke="#D0CBC2" strokeWidth="1"/>

        {/* Neck */}
        <rect x="108" y="82" width="22" height="36" rx="6" fill="#C8A07A"/>
        {/* Head */}
        <ellipse cx="119" cy="64" rx="32" ry="36" fill="#C8A07A"/>
        {/* Hair — short, neat */}
        <path d="M88 52 Q88 22 119 18 Q150 22 150 52 Q148 36 142 32 Q136 38 119 36 Q102 38 96 32 Q90 36 88 52 Z" fill="#1C1410"/>
        {/* Ears */}
        <ellipse cx="87" cy="66" rx="7" ry="9" fill="#BC9870"/>
        <ellipse cx="151" cy="66" rx="7" ry="9" fill="#BC9870"/>
        {/* Eyes */}
        <ellipse cx="107" cy="68" rx="4.5" ry="5" fill="#1A1410"/>
        <ellipse cx="131" cy="68" rx="4.5" ry="5" fill="#1A1410"/>
        <ellipse cx="108.5" cy="67" rx="1.5" ry="1.5" fill="white" opacity="0.7"/>
        <ellipse cx="132.5" cy="67" rx="1.5" ry="1.5" fill="white" opacity="0.7"/>
        {/* Eyebrows */}
        <path d="M102 60 Q107 57 112 60" stroke="#1C1410" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M126 60 Q131 57 136 60" stroke="#1C1410" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Nose */}
        <path d="M117 73 Q119 78 121 73" stroke="#B08060" strokeWidth="1" fill="none" strokeLinecap="round"/>
        {/* Mouth */}
        <path d="M111 84 Q119 89 127 84" stroke="#A87858" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </g>

      {/* ─────────────────────────────────────────────────────
          RIGHT ACCENT — tall indoor plant (like Clare's ficus)
      ───────────────────────────────────────────────────── */}
      {/* Pot */}
      <path d="M1210 380 L1200 418 L1260 418 L1250 380 Z" fill="#5C5048" stroke="#4A4038" strokeWidth="1"/>
      <rect x="1196" y="374" width="68" height="10" rx="3" fill="#6A5A48"/>
      {/* Soil */}
      <ellipse cx="1230" cy="380" rx="34" ry="6" fill="#3A2E24"/>

      {/* Main trunk */}
      <path d="M1230 380 Q1228 300 1232 220 Q1235 160 1228 100" stroke="#4A3C2E" strokeWidth="8" fill="none" strokeLinecap="round"/>

      {/* Branches — left */}
      <path d="M1229 280 Q1190 260 1160 240" stroke="#4A3C2E" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M1229 220 Q1180 195 1145 185" stroke="#4A3C2E" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M1229 170 Q1195 140 1170 120" stroke="#4A3C2E" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M1228 120 Q1205 90 1185 68" stroke="#4A3C2E" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* Branches — right */}
      <path d="M1231 250 Q1268 228 1298 215" stroke="#4A3C2E" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M1231 195 Q1275 168 1310 155" stroke="#4A3C2E" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M1230 148 Q1268 118 1295 100" stroke="#4A3C2E" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M1229 105 Q1255 76 1278 58" stroke="#4A3C2E" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* Leaves — large fiddle-leaf style, various greens */}
      {[
        { cx:1148, cy:234, rx:28, ry:42, rot:-30, fill:'#3A5E38' },
        { cx:1138, cy:180, rx:24, ry:38, rot:-40, fill:'#2E5030' },
        { cx:1162, cy:115, rx:22, ry:36, rot:-25, fill:'#3A5E38' },
        { cx:1180, cy:64,  rx:20, ry:34, rot:-20, fill:'#446848' },
        { cx:1305, cy:210, rx:28, ry:42, rot:25,  fill:'#3A5E38' },
        { cx:1318, cy:150, rx:24, ry:38, rot:35,  fill:'#2E5030' },
        { cx:1300, cy:95,  rx:22, ry:36, rot:28,  fill:'#446848' },
        { cx:1282, cy:54,  rx:20, ry:32, rot:22,  fill:'#3A5E38' },
        {cx: 1228, cy:100, rx:18, ry:30, rot:0,   fill:'#446848' },
        {cx: 1215, cy:58,  rx:16, ry:28, rot:-10, fill:'#3A5E38' },
        {cx: 1242, cy:56,  rx:16, ry:28, rot:12,  fill:'#2E5030' },
      ].map((l, i) => (
        <ellipse
          key={i}
          cx={l.cx} cy={l.cy}
          rx={l.rx} ry={l.ry}
          fill={l.fill}
          transform={`rotate(${l.rot}, ${l.cx}, ${l.cy})`}
          opacity="0.92"
        />
      ))}

      {/* Leaf veins (a few large leaves) */}
      <line x1="1148" y1="208" x2="1148" y2="272" stroke="#2A4A28" strokeWidth="1" opacity="0.5"/>
      <line x1="1305" y1="184" x2="1305" y2="248" stroke="#2A4A28" strokeWidth="1" opacity="0.5"/>


      {/* ─────────────────────────────────────────────────────
          FLOOR LINE — subtle shadow/ground  
      ───────────────────────────────────────────────────── */}
      <rect x="0" y="412" width="1440" height="8"
            fill="url(#floorGrad)" opacity="0.35"/>
      <defs>
        <linearGradient id="floorGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"   stopColor="#0D0B09" stopOpacity="0"/>
          <stop offset="20%"  stopColor="#0D0B09" stopOpacity="0.6"/>
          <stop offset="50%"  stopColor="#0D0B09" stopOpacity="0.8"/>
          <stop offset="80%"  stopColor="#0D0B09" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#0D0B09" stopOpacity="0"/>
        </linearGradient>
      </defs>

    </svg>
  );
}
