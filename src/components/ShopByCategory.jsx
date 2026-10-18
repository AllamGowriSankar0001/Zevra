import { useState } from 'react';

const CATEGORY_META = {
  shirts:   { label: 'Shirts',   sub: 'Oxford, poplin & beyond', accent: '#3A3028' },
  tshirts:  { label: 'T-Shirts', sub: 'Everyday essentials',     accent: '#283430' },
  jeans:    { label: 'Jeans',    sub: 'Straight, relaxed & raw', accent: '#282E40' },
  trousers: { label: 'Trousers', sub: 'Tailored & pleated',      accent: '#302820' },
};

export default function ShopByCategory({ categories, products, onCategoryChange }) {
  const [failedImages, setFailedImages] = useState({});
  const cats = categories || [];

  function handleClick(id) {
    onCategoryChange(id);
    const el = document.getElementById('collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className="sbc" aria-labelledby="sbc-title">
      <div className="sbc__head container">
        <h2 className="sbc__title" id="sbc-title">Shop by Category</h2>
        <p className="sbc__sub">Find your everyday essentials.</p>
      </div>

      <div className="sbc__grid container">
        {cats.map(cat => {
          const meta = CATEGORY_META[cat.id] || { label: cat.label, sub: cat.description || 'Explore the collection', accent: '#392d32' };
          const image = products.find(product => product.category === cat.id)?.images?.[0];
          const imageFailed = failedImages[cat.id] === image;
          return (
            <button
              key={cat.id}
              className="sbc__card"
              onClick={() => handleClick(cat.id)}
              aria-label={`Shop ${meta.label}`}
            >
              <div className={`sbc__card-img${image && !imageFailed ? '' : ' sbc__card-img--empty'}`}>
                {image && !imageFailed && <img
                  src={image}
                  alt=""
                  className="sbc__card-photo"
                  loading="lazy"
                  onError={() => setFailedImages(current => ({ ...current, [cat.id]: image }))}
                />}
                {(!image || imageFailed) && <span className="sbc__card-empty-mark" aria-hidden="true">Z</span>}
              </div>
              <div className="sbc__card-info" style={{ '--sbc-accent': meta.accent }}>
                <span className="sbc__card-label">{meta.label}</span>
                <span className="sbc__card-sub">{meta.sub}</span>
                <span className="sbc__card-cta">Shop Now →</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
