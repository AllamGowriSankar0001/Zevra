import { useState } from 'react';
import { Heart, Eye } from 'lucide-react';
import { formatPrice } from '../data/products';
import { useAuth } from '../hooks/useAuth';
import ProductIllustration from './ProductIllustration';

export default function ProductCard({ product, onQuickView, onProductClick }) {
  const { user, isInWishlist, toggleWishlist, triggerRequireLogin } = useAuth();
  const [imgError, setImgError] = useState({ primary: false, secondary: false });
  const [selectedColor, setSelectedColor] = useState(product.colours?.[0]?.name || '');

  const productId = product.id || product._id;
  const wishlisted = isInWishlist(productId);

  const [primarySrc, secondarySrc] = product.images || [];
  const showRealPrimary   = primarySrc && !imgError.primary;
  const showRealSecondary = secondarySrc && !imgError.secondary;

  const availableSizes = [...new Set([
    ...(product.sizes || []),
    ...(product.variants || []).map(v => v.size).filter(Boolean),
  ])].slice(0, 5);

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
      // Graceful fallback
    }
  }

  function handleSizeClick(e, size) {
    e.stopPropagation();
    if (!user) {
      triggerRequireLogin('Please sign in to add items to your shopping bag.', {
        type: 'cart',
        product,
        size,
      });
      return;
    }
    onQuickView?.(product, null, { initialSize: size });
  }

  function handleCardClick() {
    if (onProductClick) {
      onProductClick(product);
    } else {
      onQuickView?.(product, null);
    }
  }

  return (
    <article
      className="product-card"
      aria-label={product.name}
      onClick={handleCardClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(); }}}
      role="button"
      tabIndex={0}
    >
      <div className="product-card__image-wrap">
        {/* Floating Wishlist Heart */}
        <button
          type="button"
          className={`product-card__wishlist-btn${wishlisted ? ' active' : ''}`}
          onClick={handleToggleWishlist}
          title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={16} fill={wishlisted ? '#B91C1C' : 'none'} color={wishlisted ? '#B91C1C' : '#222222'} />
        </button>

        {/* Primary Image */}
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

        {/* Secondary Hover Image */}
        {showRealSecondary ? (
          <img
            src={secondarySrc}
            alt=""
            className="product-card__img product-card__img-hover"
            loading="lazy"
            width="600"
            height="800"
            decoding="async"
            aria-hidden="true"
            onError={() => setImgError(s => ({ ...s, secondary: true }))}
          />
        ) : (
          <div className="product-card__img product-card__img-hover product-card__hover-tint" aria-hidden="true" />
        )}

        {/* Interactive Hover Drawer: Quick View & Sizes */}
        <div className="product-card__hover-actions" onClick={e => e.stopPropagation()}>
          {availableSizes.length > 0 && (
            <div className="product-card__quick-sizes">
              <span className="product-card__quick-sizes-label">Sizes:</span>
              <div className="product-card__quick-sizes-list">
                {availableSizes.map(sz => (
                  <button
                    key={sz}
                    type="button"
                    className="product-card__size-pill"
                    onClick={(e) => handleSizeClick(e, sz)}
                    title={`Select size ${sz}`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            className="product-card__quick-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView?.(product, null);
            }}
          >
            <Eye size={14} />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      <div className="product-card__info">
        <div className="product-card__name-row">
          <span className="product-card__name">{product.name}</span>
        </div>

        <div className="product-card__meta-row">
          <span className="product-card__price">{formatPrice(product.price)}</span>
          {selectedColor && (
            <span className="product-card__color-name">{selectedColor}</span>
          )}
        </div>

        {product.colours?.length > 0 && (
          <div className="product-card__colours" aria-label="Available colours" onClick={e => e.stopPropagation()}>
            {product.colours.map(c => (
              <button
                key={c.name}
                type="button"
                className={`product-card__swatch${selectedColor === c.name ? ' active' : ''}`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                onClick={() => setSelectedColor(c.name)}
                aria-label={c.name}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
