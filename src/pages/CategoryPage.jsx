import { useState, useMemo } from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A–Z' },
];

export default function CategoryPage({ categoryId, categories, products, loading, error, onQuickView, onCategoryChange }) {
  const [search, setSearch]     = useState('');
  const [sort, setSort]         = useState('default');
  const [size, setSize]         = useState('');
  const [color, setColor]       = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const meta = categories.find(category => category.id === categoryId) || {};
  const parentCategory = meta.parent ? categories.find(c => c.slug === meta.parent) : null;
  const subcategories = categories.filter(c => c.parent === meta.slug);

  // Slugs that belong to this category (including its subcategories if it's a parent)
  const matchingCategorySlugs = useMemo(() => {
    return [categoryId, ...subcategories.map(s => s.id)];
  }, [categoryId, subcategories]);

  const hasFilters = Boolean(search.trim() || size || color || minPrice || maxPrice || sort !== 'default');
  const invalidPriceRange = Boolean(minPrice && maxPrice && Number(minPrice) > Number(maxPrice));

  function clearFilters() {
    setSearch('');
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
    const term = search.trim().toLowerCase();

    const filtered = categoryProductsAll.filter(product => {
      // 1. Search text filter
      if (term) {
        const nameMatch = (product.name || '').toLowerCase().includes(term);
        const descMatch = (product.description || '').toLowerCase().includes(term);
        const catMatch  = (product.category || '').toLowerCase().includes(term);
        const colorMatch = [
          ...(product.colours || []).map(c => c.name || ''),
          ...(product.variants || []).map(v => v.color || ''),
        ].some(c => c.toLowerCase().includes(term));
        const sizeMatch = [
          ...(product.sizes || []),
          ...(product.variants || []).map(v => v.size || ''),
        ].some(s => s.toLowerCase().includes(term));

        if (!nameMatch && !descMatch && !catMatch && !colorMatch && !sizeMatch) return false;
      }

      // 2. Size filter
      const productSizes = [...(product.sizes || []), ...(product.variants || []).map(variant => variant.size).filter(Boolean)];
      if (size && !productSizes.includes(size)) return false;

      // 3. Color filter
      const productColors = [
        ...(product.colours || []).map(option => option.name).filter(Boolean),
        ...(product.variants || []).map(variant => variant.color).filter(Boolean),
      ];
      if (color && !productColors.includes(color)) return false;

      // 4. Price range filter
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
  }, [categoryProductsAll, search, color, maxPrice, minPrice, size, sort]);

  const otherCategories = categories.filter(category => category.id !== categoryId && (!category.parent || category.parent !== meta.parent));

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
      {/* ── Seamless Luxury Editorial Header (No Dark Banner) ── */}
      <ScrollReveal>
        <header className="cat-page__header container">
          {/* Breadcrumbs */}
          <nav className="cat-page__breadcrumbs" aria-label="Breadcrumb">
            <button
              type="button"
              className="cat-page__bc-link"
              onClick={() => onCategoryChange('all')}
            >
              Home
            </button>
            <span className="cat-page__bc-sep">/</span>
            <span>Collections</span>
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

          <div className="cat-page__header-main">
            <span className="cat-page__eyebrow">Atelier Collection</span>
            <h1 className="cat-page__title">{meta.name || meta.label}</h1>
            {meta.description && <p className="cat-page__desc">{meta.description}</p>}

            {/* Subcategory Pills */}
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

                  {/* Subcategories */}
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
        </header>
      </ScrollReveal>

      {/* ── Products & Search Toolbar ── */}
      <ScrollReveal>
        <div className="cat-page__body container">
          <div className="cat-page__toolbar">
            <div className="cat-page__toolbar-left">
              {/* Product Search Input */}
              <div className="cat-page__search-wrap">
                <Search size={15} className="cat-page__search-icon" aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={`Search in ${meta.name || meta.label || 'collection'}…`}
                  className="cat-page__search-input"
                  aria-label={`Search in ${meta.name || meta.label || 'collection'}`}
                />
                {search && (
                  <button
                    type="button"
                    className="cat-page__search-clear"
                    onClick={() => setSearch('')}
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <span className="cat-page__count">
                {loading
                  ? 'Loading…'
                  : search.trim()
                    ? `${categoryProducts.length} ${categoryProducts.length === 1 ? 'result' : 'results'} for "${search.trim()}"`
                    : `${categoryProducts.length} ${categoryProducts.length === 1 ? 'piece' : 'pieces'}`}
              </span>
            </div>

            <div className="cat-page__filters" aria-label="Filter products">
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
                <span>Min ₹</span>
                <input type="number" min="0" inputMode="numeric" value={minPrice} placeholder="Min" onChange={e => setMinPrice(e.target.value)} />
              </label>

              <label className="cat-page__filter cat-page__filter--price">
                <span>Max ₹</span>
                <input type="number" min="0" inputMode="numeric" value={maxPrice} placeholder="Max" onChange={e => setMaxPrice(e.target.value)} />
              </label>

              <label className="cat-page__filter cat-page__filter--sort">
                <span>Sort</span>
                <select value={sort} onChange={e => setSort(e.target.value)}>
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>

              {hasFilters && (
                <button className="cat-page__reset" type="button" onClick={clearFilters}>
                  <RotateCcw size={12} style={{ marginRight: '4px' }} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasFilters && (
            <div className="cat-page__active-filters">
              <span className="cat-page__active-filters-label">Active:</span>
              {search.trim() && (
                <button className="cat-page__filter-chip" onClick={() => setSearch('')}>
                  <span>Search: "{search.trim()}"</span>
                  <X size={12} />
                </button>
              )}
              {size && (
                <button className="cat-page__filter-chip" onClick={() => setSize('')}>
                  <span>Size: {size}</span>
                  <X size={12} />
                </button>
              )}
              {color && (
                <button className="cat-page__filter-chip" onClick={() => setColor('')}>
                  <span>Colour: {color}</span>
                  <X size={12} />
                </button>
              )}
              {(minPrice || maxPrice) && (
                <button className="cat-page__filter-chip" onClick={() => { setMinPrice(''); setMaxPrice(''); }}>
                  <span>Price: ₹{minPrice || '0'} – ₹{maxPrice || '∞'}</span>
                  <X size={12} />
                </button>
              )}
              <button className="cat-page__clear-all-link" onClick={clearFilters}>
                Clear all
              </button>
            </div>
          )}

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
              <p className="cat-page__empty-title">
                {search.trim() ? `No products match "${search.trim()}"` : 'This collection is coming soon.'}
              </p>
              <p>
                {search.trim()
                  ? 'Try checking for spelling errors or clearing filters to see more pieces.'
                  : 'We’re preparing something special. Please check back soon.'}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ marginTop: '1.25rem', minHeight: '38px' }}
                  onClick={clearFilters}
                >
                  Clear all filters
                </button>
              )}
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
