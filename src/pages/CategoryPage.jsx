import { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A–Z' },
];

export default function CategoryPage({ categoryId, categories, products, loading, error, onQuickView, onCategoryChange }) {
  const [sort, setSort] = useState('default');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [failedHeroImages, setFailedHeroImages] = useState({});
  const meta = categories.find(category => category.id === categoryId) || {};
  const hasFilters = Boolean(size || color || minPrice || maxPrice || sort !== 'default');
  const invalidPriceRange = Boolean(minPrice && maxPrice && Number(minPrice) > Number(maxPrice));

  function clearFilters() {
    setSize('');
    setColor('');
    setMinPrice('');
    setMaxPrice('');
    setSort('default');
  }

  const categoryProducts = useMemo(() => {
    const filtered = products.filter(product => {
      if (product.category !== categoryId) return false;
      const productSizes = [...(product.sizes || []), ...(product.variants || []).map(variant => variant.size).filter(Boolean)];
      const productColors = [
        ...(product.colours || []).map(option => option.name).filter(Boolean),
        ...(product.variants || []).map(variant => variant.color).filter(Boolean),
      ];
      if (size && !productSizes.includes(size)) return false;
      if (color && !productColors.includes(color)) return false;
      if (minPrice && product.price < Number(minPrice)) return false;
      if (maxPrice && product.price > Number(maxPrice)) return false;
      return true;
    });
    switch (sort) {
      case 'price-asc':  return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...filtered].sort((a, b) => b.price - a.price);
      case 'name-asc':   return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      default:           return filtered;
    }
  }, [categoryId, color, maxPrice, minPrice, products, size, sort]);

  const otherCategories = categories.filter(category => category.id !== categoryId);
  const categoryProductsAll = products.filter(product => product.category === categoryId);
  const heroImage = [meta.imageUrl, categoryProductsAll[0]?.images?.[0]]
    .find(image => image && failedHeroImages[image] !== true);
  const sizes = [...new Set(categoryProductsAll.flatMap(product => [
    ...(product.sizes || []),
    ...(product.variants || []).map(variant => variant.size).filter(Boolean),
  ]))].sort();
  const colors = [...new Set(categoryProductsAll.flatMap(product => [
    ...(product.colours || []).map(option => option.name).filter(Boolean),
    ...(product.variants || []).map(variant => variant.color).filter(Boolean),
  ]))].sort();

  return (
    <div className="cat-page">
      <ScrollReveal>
      <div className={`cat-page__hero${heroImage ? ' cat-page__hero--has-image' : ''}`}>
        {heroImage && (
          <img
            className="cat-page__hero-image"
            src={heroImage}
            alt=""
            aria-hidden="true"
            onError={() => setFailedHeroImages(current => ({ ...current, [heroImage]: true }))}
          />
        )}
        <div className="cat-page__hero-overlay" />
        <div className="cat-page__hero-content container">
          <p className="cat-page__eyebrow">ZEVRA Collection</p>
          <h1 className="cat-page__title">{meta.name || meta.label}</h1>
          <p className="cat-page__desc">{meta.description}</p>
        </div>
      </div>
      </ScrollReveal>

      {/* Products */}
      <ScrollReveal>
      <div className="cat-page__body container">
        <div className="cat-page__toolbar">
          <p className="cat-page__count">
            {loading ? 'Loading products…' : `${categoryProducts.length} of ${categoryProductsAll.length} products`}
          </p>
          <div className="cat-page__filters" aria-label="Filter products">
            <label className="cat-page__filter">
              <span>Category</span>
              <select value={categoryId} onChange={e => onCategoryChange(e.target.value)}>
                {categories.map(category => <option key={category.id} value={category.id}>{category.label}</option>)}
              </select>
            </label>
            {sizes.length > 0 && <label className="cat-page__filter">
              <span>Size</span>
              <select value={size} onChange={e => setSize(e.target.value)}>
                <option value="">All sizes</option>
                {sizes.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>}
            {colors.length > 0 && <label className="cat-page__filter">
              <span>Colour</span>
              <select value={color} onChange={e => setColor(e.target.value)}>
                <option value="">All colours</option>
                {colors.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>}
            <label className="cat-page__filter cat-page__filter--price">
              <span>Min price</span>
              <input type="number" min="0" inputMode="numeric" value={minPrice} placeholder="₹ Min" onChange={e => setMinPrice(e.target.value)} />
            </label>
            <label className="cat-page__filter cat-page__filter--price">
              <span>Max price</span>
              <input type="number" min="0" inputMode="numeric" value={maxPrice} placeholder="₹ Max" onChange={e => setMaxPrice(e.target.value)} />
            </label>
            <label className="cat-page__filter cat-page__filter--sort">
              <span>Sort by</span>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
            {hasFilters && <button className="cat-page__reset" type="button" onClick={clearFilters}>Clear filters</button>}
          </div>
        </div>

        {loading ? (
          <div className="cat-page__empty" role="status"><p className="cat-page__empty-title">Loading the collection…</p></div>
        ) : error ? (
          <div className="cat-page__empty" role="alert"><p className="cat-page__empty-title">We couldn’t load this collection.</p><p>{error}</p></div>
        ) : invalidPriceRange ? (
          <div className="cat-page__empty" role="alert">
            <p className="cat-page__empty-title">Check your price range.</p>
            <p>The minimum price must not exceed the maximum price.</p>
          </div>
        ) : categoryProducts.length === 0 ? (
          <div className="cat-page__empty">
            <span className="cat-page__empty-mark" aria-hidden="true">Z</span>
            <p className="cat-page__empty-title">This collection is coming soon.</p>
            <p>We’re preparing something special. Please check back soon.</p>
          </div>
        ) : (
          <div className="cat-page__grid">
            {categoryProducts.map(product => (
              <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
            ))}
          </div>
        )}
      </div>
      </ScrollReveal>

      {/* Other categories */}
      <ScrollReveal>
      <div className="cat-page__other">
        <div className="container">
          <p className="cat-page__other-title">Explore More</p>
          <div className="cat-page__other-grid">
            {otherCategories.map(cat => (
              <button
                key={cat.id}
                className="cat-page__other-btn"
                onClick={() => onCategoryChange(cat.id)}
              >
                {cat.label} →
              </button>
            ))}
          </div>
      </div>
      </div>
      </ScrollReveal>
    </div>
  );
}
