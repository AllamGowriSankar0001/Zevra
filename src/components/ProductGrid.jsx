import ProductCard from './ProductCard';

export default function ProductGrid({ categories, products, loading, error, activeCategory, onCategoryChange, onQuickView, onProductClick }) {
  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter(p => p.category === activeCategory);

  // When category changes from outside (e.g. header nav), don't auto-scroll
  // — the Header already handles scrollIntoView. We just filter.

  return (
    <section className="product-section" id="collection" aria-labelledby="collection-title">
      <div className="product-section__head">
        <h2 className="product-section__title" id="collection-title">New in Rotation</h2>
        <p className="product-section__sub">Explore shirts, tees, denim and trousers.</p>

        {/* Filters */}
        <div className="product-section__filters" role="group" aria-label="Filter by category">
          <button
            className={`product-filter-btn${activeCategory === 'all' ? ' active' : ''}`}
            onClick={() => onCategoryChange('all')}
            aria-pressed={activeCategory === 'all'}
          >
            All
          </button>
          {(categories || []).map(cat => (
            <button
              key={cat.id}
              className={`product-filter-btn${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => onCategoryChange(cat.id)}
              aria-pressed={activeCategory === cat.id}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="product-grid"
        role="list"
        aria-label={`Product grid — ${filtered.length} item${filtered.length !== 1 ? 's' : ''}`}
      >
        {loading ? (
          <p className="product-grid__empty" role="status">Loading the collection…</p>
        ) : error ? (
          <p className="product-grid__empty" role="alert">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="product-grid__empty" role="listitem">
            The collection is coming soon. Check back for new arrivals.
          </p>
        ) : (
          filtered.map(product => (
            <div key={product.id} role="listitem">
              <ProductCard
                product={product}
                onQuickView={onQuickView}
                onProductClick={onProductClick}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
