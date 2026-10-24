import { useState, useMemo, useEffect } from 'react';
import { Search, X, RotateCcw, ChevronDown, SlidersHorizontal, Check } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A–Z' },
];

const PRICE_PRESETS = [
  { id: 'under-1500', label: 'Under ₹1,500', min: 0, max: 1500 },
  { id: '1500-2500',  label: '₹1,500 – ₹2,500', min: 1500, max: 2500 },
  { id: '2500-4000',  label: '₹2,500 – ₹4,000', min: 2500, max: 4000 },
  { id: 'above-4000', label: 'Above ₹4,000', min: 4000, max: Infinity },
];

const DISCOUNT_OPTIONS = [
  { id: '10', label: '10% and above', min: 10 },
  { id: '20', label: '20% and above', min: 20 },
  { id: '30', label: '30% and above', min: 30 },
  { id: '40', label: '40% and above', min: 40 },
  { id: '50', label: '50% and above', min: 50 },
];

const OCCASION_OPTIONS = [
  { id: 'casual',    label: 'Casual Wear', keywords: ['casual', 'daily', 'everyday', 'relaxed', 'tee', 'denim', 'jeans'] },
  { id: 'formal',    label: 'Formal & Office', keywords: ['formal', 'work', 'office', 'shirt', 'trouser', 'tailored', 'blazer', 'oxford'] },
  { id: 'evening',   label: 'Evening & Party', keywords: ['evening', 'party', 'night', 'silk', 'jacket', 'black', 'atelier'] },
  { id: 'lounge',    label: 'Weekend & Lounge', keywords: ['lounge', 'weekend', 'comfort', 'cotton', 'oversized', 'knit'] },
  { id: 'festive',   label: 'Festive & Occasion', keywords: ['festive', 'embroidered', 'kurta', 'ethnic', 'special', 'celebration'] },
];

const DELIVERY_OPTIONS = [
  { id: 'express',  label: 'Express (1–2 Days Delivery)' },
  { id: 'standard', label: 'Standard (3–5 Days Delivery)' },
];

export default function CategoryPage({
  categoryId,
  categories,
  products,
  loading,
  error,
  onQuickView,
  onCategoryChange,
  onProductClick,
}) {
  // Search & Sort
  const [search, setSearch] = useState('');
  const [sort, setSort]     = useState('default');

  // Filter States
  const [selectedSubcats, setSelectedSubcats] = useState([]);
  const [selectedPricePreset, setSelectedPricePreset] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState('');
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState('');

  // Mobile Drawer State
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Accordion open/collapse states (Matching the 7 sections in screenshot)
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    sizes: true,
    discount: false,
    occasion: false,
    color: true,
    delivery: false,
  });

  const meta = categories.find(c => c.id === categoryId) || {};
  const parentCategory = meta.parent ? categories.find(c => c.slug === meta.parent) : null;
  const subcategories = categories.filter(c => c.parent === meta.slug);

  // Slugs that belong to this category (including its subcategories if it's a parent)
  const matchingCategorySlugs = useMemo(() => {
    return [categoryId, ...subcategories.map(s => s.id)];
  }, [categoryId, subcategories]);

  // Reset subcategory selections when categoryId changes
  useEffect(() => {
    setSelectedSubcats([]);
  }, [categoryId]);

  function toggleSection(key) {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleSubcat(subId) {
    setSelectedSubcats(prev =>
      prev.includes(subId) ? prev.filter(id => id !== subId) : [...prev, subId]
    );
  }

  function toggleSize(sz) {
    setSelectedSizes(prev =>
      prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]
    );
  }

  function toggleColor(colName) {
    setSelectedColors(prev =>
      prev.includes(colName) ? prev.filter(c => c !== colName) : [...prev, colName]
    );
  }

  function toggleOccasion(occId) {
    setSelectedOccasions(prev =>
      prev.includes(occId) ? prev.filter(o => o !== occId) : [...prev, occId]
    );
  }

  function handlePricePreset(presetId) {
    if (selectedPricePreset === presetId) {
      setSelectedPricePreset('');
      setMinPrice('');
      setMaxPrice('');
    } else {
      setSelectedPricePreset(presetId);
      const preset = PRICE_PRESETS.find(p => p.id === presetId);
      if (preset) {
        setMinPrice(preset.min ? String(preset.min) : '');
        setMaxPrice(preset.max !== Infinity ? String(preset.max) : '');
      }
    }
  }

  function clearFilters() {
    setSearch('');
    setSelectedSubcats([]);
    setSelectedPricePreset('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedSizes([]);
    setSelectedDiscount('');
    setSelectedOccasions([]);
    setSelectedColors([]);
    setSelectedDelivery('');
    setSort('default');
  }

  const hasFilters = Boolean(
    search.trim() ||
    selectedSubcats.length > 0 ||
    selectedPricePreset ||
    minPrice ||
    maxPrice ||
    selectedSizes.length > 0 ||
    selectedDiscount ||
    selectedOccasions.length > 0 ||
    selectedColors.length > 0 ||
    selectedDelivery ||
    sort !== 'default'
  );

  const activeFilterCount =
    (search.trim() ? 1 : 0) +
    selectedSubcats.length +
    (selectedPricePreset || minPrice || maxPrice ? 1 : 0) +
    selectedSizes.length +
    (selectedDiscount ? 1 : 0) +
    selectedOccasions.length +
    selectedColors.length +
    (selectedDelivery ? 1 : 0);

  // All products belonging to this category hierarchy
  const categoryProductsAll = useMemo(() => {
    return products.filter(product => matchingCategorySlugs.includes(product.category));
  }, [products, matchingCategorySlugs]);

  // Filtered Products
  const categoryProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    const effectiveMin = minPrice ? Number(minPrice) : 0;
    const effectiveMax = maxPrice ? Number(maxPrice) : Infinity;

    const filtered = categoryProductsAll.filter(product => {
      // 1. Category / Subcategory filter
      if (selectedSubcats.length > 0 && !selectedSubcats.includes(product.category)) {
        return false;
      }

      // 2. Search filter
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

      // 3. Price range filter
      if (product.price < effectiveMin || product.price > effectiveMax) {
        return false;
      }

      // 4. Sizes filter (multi-select)
      if (selectedSizes.length > 0) {
        const productSizes = [
          ...(product.sizes || []),
          ...(product.variants || []).map(v => v.size).filter(Boolean),
        ];
        const hasMatchingSize = selectedSizes.some(sz => productSizes.includes(sz));
        if (!hasMatchingSize) return false;
      }

      // 5. Color filter (multi-select)
      if (selectedColors.length > 0) {
        const productColors = [
          ...(product.colours || []).map(c => c.name?.toLowerCase()).filter(Boolean),
          ...(product.variants || []).map(v => v.color?.toLowerCase()).filter(Boolean),
        ];
        const hasMatchingColor = selectedColors.some(col =>
          productColors.includes(col.toLowerCase())
        );
        if (!hasMatchingColor) return false;
      }

      // 6. Discount filter
      if (selectedDiscount) {
        const reqDiscount = Number(selectedDiscount);
        // Estimate product discount (e.g. if price < 2500 or sale) or compare with MRP
        const mrp = product.mrp || product.originalPrice || Math.round(product.price * 1.25);
        const actualDiscount = Math.round(((mrp - product.price) / mrp) * 100);
        if (actualDiscount < reqDiscount) return false;
      }

      // 7. Occasion filter
      if (selectedOccasions.length > 0) {
        const prodText = `${product.name} ${product.description || ''} ${product.category}`.toLowerCase();
        const matchesOccasion = selectedOccasions.some(occId => {
          const occObj = OCCASION_OPTIONS.find(o => o.id === occId);
          return occObj ? occObj.keywords.some(kw => prodText.includes(kw)) : false;
        });
        if (!matchesOccasion) return false;
      }

      // 8. Delivery filter
      if (selectedDelivery === 'express' && (product.stock ?? 0) <= 0) {
        return false;
      }

      return true;
    });

    switch (sort) {
      case 'price-asc':  return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...filtered].sort((a, b) => b.price - a.price);
      case 'name-asc':   return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      default:           return filtered;
    }
  }, [
    categoryProductsAll,
    search,
    selectedSubcats,
    minPrice,
    maxPrice,
    selectedSizes,
    selectedColors,
    selectedDiscount,
    selectedOccasions,
    selectedDelivery,
    sort,
  ]);

  // Distinct sizes & colors available in this category
  const availableSizes = useMemo(() => {
    return [...new Set(categoryProductsAll.flatMap(p => [
      ...(p.sizes || []),
      ...(p.variants || []).map(v => v.size).filter(Boolean),
    ]))].sort();
  }, [categoryProductsAll]);

  const availableColors = useMemo(() => {
    const map = new Map();
    categoryProductsAll.forEach(p => {
      (p.colours || p.colors || []).forEach(c => {
        if (c.name && !map.has(c.name)) {
          map.set(c.name, c.hex || '#000000');
        }
      });
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [categoryProductsAll]);

  const currentTitle = meta.name || meta.label || 'Collection';

  return (
    <div className="cat-page">
      <div className="cat-page__body container">
        {/* ── Top Bar: Title, Piece Count, Inline Search, Sort & Mobile Filters ── */}
        <header className="cat-page__compact-bar">
          <div className="cat-page__heading-group">
            <h1 className="cat-page__compact-title">{currentTitle}</h1>
            <span className="cat-page__count-pill">
              {loading
                ? 'Loading…'
                : `${categoryProducts.length} ${categoryProducts.length === 1 ? 'item' : 'items'}`}
            </span>
          </div>

          <div className="cat-page__toolbar">
            {/* Inline Search Bar */}
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

            {/* Sort Select */}
            <label className="cat-page__filter cat-page__filter--sort">
              <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products">
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Mobile Filter Button */}
            <button
              type="button"
              className="cat-page__mobile-filter-btn"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open filter sidebar"
            >
              <SlidersHorizontal size={14} />
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            </button>
          </div>
        </header>

        {/* ── Active Filter Chips ── */}
        {hasFilters && (
          <div className="cat-page__active-filters">
            <span className="cat-page__active-filters-label">Active:</span>

            {search.trim() && (
              <button className="cat-page__filter-chip" onClick={() => setSearch('')}>
                <span>"{search.trim()}"</span>
                <X size={12} />
              </button>
            )}

            {selectedSubcats.map(subId => {
              const subMeta = categories.find(c => c.id === subId);
              return (
                <button key={subId} className="cat-page__filter-chip" onClick={() => toggleSubcat(subId)}>
                  <span>Category: {subMeta?.label || subId}</span>
                  <X size={12} />
                </button>
              );
            })}

            {(selectedPricePreset || minPrice || maxPrice) && (
              <button
                className="cat-page__filter-chip"
                onClick={() => {
                  setSelectedPricePreset('');
                  setMinPrice('');
                  setMaxPrice('');
                }}
              >
                <span>₹{minPrice || '0'} – ₹{maxPrice || '∞'}</span>
                <X size={12} />
              </button>
            )}

            {selectedSizes.map(sz => (
              <button key={sz} className="cat-page__filter-chip" onClick={() => toggleSize(sz)}>
                <span>Size: {sz}</span>
                <X size={12} />
              </button>
            ))}

            {selectedColors.map(col => (
              <button key={col} className="cat-page__filter-chip" onClick={() => toggleColor(col)}>
                <span>Colour: {col}</span>
                <X size={12} />
              </button>
            ))}

            {selectedDiscount && (
              <button className="cat-page__filter-chip" onClick={() => setSelectedDiscount('')}>
                <span>{selectedDiscount}%+ Off</span>
                <X size={12} />
              </button>
            )}

            {selectedOccasions.map(occId => {
              const occObj = OCCASION_OPTIONS.find(o => o.id === occId);
              return (
                <button key={occId} className="cat-page__filter-chip" onClick={() => toggleOccasion(occId)}>
                  <span>{occObj?.label || occId}</span>
                  <X size={12} />
                </button>
              );
            })}

            {selectedDelivery && (
              <button className="cat-page__filter-chip" onClick={() => setSelectedDelivery('')}>
                <span>Delivery: {selectedDelivery === 'express' ? 'Express' : 'Standard'}</span>
                <X size={12} />
              </button>
            )}

            <button className="cat-page__clear-all-link" onClick={clearFilters}>
              Clear all
            </button>
          </div>
        )}

        {/* ── Main Two-Column Layout: Sidebar Filters + Products Grid ── */}
        <div className="cat-page__content-layout">
          {/* Mobile Drawer Overlay */}
          {mobileDrawerOpen && (
            <div
              className="cat-page__drawer-overlay"
              onClick={() => setMobileDrawerOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* ── Sidebar Filters (Matching The 7 Screenshot Categories) ── */}
          <aside className={`cat-page__sidebar ${mobileDrawerOpen ? 'cat-page__sidebar--open' : ''}`}>
            <div className="cat-page__sidebar-header">
              <span className="cat-page__sidebar-title">Filters</span>
              {activeFilterCount > 0 && (
                <button type="button" className="cat-page__sidebar-clear" onClick={clearFilters}>
                  Clear all ({activeFilterCount})
                </button>
              )}
              <button
                type="button"
                className="cat-page__sidebar-close"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            <div className="cat-filter-accordion">
              {/* 1. CATEGORY */}
              <div className="cat-filter-item">
                <button
                  type="button"
                  className="cat-filter-trigger"
                  onClick={() => toggleSection('category')}
                  aria-expanded={expandedSections.category}
                >
                  <span className="cat-filter-name">Category</span>
                  <ChevronDown
                    size={16}
                    className={`cat-filter-arrow ${expandedSections.category ? 'open' : ''}`}
                  />
                </button>
                {expandedSections.category && (
                  <div className="cat-filter-panel">
                    {subcategories.length > 0 ? (
                      subcategories.map(sub => {
                        const count = categoryProductsAll.filter(p => p.category === sub.id).length;
                        const isChecked = selectedSubcats.includes(sub.id);
                        return (
                          <label key={sub.id} className="cat-filter-option">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSubcat(sub.id)}
                            />
                            <span className="cat-filter-option-label">{sub.label}</span>
                            <span className="cat-filter-option-count">({count})</span>
                          </label>
                        );
                      })
                    ) : (
                      <p className="cat-filter-empty-note">Showing all {meta.label || 'items'}.</p>
                    )}
                  </div>
                )}
              </div>

              {/* 2. PRICE */}
              <div className="cat-filter-item">
                <button
                  type="button"
                  className="cat-filter-trigger"
                  onClick={() => toggleSection('price')}
                  aria-expanded={expandedSections.price}
                >
                  <span className="cat-filter-name">Price</span>
                  <ChevronDown
                    size={16}
                    className={`cat-filter-arrow ${expandedSections.price ? 'open' : ''}`}
                  />
                </button>
                {expandedSections.price && (
                  <div className="cat-filter-panel">
                    <div className="cat-filter-presets">
                      {PRICE_PRESETS.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          className={`cat-filter-preset-btn ${selectedPricePreset === preset.id ? 'active' : ''}`}
                          onClick={() => handlePricePreset(preset.id)}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <div className="cat-filter-custom-price">
                      <span className="cat-filter-custom-label">Custom Range:</span>
                      <div className="cat-filter-inputs-row">
                        <input
                          type="number"
                          placeholder="Min ₹"
                          value={minPrice}
                          onChange={e => {
                            setSelectedPricePreset('');
                            setMinPrice(e.target.value);
                          }}
                        />
                        <span>–</span>
                        <input
                          type="number"
                          placeholder="Max ₹"
                          value={maxPrice}
                          onChange={e => {
                            setSelectedPricePreset('');
                            setMaxPrice(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. SIZES */}
              <div className="cat-filter-item">
                <button
                  type="button"
                  className="cat-filter-trigger"
                  onClick={() => toggleSection('sizes')}
                  aria-expanded={expandedSections.sizes}
                >
                  <span className="cat-filter-name">Sizes</span>
                  <ChevronDown
                    size={16}
                    className={`cat-filter-arrow ${expandedSections.sizes ? 'open' : ''}`}
                  />
                </button>
                {expandedSections.sizes && (
                  <div className="cat-filter-panel">
                    <div className="cat-filter-sizes-grid">
                      {availableSizes.length > 0 ? (
                        availableSizes.map(sz => {
                          const isSelected = selectedSizes.includes(sz);
                          return (
                            <button
                              key={sz}
                              type="button"
                              className={`cat-filter-size-box ${isSelected ? 'active' : ''}`}
                              onClick={() => toggleSize(sz)}
                            >
                              {sz}
                            </button>
                          );
                        })
                      ) : (
                        <span className="cat-filter-empty-note">Standard sizes</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. DISCOUNT */}
              <div className="cat-filter-item">
                <button
                  type="button"
                  className="cat-filter-trigger"
                  onClick={() => toggleSection('discount')}
                  aria-expanded={expandedSections.discount}
                >
                  <span className="cat-filter-name">Discount</span>
                  <ChevronDown
                    size={16}
                    className={`cat-filter-arrow ${expandedSections.discount ? 'open' : ''}`}
                  />
                </button>
                {expandedSections.discount && (
                  <div className="cat-filter-panel">
                    {DISCOUNT_OPTIONS.map(disc => (
                      <label key={disc.id} className="cat-filter-option">
                        <input
                          type="radio"
                          name="cat-discount"
                          checked={selectedDiscount === disc.id}
                          onChange={() => setSelectedDiscount(disc.id)}
                        />
                        <span className="cat-filter-option-label">{disc.label}</span>
                      </label>
                    ))}
                    {selectedDiscount && (
                      <button
                        type="button"
                        className="cat-filter-reset-link"
                        onClick={() => setSelectedDiscount('')}
                      >
                        Reset discount
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 5. OCCASION */}
              <div className="cat-filter-item">
                <button
                  type="button"
                  className="cat-filter-trigger"
                  onClick={() => toggleSection('occasion')}
                  aria-expanded={expandedSections.occasion}
                >
                  <span className="cat-filter-name">Occasion</span>
                  <ChevronDown
                    size={16}
                    className={`cat-filter-arrow ${expandedSections.occasion ? 'open' : ''}`}
                  />
                </button>
                {expandedSections.occasion && (
                  <div className="cat-filter-panel">
                    {OCCASION_OPTIONS.map(occ => {
                      const isChecked = selectedOccasions.includes(occ.id);
                      return (
                        <label key={occ.id} className="cat-filter-option">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleOccasion(occ.id)}
                          />
                          <span className="cat-filter-option-label">{occ.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 6. COLOR */}
              <div className="cat-filter-item">
                <button
                  type="button"
                  className="cat-filter-trigger"
                  onClick={() => toggleSection('color')}
                  aria-expanded={expandedSections.color}
                >
                  <span className="cat-filter-name">Color</span>
                  <ChevronDown
                    size={16}
                    className={`cat-filter-arrow ${expandedSections.color ? 'open' : ''}`}
                  />
                </button>
                {expandedSections.color && (
                  <div className="cat-filter-panel">
                    {availableColors.length > 0 ? (
                      <div className="cat-filter-colors-list">
                        {availableColors.map(col => {
                          const isChecked = selectedColors.includes(col.name);
                          return (
                            <label key={col.name} className="cat-filter-color-row">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleColor(col.name)}
                              />
                              <span
                                className="cat-filter-color-dot"
                                style={{ backgroundColor: col.hex }}
                                aria-hidden="true"
                              />
                              <span className="cat-filter-color-title">{col.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="cat-filter-empty-note">All colours</span>
                    )}
                  </div>
                )}
              </div>

              {/* 7. DELIVERY TIME */}
              <div className="cat-filter-item">
                <button
                  type="button"
                  className="cat-filter-trigger"
                  onClick={() => toggleSection('delivery')}
                  aria-expanded={expandedSections.delivery}
                >
                  <span className="cat-filter-name">Delivery Time</span>
                  <ChevronDown
                    size={16}
                    className={`cat-filter-arrow ${expandedSections.delivery ? 'open' : ''}`}
                  />
                </button>
                {expandedSections.delivery && (
                  <div className="cat-filter-panel">
                    {DELIVERY_OPTIONS.map(del => (
                      <label key={del.id} className="cat-filter-option">
                        <input
                          type="radio"
                          name="cat-delivery"
                          checked={selectedDelivery === del.id}
                          onChange={() => setSelectedDelivery(del.id)}
                        />
                        <span className="cat-filter-option-label">{del.label}</span>
                      </label>
                    ))}
                    {selectedDelivery && (
                      <button
                        type="button"
                        className="cat-filter-reset-link"
                        onClick={() => setSelectedDelivery('')}
                      >
                        Reset delivery
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Apply Button */}
            <div className="cat-page__sidebar-footer">
              <button
                type="button"
                className="btn-primary cat-page__sidebar-apply"
                onClick={() => setMobileDrawerOpen(false)}
              >
                Apply Filters ({categoryProducts.length} items)
              </button>
            </div>
          </aside>

          {/* ── Product Grid Column ── */}
          <main className="cat-page__products-col">
            {loading ? (
              <div className="cat-page__empty" role="status">
                <p className="cat-page__empty-title">Loading the collection…</p>
              </div>
            ) : error ? (
              <div className="cat-page__empty" role="alert">
                <p className="cat-page__empty-title">We couldn’t load this collection.</p>
                <p>{error}</p>
              </div>
            ) : categoryProducts.length === 0 ? (
              <div className="cat-page__empty">
                <span className="cat-page__empty-mark" aria-hidden="true">Z</span>
                <p className="cat-page__empty-title">
                  {search.trim() || hasFilters ? 'No products match your filters' : 'This collection is coming soon.'}
                </p>
                <p>
                  {search.trim() || hasFilters
                    ? 'Try adjusting or clearing your filters to see more pieces.'
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
              <div className="cat-page__products-grid">
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
          </main>
        </div>
      </div>
    </div>
  );
}
