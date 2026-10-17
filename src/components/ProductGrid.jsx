import { useState, useEffect, useRef } from 'react';
import { products, CATEGORIES } from '../data/products';
import ProductCard from './ProductCard';

export default function ProductGrid({ activeCategory, onCategoryChange, onQuickView }) {
  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter(p => p.category === activeCategory);

  const sectionRef = useRef(null);

  // When category changes from outside (e.g. header nav), don't auto-scroll
  // — the Header already handles scrollIntoView. We just filter.

  return (
    <section className="product-section" id="collection" ref={sectionRef} aria-labelledby="collection-title">
      <div className="product-section__head">
        <h2 className="product-section__title" id="collection-title">New in Rotation</h2>
        <p className="product-section__sub">Explore shirts, tees, denim and trousers.</p>

        {/* Filters */}
        <div className="product-section__filters" role="group" aria-label="Filter by category">
          {CATEGORIES.map(cat => (
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
        {filtered.length === 0 ? (
          <p className="product-grid__empty" role="listitem">
            No items in this category yet.
          </p>
        ) : (
          filtered.map(product => (
            <div key={product.id} role="listitem">
              <ProductCard
                product={product}
                onQuickView={onQuickView}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
