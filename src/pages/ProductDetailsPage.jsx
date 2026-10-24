import { useState, useMemo } from 'react';
import { Heart, MapPin, Check, Plus, Minus, X, ArrowLeft, Ruler } from 'lucide-react';
import { formatPrice } from '../data/products';
import { useAuth } from '../hooks/useAuth';
import ProductIllustration from '../components/ProductIllustration';

const DEFAULT_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL'];

export default function ProductDetailsPage({
  product,
  categories = [],
  onCategoryChange,
  onAddToCart,
  onBack,
}) {
  const { user, isInWishlist, toggleWishlist, triggerRequireLogin } = useAuth();

  const [selectedColor, setSelectedColor] = useState(
    product?.colours?.[0]?.name || product?.colors?.[0]?.name || ''
  );
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.[0] || ''
  );
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [pincodeError, setPincodeError] = useState('');
  const [openAccordion, setOpenAccordion] = useState({
    details: true,
    delivery: false,
    contact: false,
  });
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  if (!product) {
    return (
      <div className="pdp-container pdp-empty">
        <p>Product not found.</p>
        <button type="button" className="btn-primary" onClick={onBack}>
          Return to Store
        </button>
      </div>
    );
  }

  const productId = product.id || product._id;
  const wishlisted = isInWishlist(productId);

  // Category metadata
  const categoryMeta = categories.find(c => c.slug === product.category || c.id === product.category);
  const categoryLabel = categoryMeta?.label || categoryMeta?.name || product.category;

  // Images list
  const images = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.map(img => (typeof img === 'string' ? img : img.url)).filter(Boolean);
    }
    return [];
  }, [product.images]);

  // Available colours & sizes
  const colors = product.colours || product.colors || [];
  const sizes = (product.sizes && product.sizes.length > 0) ? product.sizes : DEFAULT_SIZES;

  async function handleToggleWishlist(e) {
    e.stopPropagation();
    if (!user) {
      triggerRequireLogin('Please sign in to save items to your wishlist.', {
        type: 'wishlist',
        productId,
      });
      return;
    }
    try {
      await toggleWishlist(productId);
    } catch {
      // fallback
    }
  }

  function handleCheckPincode(e) {
    e.preventDefault();
    setPincodeError('');
    setPincodeResult(null);

    const clean = pincode.trim();
    if (!clean || !/^\d{6}$/.test(clean)) {
      setPincodeError('Please enter a valid 6-digit postal pincode.');
      return;
    }

    // Estimate delivery in 3-4 days
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 3);
    const dateStr = estDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    });

    setPincodeResult({
      pincode: clean,
      dateStr,
      codAvailable: true,
    });
  }

  function handleAdd() {
    if (!selectedSize) {
      setValidationError('Please select a size before adding to bag.');
      return;
    }
    setValidationError('');

    if (!user) {
      triggerRequireLogin('Please sign in to add items to your shopping bag.', {
        type: 'cart',
        product,
        colour: selectedColor,
        size: selectedSize,
        quantity: 1,
      });
      return;
    }

    onAddToCart?.(product, selectedColor, selectedSize, 1);
    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 2500);
  }

  function toggleSection(key) {
    setOpenAccordion(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="pdp-page">
      {/* ── Breadcrumbs ── */}
      <div className="container">
        <nav className="pdp-breadcrumbs" aria-label="Breadcrumb">
          <button type="button" className="pdp-bc-link" onClick={onBack}>
            Home
          </button>
          <span className="pdp-bc-sep">/</span>
          {categoryLabel && (
            <>
              <button
                type="button"
                className="pdp-bc-link"
                onClick={() => onCategoryChange?.(categoryMeta?.id || product.category)}
              >
                {categoryLabel}
              </button>
              <span className="pdp-bc-sep">/</span>
            </>
          )}
          <span className="pdp-bc-current">{product.name}</span>
        </nav>
      </div>

      {/* ── Main Product Section ── */}
      <div className="container">
        <div className="pdp-layout">
          {/* Left Column: 2-Column Gallery Grid */}
          <div className="pdp-gallery-col">
            {images.length > 0 ? (
              <div className={`pdp-gallery-grid ${images.length === 1 ? 'pdp-gallery-grid--single' : ''}`}>
                {images.map((src, index) => (
                  <div key={index} className="pdp-image-card">
                    <img
                      src={src}
                      alt={`${product.name} view ${index + 1}`}
                      className="pdp-gallery-img"
                      loading={index < 2 ? 'eager' : 'lazy'}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="pdp-image-card pdp-image-card--illustration">
                <ProductIllustration
                  productId={product.id}
                  alt={product.name}
                  className="product-card__img product-card__illustration"
                />
              </div>
            )}
          </div>

          {/* Right Column: Sticky Product Info */}
          <div className="pdp-info-col">
            <div className="pdp-info-sticky">
              {/* Title & Wishlist Header */}
              <div className="pdp-header-row">
                <h1 className="pdp-title">{product.name}</h1>
                <button
                  type="button"
                  className={`pdp-wishlist-btn${wishlisted ? ' pdp-wishlist-btn--active' : ''}`}
                  onClick={handleToggleWishlist}
                  title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart
                    size={22}
                    fill={wishlisted ? '#B91C1C' : 'none'}
                    color={wishlisted ? '#B91C1C' : '#222222'}
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              {/* Price */}
              <div className="pdp-price-row">
                <span className="pdp-price">{formatPrice(product.price)}</span>
                <span className="pdp-mrp-tag">MRP incl. of all taxes</span>
              </div>

              <hr className="pdp-divider" />

              {/* Color Selector */}
              {colors.length > 0 && (
                <div className="pdp-section">
                  <div className="pdp-section-header">
                    <span className="pdp-section-label">Color</span>
                    {selectedColor && <span className="pdp-section-selected">{selectedColor}</span>}
                  </div>
                  <div className="pdp-colors-list">
                    {colors.map(col => (
                      <button
                        key={col.name}
                        type="button"
                        className={`pdp-color-swatch${selectedColor === col.name ? ' active' : ''}`}
                        style={{ backgroundColor: col.hex }}
                        onClick={() => setSelectedColor(col.name)}
                        title={col.name}
                        aria-label={`Color: ${col.name}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector + Size Guide */}
              <div className="pdp-section">
                <div className="pdp-section-header">
                  <span className="pdp-section-label">Size</span>
                  <button
                    type="button"
                    className="pdp-size-guide-btn"
                    onClick={() => setShowSizeGuide(true)}
                  >
                    Size Guide
                  </button>
                </div>
                <div className="pdp-sizes-list" role="group" aria-label="Select size">
                  {sizes.map(sz => (
                    <button
                      key={sz}
                      type="button"
                      className={`pdp-size-pill${selectedSize === sz ? ' active' : ''}`}
                      onClick={() => {
                        setSelectedSize(sz);
                        setValidationError('');
                      }}
                      aria-pressed={selectedSize === sz}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                {validationError && (
                  <p className="pdp-validation-error" role="alert">
                    {validationError}
                  </p>
                )}
              </div>

              <hr className="pdp-divider" />

              {/* Pincode Delivery Check */}
              <div className="pdp-pincode-section">
                <label htmlFor="pdp-pincode-input" className="pdp-pincode-title">
                  Enter Pincode To Check Delivery Date
                </label>
                <form className="pdp-pincode-form" onSubmit={handleCheckPincode}>
                  <div className="pdp-pincode-input-wrap">
                    <MapPin size={16} className="pdp-pincode-icon" aria-hidden="true" />
                    <input
                      id="pdp-pincode-input"
                      type="text"
                      maxLength={6}
                      inputMode="numeric"
                      value={pincode}
                      onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter your shipping pincode"
                      className="pdp-pincode-input"
                    />
                  </div>
                  <button type="submit" className="pdp-pincode-btn">
                    Check
                  </button>
                </form>

                {pincodeError && (
                  <p className="pdp-pincode-msg pdp-pincode-msg--error">{pincodeError}</p>
                )}
                {pincodeResult && (
                  <div className="pdp-pincode-msg pdp-pincode-msg--success">
                    <Check size={14} />
                    <span>
                      Delivery by <strong>{pincodeResult.dateStr}</strong> | Free Delivery
                    </span>
                  </div>
                )}
              </div>

              {/* Add to Bag Button */}
              <div className="pdp-action-wrap">
                <button
                  type="button"
                  className="btn-primary pdp-add-bag-btn"
                  onClick={handleAdd}
                >
                  Add to Bag
                </button>
                {addSuccess && (
                  <p className="pdp-success-toast">
                    <Check size={15} /> Added to your shopping bag.
                  </p>
                )}
              </div>

              {/* Accordions */}
              <div className="pdp-accordions">
                {/* 1. Product Details and Overview */}
                <div className="pdp-accordion-item">
                  <button
                    type="button"
                    className="pdp-accordion-trigger"
                    onClick={() => toggleSection('details')}
                    aria-expanded={openAccordion.details}
                  >
                    <span>Product Details and Overview</span>
                    {openAccordion.details ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                  {openAccordion.details && (
                    <div className="pdp-accordion-content">
                      <p>{product.description || 'Crafted with premium materials for effortless, enduring elegance.'}</p>
                      <ul className="pdp-details-list">
                        <li><strong>Fabric & Composition:</strong> Premium natural weave blend</li>
                        <li><strong>Fit:</strong> Tailored contemporary silhouette</li>
                        <li><strong>Care Instructions:</strong> Dry clean recommended or gentle cold hand wash</li>
                        <li><strong>Origin:</strong> Made with meticulous craftsmanship</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* 2. Delivery & Return */}
                <div className="pdp-accordion-item">
                  <button
                    type="button"
                    className="pdp-accordion-trigger"
                    onClick={() => toggleSection('delivery')}
                    aria-expanded={openAccordion.delivery}
                  >
                    <span>Delivery & Return</span>
                    {openAccordion.delivery ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                  {openAccordion.delivery && (
                    <div className="pdp-accordion-content">
                      <p>• Complimentary standard doorstep shipping on all prepaid orders.</p>
                      <p>• Estimated delivery: 3 to 5 business days across metro cities.</p>
                      <p>• 7-day hassle-free return and exchange policy from date of delivery.</p>
                      <p>• Items must be unworn, undamaged, with original tags intact.</p>
                    </div>
                  )}
                </div>

                {/* 3. Contact Us */}
                <div className="pdp-accordion-item">
                  <button
                    type="button"
                    className="pdp-accordion-trigger"
                    onClick={() => toggleSection('contact')}
                    aria-expanded={openAccordion.contact}
                  >
                    <span>Contact Us</span>
                    {openAccordion.contact ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                  {openAccordion.contact && (
                    <div className="pdp-accordion-content">
                      <p>Have questions about sizing, styling, or delivery?</p>
                      <p>• Concierge Email: <strong>concierge@zevra.com</strong></p>
                      <p>• Customer Care: <strong>+91 (0) 80 4567 8900</strong></p>
                      <p>• Support Hours: Monday to Saturday, 10:00 AM – 7:00 PM IST</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Size Guide Modal ── */}
      {showSizeGuide && (
        <div className="pdp-modal-overlay" onClick={() => setShowSizeGuide(false)}>
          <div className="pdp-modal" onClick={e => e.stopPropagation()}>
            <div className="pdp-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Ruler size={18} />
                <h3 className="pdp-modal-title">Size Guide</h3>
              </div>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowSizeGuide(false)}
                aria-label="Close size guide"
              >
                <X size={20} />
              </button>
            </div>
            <div className="pdp-modal-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', marginBottom: '1rem' }}>
                All measurements are provided in inches. For a relaxed fit, we suggest choosing your true size.
              </p>
              <table className="pdp-size-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Bust / Chest</th>
                    <th>Waist</th>
                    <th>Hips</th>
                    <th>Length</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>XXS</strong></td>
                    <td>32"</td>
                    <td>26"</td>
                    <td>35"</td>
                    <td>27"</td>
                  </tr>
                  <tr>
                    <td><strong>XS</strong></td>
                    <td>34"</td>
                    <td>28"</td>
                    <td>37"</td>
                    <td>27.5"</td>
                  </tr>
                  <tr>
                    <td><strong>S</strong></td>
                    <td>36"</td>
                    <td>30"</td>
                    <td>39"</td>
                    <td>28"</td>
                  </tr>
                  <tr>
                    <td><strong>M</strong></td>
                    <td>38"</td>
                    <td>32"</td>
                    <td>41"</td>
                    <td>28.5"</td>
                  </tr>
                  <tr>
                    <td><strong>L</strong></td>
                    <td>40"</td>
                    <td>34"</td>
                    <td>43"</td>
                    <td>29"</td>
                  </tr>
                  <tr>
                    <td><strong>XL</strong></td>
                    <td>42"</td>
                    <td>36"</td>
                    <td>45"</td>
                    <td>29.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

