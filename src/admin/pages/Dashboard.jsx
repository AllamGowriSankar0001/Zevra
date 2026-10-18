import { useEffect, useState } from 'react';
import { adminFetch } from '../hooks/useAdminApi';

export default function Dashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    adminFetch('/dashboard')
      .then(r => setData(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loading">Loading dashboard…</div>;
  if (error)   return <div className="admin-error">{error}</div>;

  const { stats, productsByCategory, ordersByStatus, recentOrders } = data;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">Admin</div>
          <h1>Dashboard</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Active Products</div>
          <div className="admin-stat-card__value">{stats.totalProducts}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Customers</div>
          <div className="admin-stat-card__value">{stats.totalCustomers}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Total Orders</div>
          <div className="admin-stat-card__value">{stats.totalOrders}</div>
        </div>
        <div className={`admin-stat-card ${stats.lowStockCount > 0 ? 'admin-stat-card--warn' : ''}`}>
          <div className="admin-stat-card__label">Low Stock Variants</div>
          <div className="admin-stat-card__value">{stats.lowStockCount}</div>
        </div>
      </div>

      <div className="admin-dash-grid">
        {/* Products by category */}
        <div className="admin-card">
          <div className="admin-card__header">
            <span className="admin-card__title">Products by Category</span>
          </div>
          <div className="admin-card__body">
            {productsByCategory.length === 0
              ? <p style={{ color:'#999', fontSize:13 }}>No data</p>
              : productsByCategory.map(c => (
                <div key={c._id} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #F0F0EE', fontSize:13.5 }}>
                  <span>{c.name}</span>
                  <strong>{c.count}</strong>
                </div>
              ))
            }
          </div>
        </div>

        {/* Orders by status */}
        <div className="admin-card">
          <div className="admin-card__header">
            <span className="admin-card__title">Orders by Status</span>
          </div>
          <div className="admin-card__body">
            {ordersByStatus.length === 0
              ? <p style={{ color:'#999', fontSize:13 }}>No orders yet</p>
              : ordersByStatus.map(s => (
                <div key={s._id} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #F0F0EE', fontSize:13.5 }}>
                  <span style={{ textTransform:'capitalize' }}>{s._id}</span>
                  <strong>{s.count}</strong>
                </div>
              ))
            }
          </div>
        </div>

        {/* Recent orders */}
        <div className="admin-card" style={{ gridColumn:'1/-1' }}>
          <div className="admin-card__header">
            <span className="admin-card__title">Recent Orders</span>
          </div>
          {recentOrders.length === 0
            ? <div className="admin-empty"><p>No orders recorded yet.</p></div>
            : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(o => (
                      <tr key={o._id}>
                        <td><code style={{ fontSize:12 }}>{o.orderNumber}</code></td>
                        <td>{o.user?.fullName || o.user?.email || '—'}</td>
                        <td>₹{(o.totalAmount || 0).toLocaleString('en-IN')}</td>
                        <td><span className={`badge badge--${(o.status||'').toLowerCase()}`}>{o.status}</span></td>
                        <td style={{ color:'#999', fontSize:12 }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
