/**
 * ProductIllustration.jsx
 *
 * Renders a distinct, editorial-style SVG illustration for each product.
 * These act as high-quality fallbacks until real photography is supplied.
 * Each illustration is unique — shirts look like shirts, jeans like jeans, etc.
 *
 * Props:
 *   productId  – matches product ID from products.js
 *   alt        – accessible alt text
 *   className  – forwarded to <svg>
 *   style      – forwarded to wrapper
 */

const illustrations = {
  // ── p001 Essential Oxford Shirt ──────────────────────────────
  p001: ({ className }) => (
    <svg className={className} viewBox="0 0 400 530" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="400" height="530" fill="#EAE8E2"/>
      {/* shirt body */}
      <path d="M130 155 L100 130 L60 170 L80 210 L115 195 L115 420 L285 420 L285 195 L320 210 L340 170 L300 130 L270 155" fill="#F5F4EF" stroke="#C8C5BC" strokeWidth="1.5"/>
      {/* collar */}
      <path d="M155 155 L200 185 L245 155 L240 135 L200 160 L160 135 Z" fill="#EDEDEA" stroke="#C0BDB4" strokeWidth="1"/>
      {/* button placket */}
      <line x1="200" y1="185" x2="200" y2="418" stroke="#D0CEC7" strokeWidth="1.5"/>
      <circle cx="200" cy="210" r="3" fill="#C0BDB4"/>
      <circle cx="200" cy="240" r="3" fill="#C0BDB4"/>
      <circle cx="200" cy="270" r="3" fill="#C0BDB4"/>
      <circle cx="200" cy="300" r="3" fill="#C0BDB4"/>
      <circle cx="200" cy="330" r="3" fill="#C0BDB4"/>
      {/* pocket */}
      <rect x="155" y="220" width="35" height="38" rx="1" stroke="#C8C5BC" strokeWidth="1" fill="none"/>
      {/* shoulder seams */}
      <line x1="130" y1="155" x2="115" y2="220" stroke="#C8C5BC" strokeWidth="1"/>
      <line x1="270" y1="155" x2="285" y2="220" stroke="#C8C5BC" strokeWidth="1"/>
      {/* cuffs */}
      <rect x="62" y="192" width="52" height="18" rx="2" fill="#EDEDEA" stroke="#C0BDB4" strokeWidth="1"/>
      <rect x="286" y="192" width="52" height="18" rx="2" fill="#EDEDEA" stroke="#C0BDB4" strokeWidth="1"/>
      {/* label area bottom */}
      <text x="200" y="475" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#A8A5A0" letterSpacing="3">OXFORD WEAVE</text>
    </svg>
  ),

  // ── p002 Relaxed Poplin Shirt ─────────────────────────────────
  p002: ({ className }) => (
    <svg className={className} viewBox="0 0 400 530" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="400" height="530" fill="#E8E6DF"/>
      {/* body — relaxed fit, wider */}
      <path d="M120 148 L88 125 L48 168 L72 212 L112 196 L112 430 L288 430 L288 196 L328 212 L352 168 L312 125 L280 148" fill="#F2EFE8" stroke="#C5C1B7" strokeWidth="1.5"/>
      {/* spread collar */}
      <path d="M148 148 L200 172 L252 148" stroke="#C5C1B7" strokeWidth="1.5" fill="none"/>
      <path d="M148 148 L178 130 L200 148 L222 130 L252 148 L230 170 L200 172 L170 170 Z" fill="#E8E5DD" stroke="#BDB9B0" strokeWidth="1"/>
      {/* front opening — untucked casual look */}
      <line x1="200" y1="172" x2="200" y2="430" stroke="#CCCAC3" strokeWidth="1.5" strokeDasharray="4 4"/>
      {/* sleeve fold lines */}
      <path d="M112 196 L92 240 L88 270" stroke="#C5C1B7" strokeWidth="1" fill="none"/>
      <path d="M288 196 L308 240 L312 270" stroke="#C5C1B7" strokeWidth="1" fill="none"/>
      {/* hem */}
      <path d="M112 430 Q145 445 200 440 Q255 445 288 430" stroke="#C5C1B7" strokeWidth="1.5" fill="none"/>
      {/* cuffs rolled */}
      <ellipse cx="80" cy="268" rx="20" ry="8" fill="#E8E5DD" stroke="#BDBAB1" strokeWidth="1"/>
      <ellipse cx="320" cy="268" rx="20" ry="8" fill="#E8E5DD" stroke="#BDBAB1" strokeWidth="1"/>
      <text x="200" y="488" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#A5A29C" letterSpacing="3">100% POPLIN</text>
    </svg>
  ),

  // ── p003 Everyday Crewneck Tee ────────────────────────────────
  p003: ({ className }) => (
    <svg className={className} viewBox="0 0 400 530" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="400" height="530" fill="#ECEAE6"/>
      {/* tee body */}
      <path d="M135 155 L95 135 L55 175 L75 210 L118 195 L118 415 L282 415 L282 195 L325 210 L345 175 L305 135 L265 155" fill="#F8F7F4" stroke="#C8C6C0" strokeWidth="1.5"/>
      {/* crew neck */}
      <path d="M165 155 Q200 178 235 155" stroke="#C0BEB8" strokeWidth="1.5" fill="none"/>
      <ellipse cx="200" cy="157" rx="38" ry="14" fill="none" stroke="#C0BEB8" strokeWidth="2"/>
      {/* shoulder seams */}
      <line x1="135" y1="155" x2="118" y2="200" stroke="#C8C6C0" strokeWidth="1"/>
      <line x1="265" y1="155" x2="282" y2="200" stroke="#C8C6C0" strokeWidth="1"/>
      {/* side seams */}
      <line x1="118" y1="200" x2="118" y2="415" stroke="#D0CEC8" strokeWidth="0.75"/>
      <line x1="282" y1="200" x2="282" y2="415" stroke="#D0CEC8" strokeWidth="0.75"/>
      {/* sleeve details */}
      <path d="M118 195 L80 195 L57 210" stroke="#C8C6C0" strokeWidth="0.75" fill="none"/>
      <path d="M282 195 L320 195 L343 210" stroke="#C8C6C0" strokeWidth="0.75" fill="none"/>
      {/* hem ribbing */}
      <line x1="118" y1="408" x2="282" y2="408" stroke="#C8C6C0" strokeWidth="1.5"/>
      <line x1="118" y1="415" x2="282" y2="415" stroke="#C8C6C0" strokeWidth="1.5"/>
      <text x="200" y="470" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#AAA8A2" letterSpacing="3">180 GSM COTTON</text>
    </svg>
  ),

  // ── p004 Heavyweight Cotton Tee ───────────────────────────────
  p004: ({ className }) => (
    <svg className={className} viewBox="0 0 400 530" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="400" height="530" fill="#E5E3DD"/>
      {/* boxy fit — wider shoulders, drop sleeve */}
      <path d="M105 148 L60 120 L30 168 L55 210 L105 210 L105 428 L295 428 L295 210 L345 210 L370 168 L340 120 L295 148" fill="#EDE9E2" stroke="#BEBBB2" strokeWidth="2"/>
      {/* crew neck — wider */}
      <ellipse cx="200" cy="155" rx="48" ry="16" fill="none" stroke="#BEBBB2" strokeWidth="2.5"/>
      {/* drop shoulder line */}
      <line x1="105" y1="210" x2="295" y2="210" stroke="#BEBBB2" strokeWidth="1.5"/>
      {/* ribbed cuffs */}
      <rect x="30" y="198" width="68" height="14" fill="#E0DDD6" stroke="#B8B5AC" strokeWidth="1"/>
      <rect x="302" y="198" width="68" height="14" fill="#E0DDD6" stroke="#B8B5AC" strokeWidth="1"/>
      {/* ribbed hem */}
      <rect x="105" y="416" width="190" height="14" fill="#E0DDD6" stroke="#B8B5AC" strokeWidth="1"/>
      {/* subtle texture lines */}
      <line x1="105" y1="270" x2="295" y2="270" stroke="#D5D2CB" strokeWidth="0.5"/>
      <line x1="105" y1="320" x2="295" y2="320" stroke="#D5D2CB" strokeWidth="0.5"/>
      <line x1="105" y1="370" x2="295" y2="370" stroke="#D5D2CB" strokeWidth="0.5"/>
      <text x="200" y="482" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#A0A09A" letterSpacing="3">260 GSM RING-SPUN</text>
    </svg>
  ),

  // ── p005 Straight Fit Denim ───────────────────────────────────
  p005: ({ className }) => (
    <svg className={className} viewBox="0 0 400 530" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="400" height="530" fill="#D8DCE8"/>
      {/* waistband */}
      <rect x="95" y="85" width="210" height="30" rx="2" fill="#4A5E88" stroke="#3A4E78" strokeWidth="1.5"/>
      {/* belt loops */}
      {[118, 148, 200, 252, 282].map((x, i) => (
        <rect key={i} x={x} y="80" width="8" height="20" rx="1" fill="#3A4E78"/>
      ))}
      {/* main denim body */}
      <path d="M95 115 L95 340 L145 340 L175 490 L200 490 L200 340 L200 340 L200 490 L225 490 L255 340 L305 340 L305 115 Z" fill="#4D6290" stroke="#3D5280" strokeWidth="1.5"/>
      {/* fly */}
      <path d="M200 115 L200 200 Q195 215 188 200 L185 115" fill="#456088" stroke="#3A5278" strokeWidth="1"/>
      <circle cx="192" cy="118" r="5" fill="#8899B8"/>
      {/* front rise */}
      <path d="M200 115 Q170 105 150 115 L95 115" stroke="#3D5280" strokeWidth="1" fill="none"/>
      <path d="M200 115 Q230 105 250 115 L305 115" stroke="#3D5280" strokeWidth="1" fill="none"/>
      {/* coin pocket */}
      <path d="M265 130 Q285 128 290 145 Q285 162 265 158 Z" fill="none" stroke="#3A5278" strokeWidth="1"/>
      {/* back pocket outline area */}
      <path d="M115 160 Q115 200 145 202 Q145 160 115 160 Z" fill="none" stroke="#5068A0" strokeWidth="1"/>
      {/* seams */}
      <line x1="200" y1="340" x2="200" y2="490" stroke="#3A5280" strokeWidth="2"/>
      <line x1="145" y1="340" x2="175" y2="490" stroke="#3A5280" strokeWidth="1"/>
      <line x1="255" y1="340" x2="225" y2="490" stroke="#3A5280" strokeWidth="1"/>
      {/* hem */}
      <line x1="175" y1="482" x2="175" y2="490" stroke="#3A5280" strokeWidth="2.5"/>
      <line x1="225" y1="482" x2="225" y2="490" stroke="#3A5280" strokeWidth="2.5"/>
      <text x="200" y="515" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#6070A0" letterSpacing="3">12 OZ DENIM</text>
    </svg>
  ),

  // ── p006 Relaxed Fit Denim ────────────────────────────────────
  p006: ({ className }) => (
    <svg className={className} viewBox="0 0 400 530" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="400" height="530" fill="#C8D0E0"/>
      {/* waistband — higher rise */}
      <rect x="88" y="72" width="224" height="35" rx="2" fill="#607898" stroke="#506888" strokeWidth="1.5"/>
      {/* belt loops */}
      {[112, 145, 200, 255, 288].map((x, i) => (
        <rect key={i} x={x} y="66" width="9" height="22" rx="1" fill="#506888"/>
      ))}
      {/* relaxed body — wider through thigh */}
      <path d="M88 107 L82 360 L138 360 L162 490 L200 490 L200 360 L200 360 L200 490 L238 490 L262 360 L318 360 L312 107 Z" fill="#7090B8" stroke="#607AA8" strokeWidth="1.5"/>
      {/* fly */}
      <path d="M200 107 L200 195 Q194 212 186 196 L182 107" fill="#6888B0" stroke="#5878A0" strokeWidth="1"/>
      <circle cx="191" cy="110" r="5.5" fill="#A0B4D0"/>
      {/* washed texture */}
      <path d="M120 200 Q160 210 180 200 Q190 195 200 200" stroke="#90A8C8" strokeWidth="1.5" fill="none" strokeDasharray="6 3"/>
      <path d="M130 250 Q150 260 165 250" stroke="#90A8C8" strokeWidth="1" fill="none" strokeDasharray="5 4"/>
      {/* seam */}
      <line x1="200" y1="360" x2="200" y2="490" stroke="#5878A0" strokeWidth="2.5"/>
      <line x1="138" y1="360" x2="162" y2="490" stroke="#5878A0" strokeWidth="1"/>
      <line x1="262" y1="360" x2="238" y2="490" stroke="#5878A0" strokeWidth="1"/>
      {/* hem slightly cropped */}
      <line x1="162" y1="483" x2="162" y2="490" stroke="#5878A0" strokeWidth="3"/>
      <line x1="238" y1="483" x2="238" y2="490" stroke="#5878A0" strokeWidth="3"/>
      <text x="200" y="515" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#7080A8" letterSpacing="3">RELAXED RISE</text>
    </svg>
  ),

  // ── p007 Tailored Everyday Trousers ──────────────────────────
  p007: ({ className }) => (
    <svg className={className} viewBox="0 0 400 530" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="400" height="530" fill="#E0DEDA"/>
      {/* waistband */}
      <rect x="100" y="82" width="200" height="28" rx="2" fill="#3C3C3C" stroke="#2C2C2C" strokeWidth="1.5"/>
      {/* belt loops */}
      {[120, 148, 200, 252, 280].map((x, i) => (
        <rect key={i} x={x} y="77" width="7" height="18" rx="1" fill="#2C2C2C"/>
      ))}
      {/* trouser body — straight, tailored */}
      <path d="M100 110 L100 340 L148 340 L165 488 L200 488 L200 340 L200 340 L200 488 L235 488 L252 340 L300 340 L300 110 Z" fill="#484848" stroke="#383838" strokeWidth="1.5"/>
      {/* fly */}
      <path d="M200 110 L200 185 Q196 198 190 185 L188 110" fill="#404040" stroke="#303030" strokeWidth="1"/>
      <circle cx="194" cy="113" r="4.5" fill="#707070"/>
      {/* crease lines — hallmark of tailored trousers */}
      <line x1="165" y1="340" x2="157" y2="488" stroke="#555555" strokeWidth="1.5" strokeDasharray="80 1000"/>
      <line x1="235" y1="340" x2="243" y2="488" stroke="#555555" strokeWidth="1.5" strokeDasharray="80 1000"/>
      <line x1="157" y1="200" x2="165" y2="340" stroke="#555555" strokeWidth="1" strokeDasharray="4 4"/>
      <line x1="243" y1="200" x2="235" y2="340" stroke="#555555" strokeWidth="1" strokeDasharray="4 4"/>
      {/* side pockets */}
      <path d="M100 150 Q120 145 130 165" stroke="#606060" strokeWidth="1" fill="none"/>
      <path d="M300 150 Q280 145 270 165" stroke="#606060" strokeWidth="1" fill="none"/>
      {/* hem */}
      <line x1="157" y1="480" x2="157" y2="488" stroke="#383838" strokeWidth="3"/>
      <line x1="243" y1="480" x2="243" y2="488" stroke="#383838" strokeWidth="3"/>
      {/* seam */}
      <line x1="200" y1="340" x2="200" y2="488" stroke="#303030" strokeWidth="2"/>
      <text x="200" y="513" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#888580" letterSpacing="3">WOOL BLEND</text>
    </svg>
  ),

  // ── p008 Pleated Straight Trousers ───────────────────────────
  p008: ({ className }) => (
    <svg className={className} viewBox="0 0 400 530" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="400" height="530" fill="#E8E2D8"/>
      {/* waistband */}
      <rect x="97" y="80" width="206" height="30" rx="2" fill="#B8906A" stroke="#A88060" strokeWidth="1.5"/>
      {/* belt loops */}
      {[118, 148, 200, 252, 282].map((x, i) => (
        <rect key={i} x={x} y="75" width="8" height="20" rx="1" fill="#A88060"/>
      ))}
      {/* trouser body — generous fit */}
      <path d="M97 110 L92 345 L142 345 L158 470 L200 470 L200 345 L200 345 L200 470 L242 470 L258 345 L308 345 L303 110 Z" fill="#C8A07A" stroke="#B89070" strokeWidth="1.5"/>
      {/* double pleats */}
      <path d="M200 110 L192 145 L186 140 L186 200" stroke="#A88060" strokeWidth="1.5" fill="none"/>
      <path d="M200 110 L196 145 L192 143" stroke="#B89070" strokeWidth="1" fill="none"/>
      <path d="M200 110 L208 145 L214 140 L214 200" stroke="#A88060" strokeWidth="1.5" fill="none"/>
      <path d="M200 110 L204 145 L208 143" stroke="#B89070" strokeWidth="1" fill="none"/>
      {/* fly */}
      <path d="M200 110 L200 180 Q195 192 189 180 L187 110" fill="#C0987A" stroke="#A88060" strokeWidth="1"/>
      <circle cx="193" cy="113" r="5" fill="#D8C0A8"/>
      {/* crease */}
      <line x1="158" y1="345" x2="150" y2="470" stroke="#B89870" strokeWidth="1.5" strokeDasharray="80 1000"/>
      <line x1="242" y1="345" x2="250" y2="470" stroke="#B89870" strokeWidth="1.5" strokeDasharray="80 1000"/>
      {/* side seams / texture */}
      <path d="M97 180 L92 345" stroke="#B89070" strokeWidth="0.75"/>
      <path d="M303 180 L308 345" stroke="#B89070" strokeWidth="0.75"/>
      {/* hem cropped */}
      <line x1="150" y1="462" x2="150" y2="470" stroke="#A88060" strokeWidth="3"/>
      <line x1="250" y1="462" x2="250" y2="470" stroke="#A88060" strokeWidth="3"/>
      {/* seam */}
      <line x1="200" y1="345" x2="200" y2="470" stroke="#A88060" strokeWidth="2"/>
      <text x="200" y="500" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#A08060" letterSpacing="3">LINEN BLEND</text>
    </svg>
  ),
};

export default function ProductIllustration({ productId, alt, className, style }) {
  const Illustration = illustrations[productId];

  if (!Illustration) {
    return (
      <svg
        className={className}
        style={style}
        viewBox="0 0 400 530"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={alt}
      >
        <rect width="400" height="530" fill="#ECEAE5"/>
        <text x="200" y="265" textAnchor="middle" fontFamily="Georgia, serif" fontSize="13" fill="#A8A5A0" letterSpacing="2">
          {alt}
        </text>
      </svg>
    );
  }

  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
      role="img"
      aria-label={alt}
    >
      <Illustration className="product-illustration-svg" />
    </div>
  );
}
