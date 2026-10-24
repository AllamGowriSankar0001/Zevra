import ProductCard from './ProductCard';

export default function Bestsellers({ products, loading, error, onQuickView, onShopAll, onProductClick }) {
  const bestsellers = products.slice(0, 4);
  return (
    <section className="bs" aria-labelledby="bs-title">
      <div className="bs__head container">
        <div className="bs__head-left">
          <h2 className="bs__title" id="bs-title">Bestsellers</h2>
          <p className="bs__sub">The styles worth coming back to.</p>
        </div>
        <button className="bs__view-all btn-secondary" onClick={onShopAll} aria-label="Shop all products">
          Shop All →
        </button>
      </div>

      <div className="bs__grid container">
        {loading ? <p className="storefront-products__message" role="status">Loading the collection…</p>
          : error ? <p className="storefront-products__message" role="alert">{error}</p>
          : bestsellers.length === 0 ? <p className="storefront-products__message">Our first collection is on its way. Please check back soon.</p>
          : bestsellers.map(product => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} onProductClick={onProductClick} />
        ))}
      </div>
    </section>
  );
}
