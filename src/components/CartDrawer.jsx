import { useEffect, useRef, useState } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../data/products';

export default function CartDrawer({ items, subtotal, onClose, onUpdateQuantity, onRemove }) {
  const [showCheckout, setShowCheckout] = useState(false);
  const drawerRef = useRef(null);
  const closeRef  = useRef(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Focus close button
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Escape to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Trap focus
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    const focusable = 'button, [href], input, [tabindex]:not([tabindex="-1"])';
    const els = () => [...drawer.querySelectorAll(focusable)].filter(el => !el.disabled);
    function handleTab(e) {
      if (e.key !== 'Tab') return;
      const list = els();
      if (!list.length) return;
      if (e.shiftKey) {
        if (document.activeElement === list[0]) { e.preventDefault(); list[list.length - 1].focus(); }
      } else {
        if (document.activeElement === list[list.length - 1]) { e.preventDefault(); list[0].focus(); }
      }
    }
    drawer.addEventListener('keydown', handleTab);
    return () => drawer.removeEventListener('keydown', handleTab);
  }, []);

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <div
        className="cart-overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        ref={drawerRef}
      >
        {/* Header */}
        <div className="cart-drawer__header">
          <div>
            <span className="cart-drawer__title">Your Bag</span>
            <span className="cart-drawer__count">
              {itemCount} item{itemCount !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            ref={closeRef}
            className="btn-ghost"
            onClick={onClose}
            aria-label="Close shopping bag"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <ShoppingBag size={36} strokeWidth={1} aria-hidden="true" style={{ color: 'var(--color-divider)' }} />
              <p className="cart-drawer__empty-title">Your bag is empty.</p>
              <button className="btn-primary" onClick={onClose}>Continue Shopping</button>
            </div>
          ) : (
            items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__subtotal">
              <span className="cart-drawer__subtotal-label">Subtotal</span>
              <span className="cart-drawer__subtotal-amount">{formatPrice(subtotal)}</span>
            </div>

            {showCheckout ? (
              <div className="checkout-demo" role="status">
                <strong style={{ display: 'block', marginBottom: '0.375rem' }}>Demo only — no order placed.</strong>
                This is a storefront demo. No payment is taken and no order is created.
                Replace this section with a real checkout integration.
              </div>
            ) : (
              <button
                className="btn-primary cart-drawer__checkout"
                onClick={() => setShowCheckout(true)}
              >
                Preview Checkout
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function CartItem({ item, onUpdateQuantity, onRemove }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="cart-item">
      {/* Image */}
      <div className="cart-item__img-wrap" aria-hidden="true">
        {item.image && !imgError ? (
          <img
            src={item.image}
            alt={item.name}
            className="cart-item__img"
            loading="lazy"
            width="80"
            height="100"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="cart-item__img-placeholder" style={{ background: '#E8E5DF' }}>
            <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <rect width="80" height="100" fill="#E8E5DF"/>
              <text x="40" y="52" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" fill="#B0ADA8" letterSpacing="1">
                {item.name.split(' ').slice(0, 2).join(' ')}
              </text>
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="cart-item__details">
        <span className="cart-item__name">{item.name}</span>
        <span className="cart-item__meta">
          {item.colour} · {item.size}
        </span>
        <span className="cart-item__price">{formatPrice(item.price)}</span>
        <div className="cart-item__qty">
          <button
            className="cart-item__qty-btn"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            aria-label={`Decrease quantity of ${item.name}`}
            disabled={item.quantity <= 1}
          >
            <Minus size={12} strokeWidth={1.5} />
          </button>
          <span className="cart-item__qty-num" aria-live="polite">{item.quantity}</span>
          <button
            className="cart-item__qty-btn"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            aria-label={`Increase quantity of ${item.name}`}
          >
            <Plus size={12} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Remove */}
      <button
        className="cart-item__remove btn-ghost"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name} from bag`}
      >
        <X size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}
