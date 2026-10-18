import { useEffect, useState } from 'react';
import { orderApi } from '../services/api';
import { formatPrice } from '../data/products';

const STATUS_STYLE = {
  pending:    '#D4A017', confirmed: '#27AE60', processing: '#2C5FE0',
  shipped:    '#7B2DE0', delivered: '#1A8A40', cancelled:  '#C0392B',
};

export default function MyOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState('');
  const [error,   setError]   = useState('');
  const [detail,  setDetail]  = useState(null);

  useEffect(() => {
    orderApi.list()
      .then(r => setOrders(r.data.orders))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function openOrder(orderId) {
    setError('');
    setDetailLoading(orderId);
    try {
      const response = await orderApi.get(orderId);
      setDetail(response.data.order);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load this order.');
    } finally {
      setDetailLoading('');
    }
  }

  if (detail) return (
    <div className="account-page">
      <div className="account-page__inner container">
        <div className="account-page__header">
          <div>
            <span className="account-page__eyebrow">
              <button onClick={() => setDetail(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-secondary)', padding:0, fontFamily:'inherit', fontSize:'inherit' }}>My Orders</button>
              {' / '}Order Detail
            </span>
            <h1 className="account-page__title">Order #{detail.orderNumber}</h1>
          </div>
          <button className="btn-secondary" onClick={() => setDetail(null)}>← Back</button>
        </div>

        <div className="account-card">
          <div className="account-card__head">
            <span className="account-card__title">Items</span>
            <span style={{ fontSize:'var(--text-caption)', color: STATUS_STYLE[detail.status], fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>
              {detail.status}
            </span>
          </div>
          <div className="order-items">
            {detail.items?.map((item, i) => (
              <div key={i} className="order-item">
                <div className="order-item__info">
                  <span className="order-item__name">{item.productName}</span>
                  <span className="order-item__meta">{[item.color, item.size].filter(Boolean).join(' · ')} × {item.quantity}</span>
                </div>
                <span className="order-item__price">{formatPrice(item.lineTotal)}</span>
              </div>
            ))}
            <div className="order-total">
              <span>Total</span>
              <strong>{formatPrice(detail.totalAmount)}</strong>
            </div>
          </div>
        </div>

        <div className="account-card" style={{ marginTop:'1rem' }}>
          <div className="account-card__head"><span className="account-card__title">Order Info</span></div>
          <div className="account-info">
            {[
              ['Order Number', detail.orderNumber],
              ['Status',       detail.status],
              ['Payment',      detail.paymentStatus],
              ['Placed',       new Date(detail.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })],
            ].map(([k, v]) => (
              <div key={k} className="account-info__row">
                <span className="account-info__label">{k}</span>
                <span className="account-info__value" style={{ textTransform:'capitalize' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="account-page">
      <div className="account-page__inner container">
        <div className="account-page__header">
          <div>
            <span className="account-page__eyebrow">Account</span>
            <h1 className="account-page__title">My Orders</h1>
          </div>
        </div>

        {loading ? (
          <div className="account-empty">Loading orders…</div>
        ) : error ? (
          <div className="account-error">{error}</div>
        ) : orders.length === 0 ? (
          <div className="account-empty">
            <p className="account-empty__title">No orders yet.</p>
            <p>Your order history will appear here once you make a purchase.</p>
          </div>
        ) : (
          <div className="account-card">
            <div className="account-card__head"><span className="account-card__title">Order History</span></div>
            {error && <div className="account-error" role="alert">{error}</div>}
            <div className="order-list">
              {orders.map(o => (
                <div key={o._id} className="order-row">
                  <div className="order-row__info">
                    <span className="order-row__num">#{o.orderNumber}</span>
                    <span className="order-row__date">{new Date(o.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                    <span style={{ fontSize:'var(--text-caption)', color: STATUS_STYLE[o.status], fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>{o.status}</span>
                    <span className="order-row__total">{formatPrice(o.totalAmount)}</span>
                    <button className="btn-secondary" onClick={() => openOrder(o._id)} disabled={Boolean(detailLoading)}>
                      {detailLoading === o._id ? 'Loading…' : 'View'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
