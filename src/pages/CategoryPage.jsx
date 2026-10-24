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
  const parentCategory = meta.parent ? categories.find(c => c.slug === meta.parent) : null;
  const subcategories = categories.filter(c => c.parent === meta.slug);

  // Slugs that belong to this category (including its subcategories if it's a parent)
  const matchingCategorySlugs = useMemo(() => {
    return [categoryId, ...subcategories.map(s => s.id)];
  }, [categoryId, subcategories]);

  const hasFilters = Boolean(size || color || minPrice || maxPrice || sort !== 'default');
  const invalidPriceRange = Boolean(minPrice && maxPrice && Number(minPrice) > Number(maxPrice));

  function clearFilters() {
    setSize('');
    setColor('');
    setMinPrice('');
    setMaxPrice('');
    setSort('default');
  }

  const categoryProductsAll = useMemo(() => {
    return products.filter(product => matchingCategorySlugs.includes(product.category));
  }, [products, matchingCategorySlugs]);

  const categoryProducts = useMemo(() => {
    const filtered = categoryProductsAll.filter(product => {
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
  }, [categoryProductsAll, color, maxPrice, minPrice, size, sort]);

  const otherCategories = categories.filter(category => category.id !== categoryId && (!category.parent || category.parent !== meta.parent));

  // Determine hero visual image
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
      {/* ── Modern Luxury Editorial Hero ── */}
      <ScrollReveal>
        <div className="cat-page__hero">
          <div className="cat-page__hero-overlay" />
          <div className="cat-page__hero-container container">
            <div className="cat-page__hero-main">
              {/* Breadcrumbs */}
              <nav className="cat-page__breadcrumbs" aria-label="Breadcrumb">
                <span>ZEVRA</span>
                <span className="cat-page__bc-sep">/</span>
                <span>COLLECTION</span>
                {parentCategory && (
                  <>
                    <span className="cat-page__bc-sep">/</span>
                    <button
                      type="button"
                      className="cat-page__bc-link"
                      onClick={() => onCategoryChange(parentCategory.id)}
                    >
                      {parentCategory.label}
                    </button>
                  </>
                )}
                <span className="cat-page__bc-sep">/</span>
                <span className="cat-page__bc-current">{meta.name || meta.label}</span>
              </nav>

              <p className="cat-page__eyebrow">Atelier Ready-To-Wear</p>
              <h1 className="cat-page__title">{meta.name || meta.label}</h1>
              {meta.description && <p className="cat-page__desc">{meta.description}</p>}

              {/* Subcategory quick-switch pills */}
              {(subcategories.length > 0 || parentCategory) && (
                <div className="cat-page__subcat-nav">
                  <span className="cat-page__subcat-label">Explore:</span>
                  <div className="cat-page__subcat-pills">
                    {/* Parent Pill */}
                    {parentCategory ? (
                      <button
                        type="button"
                        className="cat-page__subcat-pill"
                        onClick={() => onCategoryChange(parentCategory.id)}
                      >
                        All {parentCategory.label}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="cat-page__subcat-pill cat-page__subcat-pill--active"
                        onClick={() => onCategoryChange(meta.id)}
                      >
                        All {meta.label}
                      </button>
                    )}

                    {/* Subcategory pills */}
                    {(parentCategory ? categories.filter(c => c.parent === parentCategory.slug) : subcategories).map(sub => (
                      <button
                        key={sub.id}
                        type="button"
                        className={`cat-page__subcat-pill${sub.id === categoryId ? ' cat-page__subcat-pill--active' : ''}`}
                        onClick={() => onCategoryChange(sub.id)}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Framed Editorial Visual Card (Tastefully sized, NEVER stretched across full width) */}
            {heroImage && (
              <div className="cat-page__hero-media">
                <div className="cat-page__hero-frame">
                  <img
                    className="cat-page__hero-card-img"
                    src={heroImage}
                    alt={meta.name || meta.label}
                    onError={() => setFailedHeroImages(current => ({ ...current, [heroImage]: true }))}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* ── Products & Toolbar ── */}
      <ScrollReveal>
        <div className="cat-page__body container">
          <div className="cat-page__toolbar">
            <p className="cat-page__count">
              {loading ? 'Loading products…' : `${categoryProducts.length} of ${categoryProductsAll.length} curated pieces`}
            </p>
            <div className="cat-page__filters" aria-label="Filter products">
              <label className="cat-page__filter">
                <span>Category</span>
                <select value={categoryId} onChange={e => onCategoryChange(e.target.value)}>
                  {categories.map(category => {
                    const parent = category.parent ? categories.find(p => p.slug === category.parent) : null;
                    return (
                      <option key={category.id} value={category.id}>
                        {parent ? `${parent.label} › ${category.label}` : category.label}
                      </option>
                    );
                  })}
                </select>
              </label>
              {sizes.length > 0 && (
                <label className="cat-page__filter">
                  <span>Size</span>
                  <select value={size} onChange={e => setSize(e.target.value)}>
                    <option value="">All sizes</option>
                    {sizes.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
              )}
              {colors.length > 0 && (
                <label className="cat-page__filter">
                  <span>Colour</span>
                  <select value={color} onChange={e => setColor(e.target.value)}>
                    <option value="">All colours</option>
                    {colors.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
              )}
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

      {/* ── Other Categories ── */}
      {otherCategories.length > 0 && (
        <ScrollReveal>
          <div className="cat-page__other">
            <div className="container">
              <p className="cat-page__other-title">Explore Other Collections</p>
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
      )}
    </div>
  );
}
