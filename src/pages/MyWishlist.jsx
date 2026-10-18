import { useEffect, useState } from 'react';
import { normalizeProduct, wishlistApi } from '../services/api';
import { formatPrice } from '../data/products';
import ProductIllustration from '../components/ProductIllustration';

export default function MyWishlist({ onQuickView }) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [removingId, setRemovingId] = useState('');

  useEffect(() => {
    wishlistApi.get()
      .then(r => setItems(r.data.items))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function remove(productId) {
    setError('');
    setRemovingId(productId);
    try {
      await wishlistApi.remove(productId);
      setItems(prev => prev.filter(i => i.product._id !== productId));
    } catch (requestError) {
      setError(requestError.message || 'Unable to remove this item.');
    } finally {
      setRemovingId('');
    }
  }

  return (
    <div className="account-page">
      <div className="account-page__inner container">
        <div className="account-page__header">
          <div>
            <span className="account-page__eyebrow">Account</span>
            <h1 className="account-page__title">Wishlist</h1>
          </div>
          <span style={{ fontSize:'var(--text-body-sm)', color:'var(--color-secondary)' }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>

        {error && items.length > 0 && <div className="account-error" role="alert">{error}</div>}

        {loading ? (
          <div className="account-empty">Loading wishlist…</div>
        ) : error ? (
          <div className="account-error">{error}</div>
        ) : items.length === 0 ? (
          <div className="account-empty">
            <p className="account-empty__title">Your wishlist is empty.</p>
            <p>Save items you love and come back to them later.</p>
          </div>
        ) : (
          <div className="wishlist-grid">
            {items.map(item => {
              const p = item.product;
              if (!p) return null;
              const img = p.images?.[0]?.url;
              return (
                <div key={item._id} className="wishlist-card">
                  <div className="wishlist-card__img" onClick={() => onQuickView?.({ id: p._id, ...p }, null)}>
                    {img
                      ? <img src={img} alt={p.name} loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <ProductIllustration productId={p.slug?.split('-').map((w,i) => i===0?w:w[0].toUpperCase()+w.slice(1)).join('')} alt={p.name} className="product-card__illustration" />
                    }
                  </div>
                  <div className="wishlist-card__info">
                    <span className="wishlist-card__name">{p.name}</span>
                    <span className="wishlist-card__price">{formatPrice(p.price)}</span>
                    <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.625rem' }}>
                      <button className="btn-primary" style={{ fontSize:'var(--text-micro)', padding:'0.5rem 1rem' }}
                        onClick={() => onQuickView?.(normalizeProduct(p), null)}>
                        Add to Bag
                      </button>
                      <button className="btn-secondary" onClick={() => remove(p._id)} disabled={removingId === p._id}>
                        {removingId === p._id ? 'Removing…' : 'Remove'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
