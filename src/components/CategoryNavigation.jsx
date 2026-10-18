// Duplicate enough times to fill the scroll seamlessly
const REPEAT = 6;

export default function CategoryNavigation({ categories = [], activeCategory, onCategoryChange }) {
  const cats = categories;
  const ticker = Array.from({ length: REPEAT }, () => cats).flat();
  function handleClick(id) {
    onCategoryChange(id);
    const el = document.getElementById('collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <nav className="category-nav" aria-label="Shop by category">
      {/* Accessible static buttons (screen readers) */}
      <div className="category-nav__sr" aria-hidden="false">
        {cats.map(cat => (
          <button
            key={cat.id}
            className="sr-only"
            onClick={() => handleClick(cat.id)}
            aria-pressed={activeCategory === cat.id}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Infinite scroll ticker */}
      <div className="category-nav__track" aria-hidden="true">
        <div className="category-nav__belt">
          {ticker.map((cat, i) => (
            <button
              key={i}
              className={`category-nav__item${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => handleClick(cat.id)}
              tabIndex={-1}
            >
              <span className="category-nav__dot" />
              <span className="category-nav__label">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
