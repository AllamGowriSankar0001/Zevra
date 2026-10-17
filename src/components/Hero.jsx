/**
 * Hero Section — ZEVRA
 * Desktop: hero-bg.png (landscape editorial)
 * Mobile:  hero-mobile.png (portrait boutique)
 */

export default function Hero() {
  return (
    <section className="hero" aria-label="ZEVRA — premium men's clothing">
      {/* Mobile image (portrait) */}
      <img
        src="/images/brand/hero-mobile.png"
        alt="ZEVRA — premium men's clothing"
        className="hero__bg-img hero__bg-img--mobile"
        fetchPriority="high"
        draggable={false}
      />
      {/* Desktop image (landscape) */}
      <img
        src="/images/brand/hero-bg.png"
        alt="ZEVRA — premium men's clothing"
        className="hero__bg-img hero__bg-img--desktop"
        fetchPriority="high"
        draggable={false}
      />
    </section>
  );
}
