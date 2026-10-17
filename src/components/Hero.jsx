/**
 * Hero Section — ZEVRA
 * Pure full-bleed image. No overlaid text or CTA.
 */

export default function Hero() {
  return (
    <section className="hero" aria-label="ZEVRA — premium men's clothing">
      <img
        src="/images/brand/hero-bg.png"
        alt="ZEVRA — a man in a white overshirt and dark trousers stands in front of the ZEVRA wordmark"
        className="hero__bg-img"
        draggable={false}
        fetchPriority="high"
      />
    </section>
  );
}
