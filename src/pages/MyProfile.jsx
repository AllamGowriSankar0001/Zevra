import { useState } from 'react';
import { userApi } from '../services/api';

export default function MyProfile({ user, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState({ fullName: user?.fullName || '', phone: user?.phone || '' });
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');
  const [error,   setError]   = useState('');

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true); setError(''); setMsg('');
    try {
      const r = await userApi.updateProfile({ fullName: form.fullName, phone: form.phone });
      onUpdate?.(r.data.user);
      setMsg('Profile updated.');
      setEditing(false);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="account-page">
      <div className="account-page__inner container">
        <div className="account-page__header">
          <div>
            <span className="account-page__eyebrow">Account</span>
            <h1 className="account-page__title">My Profile</h1>
          </div>
        </div>

        <div className="account-card">
          <div className="account-card__head">
            <span className="account-card__title">Personal Information</span>
            {!editing && (
              <button className="btn-secondary" onClick={() => { setEditing(true); setMsg(''); }}>Edit</button>
            )}
          </div>

          {msg   && <div className="account-success">{msg}</div>}
          {error && <div className="account-error">{error}</div>}

          {editing ? (
            <form className="account-form" onSubmit={handleSave}>
              <div className="account-field">
                <label>Full Name</label>
                <input value={form.fullName} onChange={e => setForm(f => ({...f, fullName: e.target.value}))} required />
              </div>
              <div className="account-field">
                <label>Phone</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+91 xxxxxxxxxx" />
              </div>
              <div className="account-field">
                <label>Email</label>
                <input value={user?.email} disabled style={{ opacity: 0.5 }} />
                <span className="account-field__hint">Email cannot be changed.</span>
              </div>
              <div style={{ display:'flex', gap:'0.75rem' }}>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
                <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="account-info">
              {[
                ['Full Name', user?.fullName],
                ['Email',     user?.email],
                ['Phone',     user?.phone || '—'],
                ['Member Since', user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' }) : '—'],
              ].map(([k, v]) => (
                <div key={k} className="account-info__row">
                  <span className="account-info__label">{k}</span>
                  <span className="account-info__value">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
