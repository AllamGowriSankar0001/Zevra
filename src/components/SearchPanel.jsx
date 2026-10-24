import { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import ProductCard from './ProductCard';

export default function SearchPanel({ products, loading, error, onClose, onQuickView, onProductClick }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Escape to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const q = query.trim().toLowerCase();
  const results = q
    ? products.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
    : [];

  return (
    <div
      className="search-panel"
      role="search"
      aria-label="Search products"
    >
      <div className="search-panel__inner">
        <Search size={18} strokeWidth={1.5} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} aria-hidden="true" />
        <div className="search-panel__input-wrap">
          <input
            ref={inputRef}
            type="search"
            className="search-panel__input"
            placeholder="Search shirts, tees, jeans, trousers…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
            autoComplete="off"
          />
          {query && (
            <button
              className="search-panel__clear btn-ghost"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              aria-label="Clear search"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          )}
        </div>
        <button
          className="search-panel__close btn-ghost"
          onClick={onClose}
          aria-label="Close search"
        >
          Close
        </button>
      </div>

      {/* Results */}
      {q && (
        <div className="search-results">
          <p className="search-results__count" aria-live="polite">
            {loading ? 'Loading products…' : error ? 'Products unavailable' : results.length === 0
              ? 'No results'
              : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
          </p>

          {error ? <p className="search-results__empty" role="alert">{error}</p> : loading ? null : results.length > 0 ? (
            <div className="search-results__grid" role="list">
              {results.map(p => (
                <div key={p.id} role="listitem">
                  <ProductCard
                    product={p}
                    onQuickView={(product, trigger) => {
                      onClose();
                      onQuickView(product, trigger);
                    }}
                    onProductClick={(product) => {
                      onClose();
                      onProductClick?.(product);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="search-results__empty">
              {products.length === 0 ? 'Our collection is coming soon. Please check back later.' : `No products match "${query}".`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
