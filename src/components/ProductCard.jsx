import { useRef, useState } from 'react';
import { formatPrice } from '../data/products';
import ProductIllustration from './ProductIllustration';

export default function ProductCard({ product, onQuickView }) {
  const btnRef = useRef(null);
  const [imgError, setImgError] = useState({ primary: false, secondary: false });

  const [primarySrc, secondarySrc] = product.images;

  // Use real image if provided and valid, otherwise SVG illustration
  const showRealPrimary   = primarySrc   && !imgError.primary;
  const showRealSecondary = secondarySrc && !imgError.secondary;

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onQuickView(product, btnRef.current);
    }
  }

  return (
    <article className="product-card" aria-label={product.name}>
      {/* Image area */}
      <div className="product-card__image-wrap">

        {/* Primary visual */}
        {showRealPrimary ? (
          <img
            src={primarySrc}
            alt={product.name}
            className="product-card__img"
            loading="lazy"
            width="600"
            height="800"
            decoding="async"
            onError={() => setImgError(s => ({ ...s, primary: true }))}
          />
        ) : (
          <ProductIllustration
            productId={product.id}
            alt={product.name}
            className="product-card__img product-card__illustration"
          />
        )}

        {/* Secondary (hover) visual */}
        {showRealSecondary ? (
          <img
            src={secondarySrc}
            alt={`${product.name} — alternate view`}
            className="product-card__img product-card__img-hover"
            loading="lazy"
            width="600"
            height="800"
            decoding="async"
            aria-hidden="true"
            onError={() => setImgError(s => ({ ...s, secondary: true }))}
          />
        ) : (
          /* Hover shows a slightly different shade of the same illustration */
          <div className="product-card__img product-card__img-hover product-card__hover-tint" aria-hidden="true" />
        )}

        <button
          ref={btnRef}
          className="product-card__quick-view"
          onClick={() => onQuickView(product, btnRef.current)}
          onKeyDown={handleKeyDown}
          aria-label={`Quick view ${product.name}`}
          tabIndex={0}
        >
          Quick View
        </button>
      </div>

      {/* Product info */}
      <div className="product-card__info">
        <span className="product-card__name">{product.name}</span>
        <span className="product-card__price">{formatPrice(product.price)}</span>
        {product.colours.length > 0 && (
          <div className="product-card__colours" aria-label="Available colours">
            {product.colours.map(c => (
              <span
                key={c.name}
                className="product-card__swatch"
                style={{ backgroundColor: c.hex }}
                title={c.name}
                role="img"
                aria-label={c.name}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
