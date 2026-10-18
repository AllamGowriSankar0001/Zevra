import { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { formatPrice } from '../data/products';
import ProductIllustration from './ProductIllustration';

export default function ProductQuickView({ product, onClose, onAddToCart, triggerRef }) {
  const colours = product.colours || [];
  const sizes = product.sizes || [];
  const [selectedColour, setSelectedColour] = useState(null);
  const [selectedSize,   setSelectedSize]   = useState(null);
  const [quantity, setQuantity]             = useState(1);
  const [error, setError]                   = useState('');
  const [success, setSuccess]               = useState(false);
  const [imgError, setImgError]             = useState(false);

  const dialogRef = useRef(null);
  const closeRef  = useRef(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Focus close button on open
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Trap focus inside dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const els = () => [...dialog.querySelectorAll(focusable)].filter(el => !el.disabled);

    function handleKeyDown(e) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const list = els();
      if (!list.length) return;
      const first = list[0];
      const last  = list[list.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    }
    dialog.addEventListener('keydown', handleKeyDown);
    return () => dialog.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Return focus when closed
  useEffect(() => {
    return () => { if (triggerRef) triggerRef.focus?.(); };
  }, [triggerRef]);

  function handleAdd() {
    if (colours.length > 0 && !selectedColour) { setError('Please select a colour.'); return; }
    if (sizes.length > 0 && !selectedSize) { setError('Please select a size.'); return; }
    setError('');
    onAddToCart(product, selectedColour || '', selectedSize || '', quantity);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2800);
  }

  const primarySrc     = product.images[0];
  const showRealImage  = primarySrc && !imgError;

  return (
    <div
      className="quick-view-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qv-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="quick-view" ref={dialogRef}>
        {/* Close */}
        <button
          ref={closeRef}
          className="quick-view__close btn-ghost"
          onClick={onClose}
          aria-label="Close quick view"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {/* Image */}
        <div className="quick-view__image-side" aria-hidden="true">
          {showRealImage ? (
            <img
              src={primarySrc}
              alt={product.name}
              loading="eager"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{ width: '100%', height: '100%' }}>
              <ProductIllustration
                productId={product.id}
                alt={product.name}
                className="quick-view__illustration"
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="quick-view__info">
          <div>
            <h2 className="quick-view__name" id="qv-title">{product.name}</h2>
            <p className="quick-view__price">{formatPrice(product.price)}</p>
          </div>

          {/* Colours */}
          {colours.length > 0 && <div>
            <p className="quick-view__section-label">
              Colour{selectedColour ? ` — ${selectedColour}` : ''}
            </p>
            <div className="quick-view__colours" role="group" aria-label="Select colour">
              {colours.map(c => (
                <button
                  key={c.name}
                  className={`quick-view__colour-btn${selectedColour === c.name ? ' selected' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => { setSelectedColour(c.name); setError(''); }}
                  aria-label={c.name}
                  aria-pressed={selectedColour === c.name}
                  title={c.name}
                />
              ))}
            </div>
          </div>}

          {/* Sizes */}
          {sizes.length > 0 && <div>
            <p className="quick-view__section-label">Size</p>
            <div className="quick-view__sizes" role="group" aria-label="Select size">
              {sizes.map(sz => (
                <button
                  key={sz}
                  className={`quick-view__size-btn${selectedSize === sz ? ' selected' : ''}`}
                  onClick={() => { setSelectedSize(sz); setError(''); }}
                  aria-pressed={selectedSize === sz}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>}

          {/* Validation */}
          {error && (
            <p className="quick-view__validation" role="alert">{error}</p>
          )}

          {/* Quantity */}
          <div>
            <p className="quick-view__section-label">Quantity</p>
            <div className="quick-view__qty">
              <button
                className="quick-view__qty-btn"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="quick-view__qty-num" aria-live="polite">{quantity}</span>
              <button
                className="quick-view__qty-btn"
                onClick={() => setQuantity(q => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="quick-view__description">{product.description}</p>

          {/* Success */}
          {success && (
            <div className="quick-view__success" role="status">
              <Check size={14} strokeWidth={2} aria-hidden="true" />
              Added to your bag.
            </div>
          )}

          {/* Add to bag */}
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleAdd}
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}
