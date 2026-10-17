/**
 * MarqueeBanner — pure CSS infinite marquee, works on all browsers.
 * Two identical belts side by side. Belt 1 slides from 0 → -50%,
 * Belt 2 is already at 50% so it seamlessly takes over.
 * This avoids JS, requestAnimationFrame, and width-calculation bugs.
 */

const phrases = [
  'TIMELESS STYLE',
  'EVERYDAY COMFORT',
  'EFFORTLESS CONFIDENCE',
  'MADE FOR YOU',
];

function Belt() {
  return (
    <div className="marquee-banner__belt" aria-hidden="true">
      {phrases.map((phrase, i) => (
        <span key={i} className="marquee-banner__group">
          <span className="marquee-banner__text">{phrase}</span>
          <span className="marquee-banner__sep">•</span>
        </span>
      ))}
    </div>
  );
}

export default function MarqueeBanner() {
  return (
    <div className="marquee-banner" role="marquee" aria-label="Brand values">
      <div className="marquee-banner__track">
        <Belt />
        {/* Duplicate for seamless loop */}
        <Belt />
      </div>
    </div>
  );
}
