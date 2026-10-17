/**
 * MarqueeBanner — infinite scrolling tagline strip
 */

const phrases = [
  'TIMELESS STYLE',
  'EVERYDAY COMFORT',
  'EFFORTLESS CONFIDENCE',
  'MADE FOR YOU',
];

const SEP = '•';
const REPEAT = 6;

// Build a flat repeated array: phrase • phrase • ...
const items = Array.from({ length: REPEAT }, () => phrases).flat();

export default function MarqueeBanner() {
  return (
    <div className="marquee-banner" aria-hidden="true">
      <div className="marquee-banner__belt">
        {items.map((phrase, i) => (
          <span key={i} className="marquee-banner__group">
            <span className="marquee-banner__text">{phrase}</span>
            <span className="marquee-banner__sep">{SEP}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
