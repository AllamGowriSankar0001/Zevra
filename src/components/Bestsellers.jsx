import { products } from '../data/products';
import ProductCard from './ProductCard';

// Products marked as bestsellers (last 4 — spread across all categories)
const bestsellers = [products[1], products[3], products[4], products[6]];

export default function Bestsellers({ onQuickView, onShopAll }) {
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
        {bestsellers.map(product => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
    </section>
  );
}
