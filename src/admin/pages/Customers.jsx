import { useEffect, useState, useCallback } from 'react';
import { Pencil, Search, Trash2 } from 'lucide-react';
import { adminFetch } from '../hooks/useAdminApi';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Customers() {
  const [customers,  setCustomers]  = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [actionError,setActionError]= useState('');
  const [search,     setSearch]     = useState('');
  const [status,     setStatus]     = useState('');
  const [role,       setRole]       = useState('');
  const [page,       setPage]       = useState(1);
  const [detail,     setDetail]    = useState(null);
  const [editing,    setEditing]   = useState(null);
  const [editForm,   setEditForm]  = useState({ fullName: '', email: '', phone: '', role: 'customer' });
  const [saving,     setSaving]    = useState(false);
  const [confirm,    setConfirm]    = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ page, limit:15 });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (role) params.set('role', role);
      const r = await adminFetch(`/customers?${params}`);
      setCustomers(r.data.customers);
      setPagination(r.data.pagination);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, [page, search, status, role]);

  useEffect(() => { load(); }, [load]);

  async function openDetail(id) {
    setActionError('');
    try {
      const r = await adminFetch(`/customers/${id}`);
      setDetail(r.data);
    } catch(e) { setActionError(e.message); }
  }

  function openEdit(user) {
    setActionError('');
    setEditing(user);
    setEditForm({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'customer',
    });
  }

  async function saveEdit(event) {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    setActionError('');
    try {
      await adminFetch(`/customers/${editing._id}`, { method: 'PATCH', body: editForm });
      setEditing(null);
      await load();
      if (detail?.customer?._id === editing._id) await openDetail(editing._id);
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  function deleteUser(user) {
    setConfirm({
      title: `Delete ${user.fullName}?`,
      message: user.role === 'admin'
        ? 'This permanently removes the admin account and its cart and wishlist data. Your own account and the last active admin cannot be deleted.'
        : 'This permanently removes the user and their cart and wishlist. Users with order history cannot be deleted.',
      danger: true,
      onConfirm: async () => {
        setConfirm(null);
        setActionError('');
        try {
          await adminFetch(`/customers/${user._id}`, { method: 'DELETE' });
          if (detail?.customer?._id === user._id) setDetail(null);
          await load();
        } catch (requestError) {
          setActionError(requestError.message);
        }
      },
    });
  }

  function toggleStatus(customer) {
    setConfirm({
      title: customer.isActive ? 'Deactivate account?' : 'Activate account?',
      message: `This will ${customer.isActive ? 'prevent' : 'allow'} "${customer.fullName}" from logging in.`,
      danger: customer.isActive,
      onConfirm: async () => {
        setConfirm(null);
        setActionError('');
        try {
          await adminFetch(`/customers/${customer._id}/status`, {
            method:'PATCH', body:{ isActive: !customer.isActive },
          });
          await load();
          if (detail?.customer?._id === customer._id) await openDetail(customer._id);
        } catch(e) { setActionError(e.message); }
      },
    });
  }

  if (detail) return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">
            <button onClick={() => setDetail(null)} style={{ color:'#999', background:'none', border:'none', cursor:'pointer', padding:0 }}>Customers</button>
            {' / '}User Detail
          </div>
          <h1>{detail.customer.fullName}</h1>
        </div>
        <button className="a-btn a-btn--secondary" onClick={() => setDetail(null)}>← Back</button>
      </div>

      {actionError && <div className="admin-error" role="alert">{actionError}</div>}
      {error && <div className="admin-error" role="alert">{error}</div>}
      {editing && (
        <div className="admin-card customer-edit-card">
          <div className="admin-card__header"><span className="admin-card__title">Edit User</span></div>
          <form className="admin-form customer-edit-form" onSubmit={saveEdit}>
            <div className="admin-form-row">
              <div className="admin-field">
                <label htmlFor="user-full-name">Full name</label>
                <input id="user-full-name" value={editForm.fullName} onChange={event => setEditForm(form => ({ ...form, fullName: event.target.value }))} required />
              </div>
              <div className="admin-field">
                <label htmlFor="user-email">Email</label>
                <input id="user-email" type="email" value={editForm.email} onChange={event => setEditForm(form => ({ ...form, email: event.target.value }))} required />
              </div>
              <div className="admin-field">
                <label htmlFor="user-phone">Phone</label>
                <input id="user-phone" type="tel" value={editForm.phone} onChange={event => setEditForm(form => ({ ...form, phone: event.target.value }))} />
              </div>
              <div className="admin-field">
                <label htmlFor="user-role">Role</label>
                <select id="user-role" value={editForm.role} onChange={event => setEditForm(form => ({ ...form, role: event.target.value }))}>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="customer-edit-form__actions">
              <button className="a-btn a-btn--primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
              <button className="a-btn a-btn--secondary" type="button" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-detail-grid">
        <div className="admin-card">
          <div className="admin-card__header"><span className="admin-card__title">Profile</span></div>
          <div className="admin-card__body">
            {[
              ['Name',     detail.customer.fullName],
              ['Email',    detail.customer.email],
              ['Phone',    detail.customer.phone || '—'],
              ['Role',     detail.customer.role],
              ['Status',   detail.customer.isActive ? 'Active' : 'Inactive'],
              ['Verified', detail.customer.isEmailVerified ? 'Yes' : 'No'],
              ['Joined',   new Date(detail.customer.createdAt).toLocaleDateString('en-IN')],
              ['Orders',   detail.orderCount],
            ].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #F0F0EE', fontSize:13.5 }}>
                <span style={{ color:'#777' }}>{k}</span>
                <strong>{String(v)}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__header"><span className="admin-card__title">Actions</span></div>
          <div className="admin-card__body" style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <button className="a-btn a-btn--secondary" onClick={() => openEdit(detail.customer)}>
              <Pencil size={14} aria-hidden="true" /> Edit User
            </button>
            {detail.customer.role !== 'admin' && <button
              className={`a-btn ${detail.customer.isActive ? 'a-btn--danger' : 'a-btn--primary'}`}
              onClick={() => toggleStatus(detail.customer)}
            >
              {detail.customer.isActive ? 'Deactivate Account' : 'Activate Account'}
            </button>}
            <button className="a-btn a-btn--danger" onClick={() => deleteUser(detail.customer)}>
              <Trash2 size={14} aria-hidden="true" /> Delete User
            </button>
          </div>
        </div>
      </div>
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}
    </div>
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">Admin</div>
          <h1>Customers</h1>
        </div>
      </div>

      {actionError && <div className="admin-error" role="alert">{actionError}</div>}
      {editing && (
        <div className="admin-card customer-edit-card">
          <div className="admin-card__header"><span className="admin-card__title">Edit User</span></div>
          <form className="admin-form customer-edit-form" onSubmit={saveEdit}>
            <div className="admin-form-row">
              <div className="admin-field">
                <label htmlFor="list-user-full-name">Full name</label>
                <input id="list-user-full-name" value={editForm.fullName} onChange={event => setEditForm(form => ({ ...form, fullName: event.target.value }))} required />
              </div>
              <div className="admin-field">
                <label htmlFor="list-user-email">Email</label>
                <input id="list-user-email" type="email" value={editForm.email} onChange={event => setEditForm(form => ({ ...form, email: event.target.value }))} required />
              </div>
              <div className="admin-field">
                <label htmlFor="list-user-phone">Phone</label>
                <input id="list-user-phone" type="tel" value={editForm.phone} onChange={event => setEditForm(form => ({ ...form, phone: event.target.value }))} />
              </div>
              <div className="admin-field">
                <label htmlFor="list-user-role">Role</label>
                <select id="list-user-role" value={editForm.role} onChange={event => setEditForm(form => ({ ...form, role: event.target.value }))}>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="customer-edit-form__actions">
              <button className="a-btn a-btn--primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
              <button className="a-btn a-btn--secondary" type="button" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} aria-hidden="true" />
          <input placeholder="Search name or email…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="admin-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select className="admin-select" value={role} onChange={e => { setRole(e.target.value); setPage(1); }}>
          <option value="">All Roles</option>
          <option value="customer">Customers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="admin-card">
        {loading
          ? <div className="admin-loading">Loading customers…</div>
          : error
            ? <div className="admin-error">{error}</div>
            : customers.length === 0
              ?               <div className="admin-empty"><p>No users found.</p></div>
              : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr>
                      <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th>
                    </tr></thead>
                    <tbody>
                      {customers.map(c => (
                        <tr key={c._id}>
                          <td style={{ fontWeight:500 }}>{c.fullName}</td>
                          <td style={{ color:'#555' }}>{c.email}</td>
                          <td><span className={`badge badge--${c.role === 'admin' ? 'admin' : 'customer'}`}>{c.role}</span></td>
                          <td><span className={`badge badge--${c.isActive?'active':'inactive'}`}>{c.isActive?'Active':'Inactive'}</span></td>
                          <td style={{ color:'#999', fontSize:12 }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                          <td>
                            <div style={{ display:'flex', gap:6 }}>
                              <button className="a-btn a-btn--secondary a-btn--sm" onClick={() => openDetail(c._id)}>View</button>
                              <button className="a-btn a-btn--secondary a-btn--sm" onClick={() => openEdit(c)} aria-label={`Edit ${c.fullName}`}>
                                <Pencil size={13} aria-hidden="true" /> Edit
                              </button>
                              {c.role !== 'admin' && <button
                                className={`a-btn a-btn--sm ${c.isActive ? 'a-btn--danger' : 'a-btn--secondary'}`}
                                onClick={() => toggleStatus(c)}
                              >
                                {c.isActive ? 'Deactivate' : 'Activate'}
                              </button>}
                              <button className="a-btn a-btn--danger a-btn--sm" onClick={() => deleteUser(c)} aria-label={`Delete ${c.fullName}`}>
                                <Trash2 size={13} aria-hidden="true" /> Delete
                              </button>
                            </div>
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
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}
    </div>
  );
}
