import { CATEGORIES } from '../data/products';

const CATEGORY_META = {
  shirts:   { label: 'Shirts',    sub: 'Oxford, poplin & beyond',  image: '/images/products/oxford-shirt-1.jpg',     accent: '#3A3028' },
  tshirts:  { label: 'T-Shirts',  sub: 'Everyday essentials',      image: '/images/products/crewneck-tee-1.jpg',     accent: '#283430' },
  jeans:    { label: 'Jeans',     sub: 'Straight, relaxed & raw',  image: '/images/products/straight-denim-1.jpg',   accent: '#282E40' },
  trousers: { label: 'Trousers',  sub: 'Tailored & pleated',       image: '/images/products/tailored-trousers-1.jpg',accent: '#302820' },
};

export default function ShopByCategory({ onCategoryChange }) {
  const cats = CATEGORIES.filter(c => c.id !== 'all');

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
          const meta = CATEGORY_META[cat.id];
          return (
            <button
              key={cat.id}
              className="sbc__card"
              onClick={() => handleClick(cat.id)}
              aria-label={`Shop ${meta.label}`}
            >
              <div className="sbc__card-img">
                <img
                  src={meta.image}
                  alt={meta.label}
                  className="sbc__card-photo"
                  loading="lazy"
                  onError={e => { e.currentTarget.style.opacity = '0'; }}
                />
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
