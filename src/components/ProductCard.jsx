import { useState } from 'react';
import { formatPrice } from '../data/products';
import ProductIllustration from './ProductIllustration';

export default function ProductCard({ product, onQuickView }) {
  const [imgError, setImgError] = useState({ primary: false, secondary: false });
  const [primarySrc, secondarySrc] = product.images;
  const showRealPrimary   = primarySrc   && !imgError.primary;
  const showRealSecondary = secondarySrc && !imgError.secondary;

  return (
    <article
      className="product-card"
      aria-label={product.name}
      onClick={() => onQuickView(product, null)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onQuickView(product, null); }}}
      role="button"
      tabIndex={0}
      style={{ cursor: 'pointer' }}
    >
      <div className="product-card__image-wrap">
        {showRealPrimary ? (
          <img src={primarySrc} alt={product.name} className="product-card__img"
            loading="lazy" width="600" height="800" decoding="async"
            onError={() => setImgError(s => ({ ...s, primary: true }))} />
        ) : (
          <ProductIllustration productId={product.id} alt={product.name}
            className="product-card__img product-card__illustration" />
        )}
        {showRealSecondary ? (
          <img src={secondarySrc} alt="" className="product-card__img product-card__img-hover"
            loading="lazy" width="600" height="800" decoding="async" aria-hidden="true"
            onError={() => setImgError(s => ({ ...s, secondary: true }))} />
        ) : (
          <div className="product-card__img product-card__img-hover product-card__hover-tint" aria-hidden="true" />
        )}
      </div>

      <div className="product-card__info">
        <span className="product-card__name">{product.name}</span>
        <span className="product-card__price">{formatPrice(product.price)}</span>
        {product.colours.length > 0 && (
          <div className="product-card__colours" aria-label="Available colours">
            {product.colours.map(c => (
              <span key={c.name} className="product-card__swatch"
                style={{ backgroundColor: c.hex }} title={c.name}
                role="img" aria-label={c.name} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
