import { ArrowRight } from 'lucide-react';

export default function EditorialSection({ onExplore }) {
  return (
    <section className="editorial" aria-labelledby="editorial-title" id="about">
      <div className="editorial__inner">
        <span className="editorial__eyebrow">The Everyday Edit</span>
        <h2 className="editorial__title" id="editorial-title">
          Simple pieces.<br />Your own way to wear them.
        </h2>
        <p className="editorial__copy">
          ZEVRA brings shirts, tees, denim and trousers into one considered everyday wardrobe.
        </p>
        <button
          className="btn-secondary"
          onClick={() => {
            onExplore();
            const el = document.getElementById('collection');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          aria-label="Browse the full collection"
        >
          Browse the collection
          <ArrowRight size={12} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
