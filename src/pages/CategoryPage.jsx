import { useState, useMemo } from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A–Z' },
];

export default function CategoryPage({ categoryId, categories, products, loading, error, onQuickView, onCategoryChange, onProductClick }) {
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

  const sizes = [...new Set(categoryProductsAll.flatMap(product => [
    ...(product.sizes || []),
    ...(product.variants || []).map(variant => variant.size).filter(Boolean),
  ]))].sort();

  const colors = [...new Set(categoryProductsAll.flatMap(product => [
    ...(product.colours || []).map(option => option.name).filter(Boolean),
    ...(product.variants || []).map(variant => variant.color).filter(Boolean),
  ]))].sort();

  const currentTitle = meta.name || meta.label || 'Collection';

  return (
    <div className="cat-page">
      {/* ── Streamlined Luxury Category Header (Zero Wasted Space) ── */}
      <div className="cat-page__body container">
        <header className="cat-page__compact-bar">
          <div className="cat-page__heading-group">
            <h1 className="cat-page__compact-title">{currentTitle}</h1>
            <span className="cat-page__count-pill">
              {loading
                ? 'Loading…'
                : `${categoryProducts.length} ${categoryProducts.length === 1 ? 'item' : 'items'}`}
            </span>

            {/* Subcategory Pills inline */}
            {(subcategories.length > 0 || parentCategory) && (
              <div className="cat-page__subcat-pills-inline">
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
            )}
          </div>

          {/* Search & Filter Toolbar */}
          <div className="cat-page__toolbar">
            <div className="cat-page__search-wrap">
              <Search size={15} className="cat-page__search-icon" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search ${currentTitle.toLowerCase()}…`}
                className="cat-page__search-input"
                aria-label={`Search in ${currentTitle}`}
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

            <div className="cat-page__filters" aria-label="Filter products">
              {sizes.length > 0 && (
                <label className="cat-page__filter">
                  <select value={size} onChange={e => setSize(e.target.value)}>
                    <option value="">Size: All</option>
                    {sizes.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
              )}

              {colors.length > 0 && (
                <label className="cat-page__filter">
                  <select value={color} onChange={e => setColor(e.target.value)}>
                    <option value="">Colour: All</option>
                    {colors.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
              )}

              <div className="cat-page__price-range">
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={minPrice}
                  placeholder="Min ₹"
                  className="cat-page__price-input"
                  onChange={e => setMinPrice(e.target.value)}
                  aria-label="Minimum price in rupees"
                />
                <span className="cat-page__price-sep">–</span>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={maxPrice}
                  placeholder="Max ₹"
                  className="cat-page__price-input"
                  onChange={e => setMaxPrice(e.target.value)}
                  aria-label="Maximum price in rupees"
                />
              </div>

              <label className="cat-page__filter cat-page__filter--sort">
                <select value={sort} onChange={e => setSort(e.target.value)}>
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>

              {hasFilters && (
                <button className="cat-page__reset" type="button" onClick={clearFilters} title="Reset all filters">
                  <RotateCcw size={13} style={{ marginRight: '4px' }} />
                  Reset
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Active Filter Chips */}
        {hasFilters && (
          <div className="cat-page__active-filters">
            <span className="cat-page__active-filters-label">Active:</span>
            {search.trim() && (
              <button className="cat-page__filter-chip" onClick={() => setSearch('')}>
                <span>"{search.trim()}"</span>
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
                <span>₹{minPrice || '0'} – ₹{maxPrice || '∞'}</span>
                <X size={12} />
              </button>
            )}
            {sort !== 'default' && (
              <button className="cat-page__filter-chip" onClick={() => setSort('default')}>
                <span>Sort: {SORT_OPTIONS.find(o => o.value === sort)?.label}</span>
                <X size={12} />
              </button>
            )}
            <button className="cat-page__clear-all-link" onClick={clearFilters}>
              Clear all
            </button>
          </div>
        )}

        {/* ── Product Grid ── */}
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
              <ProductCard
                key={product.id || product._id}
                product={product}
                onQuickView={onQuickView}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
