import { useEffect, useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { adminFetch } from '../hooks/useAdminApi';
import Pagination from '../components/Pagination';

const STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled'];

export default function Orders() {
  const [orders,     setOrders]     = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');
  const [status,     setStatus]     = useState('');
  const [page,       setPage]       = useState(1);
  const [detail,     setDetail]     = useState(null);
  const [updating,   setUpdating]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ page, limit:15 });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      const r = await adminFetch(`/orders?${params}`);
      setOrders(r.data.orders);
      setPagination(r.data.pagination);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, [page, search, status]);

  useEffect(() => { load(); }, [load]);

  async function openDetail(id) {
    try {
      const r = await adminFetch(`/orders/${id}`);
      setDetail(r.data.order);
    } catch(e) { setError(e.message); }
  }

  async function updateStatus(newStatus) {
    if (!detail) return;
    setUpdating(true);
    try {
      await adminFetch(`/orders/${detail._id}/status`, { method:'PATCH', body:{ status: newStatus } });
      const r = await adminFetch(`/orders/${detail._id}`);
      setDetail(r.data.order);
      await load();
    } catch(e) { setError(e.message); }
    finally { setUpdating(false); }
  }

  if (detail) return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">
            <button onClick={() => setDetail(null)} style={{ color:'#999', background:'none', border:'none', cursor:'pointer', padding:0 }}>Orders</button>
            {' / '}Order Detail
          </div>
          <h1>Order #{detail.orderNumber}</h1>
        </div>
        <button className="a-btn a-btn--secondary" onClick={() => setDetail(null)}>← Back</button>
      </div>

      {error && <div className="admin-error" role="alert">{error}</div>}
      <div className="admin-order-detail-grid">
        {/* Items */}
        <div className="admin-card">
          <div className="admin-card__header"><span className="admin-card__title">Items</span></div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Product</th><th>Variant</th><th>Qty</th><th>Unit</th><th>Total</th></tr></thead>
              <tbody>
                {detail.items?.map((item, i) => (
                  <tr key={i}>
                    <td>{item.productName}</td>
                    <td style={{ color:'#777', fontSize:12 }}>{[item.color, item.size].filter(Boolean).join(' / ')}</td>
                    <td>{item.quantity}</td>
                    <td>₹{(item.unitPrice||0).toLocaleString('en-IN')}</td>
                    <td>₹{(item.lineTotal||0).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding:'14px 20px', textAlign:'right', borderTop:'1px solid #F0F0EE' }}>
            <strong>Total: ₹{(detail.totalAmount||0).toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* Side info */}
        <div className="admin-order-detail-aside">
          <div className="admin-card">
            <div className="admin-card__header"><span className="admin-card__title">Customer</span></div>
            <div className="admin-card__body" style={{ fontSize:13.5 }}>
              <div>{detail.user?.fullName || '—'}</div>
              <div style={{ color:'#777' }}>{detail.user?.email}</div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card__header"><span className="admin-card__title">Status</span></div>
            <div className="admin-card__body">
              <div style={{ marginBottom:10 }}>
                <span className={`badge badge--${detail.status}`} style={{ fontSize:13 }}>{detail.status}</span>
              </div>
              <select className="admin-select" style={{ width:'100%' }}
                value={detail.status} onChange={e => updateStatus(e.target.value)} disabled={updating}>
                {STATUSES.map(s => <option key={s} value={s} style={{ textTransform:'capitalize' }}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card__header"><span className="admin-card__title">Date</span></div>
            <div className="admin-card__body" style={{ fontSize:13.5 }}>
              <div>{new Date(detail.createdAt).toLocaleString('en-IN')}</div>
              <div style={{ color:'#999', fontSize:12, marginTop:4 }}>Payment: {detail.paymentStatus}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">Admin</div>
          <h1>Orders</h1>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} aria-hidden="true" />
          <input placeholder="Search order number…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="admin-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s} value={s} style={{ textTransform:'capitalize' }}>{s}</option>)}
        </select>
      </div>

      <div className="admin-card">
        {loading
          ? <div className="admin-loading">Loading orders…</div>
          : error
            ? <div className="admin-error">{error}</div>
            : orders.length === 0
              ? <div className="admin-empty"><p>No orders found.</p></div>
              : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr>
                      <th>Order #</th><th>Customer</th><th>Total</th>
                      <th>Status</th><th>Date</th><th>Action</th>
                    </tr></thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o._id}>
                          <td><code style={{ fontSize:12 }}>{o.orderNumber}</code></td>
                          <td>{o.user?.fullName || o.user?.email || '—'}</td>
                          <td>₹{(o.totalAmount||0).toLocaleString('en-IN')}</td>
                          <td><span className={`badge badge--${o.status}`}>{o.status}</span></td>
                          <td style={{ color:'#999', fontSize:12 }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                          <td><button className="a-btn a-btn--secondary a-btn--sm" onClick={() => openDetail(o._id)}>View</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
        }
        <Pagination pagination={pagination} onPage={setPage} />
      </div>
    </div>
  );
}
