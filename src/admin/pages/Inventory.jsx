import { useEffect, useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { adminFetch } from '../hooks/useAdminApi';
import Pagination from '../components/Pagination';
import { StockBadge } from '../components/StatusBadge';

export default function Inventory() {
  const [rows,       setRows]       = useState([]);
  const [categories,setCategories]= useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');
  const [category,   setCategory]   = useState('');
  const [filter,     setFilter]     = useState('');
  const [page,       setPage]       = useState(1);
  const [editing,    setEditing]    = useState(null); // { productId, variantIndex }
  const [stockInput, setStockInput] = useState('');
  const [saving,     setSaving]     = useState(false);
  const [stockError, setStockError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ page, limit: 25 });
      if (search)   params.set('search',     search);
      if (category) params.set('category',   category);
      if (filter === 'low')  params.set('lowStock',   'true');
      if (filter === 'out')  params.set('outOfStock', 'true');
      const r = await adminFetch(`/inventory?${params}`);
      setRows(r.data.rows);
      setPagination(r.data.pagination);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, [page, search, category, filter]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    adminFetch('/categories')
      .then(response => setCategories(response.data.categories.filter(category => category.isActive)))
      .catch(requestError => setError(requestError.message));
  }, []);

  async function saveStock() {
    if (!editing) return;
    const val = Number(stockInput);
    if (!stockInput.trim() || !Number.isInteger(val) || val < 0) {
      setStockError('Enter a whole number of zero or more for stock.');
      return;
    }
    setStockError('');
    setSaving(true);
    try {
      const path = editing.variantIndex < 0
        ? `/inventory/${editing.productId}/stock`
        : `/inventory/${editing.productId}/variants/${editing.variantIndex}`;
      await adminFetch(path, {
        method: 'PATCH', body: { stock: val },
      });
      setEditing(null);
      await load();
    } catch(e) { setStockError(e.message); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">Admin</div>
          <h1>Inventory</h1>
        </div>
      </div>

      {stockError && <div className="admin-error" role="alert">{stockError}</div>}

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} aria-hidden="true" />
          <input placeholder="Search products…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="admin-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <select className="admin-select" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
          <option value="">All Stock</option>
          <option value="low">Low Stock (≤5)</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      <div className="admin-card">
        {loading
          ? <div className="admin-loading">Loading inventory…</div>
          : error
            ? <div className="admin-error">{error}</div>
            : rows.length === 0
              ? <div className="admin-empty"><p>No inventory records found.</p></div>
              : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr>
                      <th>Product</th><th>Category</th><th>SKU</th>
                      <th>Colour</th><th>Size</th><th>Stock</th><th>Status</th><th>Manage</th>
                    </tr></thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight:500 }}>{row.productName}</td>
                          <td>{categories.find(categoryOption => categoryOption.slug === row.category)?.name || row.category}</td>
                          <td><code style={{ fontSize:11 }}>{row.sku || '—'}</code></td>
                          <td>{row.color || '—'}</td>
                          <td>{row.size  || '—'}</td>
                          <td>
                            {editing?.productId === String(row.productId) && editing?.variantIndex === row.variantIndex
                              ? (
                                <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                                  <input type="number" min="0" step="1" value={stockInput}
                                    onChange={e => { setStockInput(e.target.value); setStockError(''); }}
                                    style={{ width:70, padding:'4px 8px', border:'1px solid #ccc', borderRadius:4, fontSize:13 }} />
                                  <button className="a-btn a-btn--primary a-btn--sm" onClick={saveStock} disabled={saving}>
                                    {saving ? '…' : 'Save'}
                                  </button>
                                  <button className="a-btn a-btn--secondary a-btn--sm" onClick={() => setEditing(null)}>✕</button>
                                </div>
                              )
                              : <span>{row.stock ?? '—'}</span>
                            }
                          </td>
                          <td><StockBadge stock={row.stock} /></td>
                          <td>
                            <button className="a-btn a-btn--secondary a-btn--sm"
                              onClick={() => { setEditing({ productId: String(row.productId), variantIndex: row.variantIndex }); setStockInput(String(row.stock ?? 0)); setStockError(''); }}>
                              {row.stock === 0 ? 'Add Stock' : 'Update Stock'}
                            </button>
                          </td>
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
