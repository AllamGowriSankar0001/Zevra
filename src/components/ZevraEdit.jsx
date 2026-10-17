import { ArrowRight } from 'lucide-react';

export default function ZevraEdit({ onExplore }) {
  return (
    <section className="zedit" aria-labelledby="zedit-title">
      <div className="zedit__inner">

        {/* Left — text content */}
        <div className="zedit__content">
          <span className="zedit__eyebrow">The ZEVRA Edit</span>
          <h2 className="zedit__title" id="zedit-title">
            Your Everyday,<br />Elevated.
          </h2>
          <p className="zedit__copy">
            Versatile styles designed to make everyday dressing effortless.
            From relaxed shirts to tailored trousers — pieces that work harder
            so you don't have to.
          </p>
          <button className="zedit__cta btn-primary" onClick={onExplore} aria-label="Explore the collection">
            Explore the Collection
            <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        {/* Right — editorial visual */}
        <div className="zedit__visual" aria-hidden="true">
          <img
            src="/images/brand/zevra-edit.png"
            alt="ZEVRA model — white shirt and navy trousers"
            className="zedit__illo"
            loading="lazy"
          />
        </div>

      </div>
    </section>
  );
}

function EditorialIllustration() {
  return (
    <svg
      viewBox="0 0 480 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="zedit__illo"
    >
      {/* Warm background */}
      <rect width="480" height="560" fill="#E8E2D8"/>

      {/* Subtle light from top right */}
      <polygon points="340,0 480,0 480,280 420,320" fill="white" opacity="0.1"/>
      <polygon points="400,0 480,0 480,180" fill="white" opacity="0.08"/>

      {/* Shadow floor */}
      <ellipse cx="240" cy="540" rx="160" ry="18" fill="#C8BEB0" opacity="0.5"/>

      {/* ── Trousers (dark navy) ── */}
      <rect x="175" y="306" width="130" height="14" rx="2" fill="#1C1C28"/>
      {/* Left leg */}
      <path d="M175 320 L168 540 L228 540 L240 420 Z" fill="#242430"/>
      {/* Right leg */}
      <path d="M305 320 L312 540 L252 540 L240 420 Z" fill="#202030"/>
      {/* Crotch */}
      <path d="M175 320 L240 380 L305 320 Z" fill="#1E1E2C"/>
      {/* Crease */}
      <line x1="204" y1="390" x2="192" y2="538" stroke="#2E2E3E" strokeWidth="1.5"/>
      <line x1="276" y1="390" x2="288" y2="538" stroke="#2C2C3C" strokeWidth="1.5"/>
      {/* Belt */}
      <rect x="175" y="298" width="130" height="10" rx="2" fill="#0E0E14"/>
      <rect x="232" y="296" width="16" height="14" rx="1.5" fill="#5A4A38"/>
      <rect x="235" y="299" width="10" height="8" rx="1" fill="#9A8468"/>
      {/* Shoe left */}
      <ellipse cx="196" cy="541" rx="34" ry="9" fill="#161416"/>
      {/* Shoe right */}
      <ellipse cx="284" cy="541" rx="32" ry="8" fill="#161416"/>

      {/* ── Shirt (crisp white) ── */}
      <path d="M168 200 L138 180 L110 218 L132 234 L168 220 L168 306 L312 306 L312 220 L348 234 L370 218 L342 180 L312 200"
            fill="#F8F6F2" stroke="#E0DCD4" strokeWidth="1.5"/>
      {/* Left sleeve */}
      <path d="M168 220 L132 234 L116 318 L144 326 L162 244" fill="#F8F6F2" stroke="#E0DCD4" strokeWidth="1.5"/>
      {/* Right sleeve */}
      <path d="M312 220 L348 234 L364 318 L336 326 L318 244" fill="#F5F2EC" stroke="#E0DCD4" strokeWidth="1.5"/>
      {/* Cuffs */}
      <rect x="113" y="318" width="44" height="12" rx="3" fill="#EDEBE3" stroke="#D8D4CC" strokeWidth="1"/>
      <rect x="323" y="318" width="44" height="12" rx="3" fill="#EDEBE3" stroke="#D8D4CC" strokeWidth="1"/>
      {/* Collar */}
      <path d="M194 200 L240 222 L286 200 L280 182 L240 200 L200 182 Z" fill="#EEEBE3" stroke="#D8D4CC" strokeWidth="1"/>
      {/* Placket */}
      <line x1="240" y1="222" x2="240" y2="305" stroke="#E0DCD4" strokeWidth="1.5"/>
      <circle cx="240" cy="238" r="2.5" fill="none" stroke="#D0CCC4" strokeWidth="1"/>
      <circle cx="240" cy="258" r="2.5" fill="none" stroke="#D0CCC4" strokeWidth="1"/>
      <circle cx="240" cy="278" r="2.5" fill="none" stroke="#D0CCC4" strokeWidth="1"/>
      {/* Chest pocket */}
      <rect x="200" y="236" width="22" height="24" rx="1" fill="none" stroke="#D8D4CC" strokeWidth="1"/>

      {/* ── Neck ── */}
      <rect x="226" y="150" width="28" height="38" rx="8" fill="#C8A07A"/>

      {/* ── Head ── */}
      <ellipse cx="240" cy="128" rx="38" ry="44" fill="#C8A07A"/>
      {/* Hair */}
      <path d="M204 112 Q202 78 240 72 Q278 78 276 112 Q273 92 268 88 Q258 96 240 94 Q222 96 212 88 Q207 92 204 112Z" fill="#1A1410"/>
      {/* Ears */}
      <ellipse cx="202" cy="132" rx="8" ry="10" fill="#BC9870"/>
      <ellipse cx="278" cy="132" rx="8" ry="10" fill="#BC9870"/>
      {/* Eyes */}
      <ellipse cx="226" cy="130" rx="7" ry="6.5" fill="#1A1410"/>
      <ellipse cx="254" cy="130" rx="7" ry="6.5" fill="#1A1410"/>
      <circle cx="227.5" cy="129" r="1.5" fill="white" opacity="0.65"/>
      <circle cx="255.5" cy="129" r="1.5" fill="white" opacity="0.65"/>
      {/* Brows */}
      <path d="M218 120 Q226 115 234 118" stroke="#2A1E14" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M246 118 Q254 115 262 120" stroke="#2A1E14" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Nose */}
      <path d="M236 140 Q240 146 244 140" stroke="#B08060" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Mouth */}
      <path d="M228 155 Q240 161 252 155" stroke="#A07050" strokeWidth="1.75" fill="none" strokeLinecap="round"/>
      {/* Cheek warmth */}
      <ellipse cx="212" cy="142" rx="10" ry="7" fill="#D49070" opacity="0.2"/>
      <ellipse cx="268" cy="142" rx="10" ry="7" fill="#D49070" opacity="0.2"/>

      {/* ── Large ZEVRA text behind ── */}
      <text
        x="240" y="68"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="96"
        fontWeight="600"
        fill="#1A1814"
        opacity="0.06"
        letterSpacing="8"
        style={{ userSelect: 'none' }}
      >ZEVRA</text>
    </svg>
  );
}
