import ProductCard from './ProductCard';

export default function NewArrivals({ products, loading, error, onQuickView, onViewAll }) {
  const newArrivals = products.slice(0, 4);
  return (
    <section className="na" aria-labelledby="na-title">
      <div className="na__head container">
        <div className="na__head-left">
          <h2 className="na__title" id="na-title">New Arrivals</h2>
          <p className="na__sub">Fresh styles for your everyday wardrobe.</p>
        </div>
        <button className="na__view-all btn-secondary" onClick={onViewAll} aria-label="View all products">
          View All →
        </button>
      </div>

      <div className="na__grid container">
        {loading ? <p className="storefront-products__message" role="status">Loading new arrivals…</p>
          : error ? <p className="storefront-products__message" role="alert">{error}</p>
          : newArrivals.length === 0 ? <p className="storefront-products__message">New styles are coming soon. Stay tuned.</p>
          : newArrivals.map(product => (
          <div key={product.id} className="na__card-wrap">
            <span className="na__badge">New</span>
            <ProductCard product={product} onQuickView={onQuickView} />
          </div>
        ))}
      </div>
    </section>
  );
}
