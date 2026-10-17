/**
 * ZevraLogo.jsx
 * Inline SVG recreation of the ZEVRA brand logo:
 *   - Clothes hanger above the wordmark
 *   - "ZEVRA" in a high-contrast display serif
 *   - "CLOTHING STORE" small caps below
 *   - "— MEN'S WEAR —" with flanking rules
 *
 * Props:
 *   height   – rendered height in px (width scales automatically)
 *   color    – fill/stroke colour (default #111111)
 *   className
 */
export default function ZevraLogo({ height = 48, color = '#111111', className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 160"
      height={height}
      width="auto"
      aria-label="ZEVRA Clothing Store — Men's Wear"
      role="img"
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* ── Clothes hanger ───────────────────────────────── */}
      {/* Hook */}
      <path
        d="M160 8 Q160 2 166 2 Q172 2 172 8 Q172 13 166 14"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Hanger neck stem */}
      <line x1="160" y1="14" x2="160" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      {/* Hanger body — wide flat triangle */}
      <path
        d="M160 28 L68 62 Q64 64 66 68 L254 68 Q256 64 252 62 Z"
        fill={color}
        stroke={color}
        strokeWidth="0.5"
        strokeLinejoin="round"
      />

      {/* ── ZEVRA wordmark ───────────────────────────────── */}
      <text
        x="160"
        y="118"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', 'Georgia', 'Times New Roman', serif"
        fontSize="72"
        fontWeight="700"
        letterSpacing="4"
        fill={color}
      >
        ZEVRA
      </text>

      {/* ── CLOTHING STORE ──────────────────────────────── */}
      <text
        x="160"
        y="133"
        textAnchor="middle"
        fontFamily="'DM Sans', 'Helvetica Neue', Arial, sans-serif"
        fontSize="10.5"
        fontWeight="600"
        letterSpacing="5"
        fill={color}
      >
        CLOTHING STORE
      </text>

      {/* ── — MEN'S WEAR — ──────────────────────────────── */}
      {/* Left rule */}
      <line x1="64" y1="147" x2="106" y2="147" stroke={color} strokeWidth="0.75"/>
      <text
        x="160"
        y="150"
        textAnchor="middle"
        fontFamily="'DM Sans', 'Helvetica Neue', Arial, sans-serif"
        fontSize="8.5"
        fontWeight="400"
        letterSpacing="4"
        fill={color}
      >
        MEN&#39;S WEAR
      </text>
      {/* Right rule */}
      <line x1="214" y1="147" x2="256" y2="147" stroke={color} strokeWidth="0.75"/>
    </svg>
  );
}
