const API = 'http://localhost:4001/api/v1';

function getToken()       { return sessionStorage.getItem('zevra_admin_tk') || ''; }
export function hasAdminToken() { return Boolean(getToken()); }
export function setAdminToken(t)  { sessionStorage.setItem('zevra_admin_tk', t); }
export function clearAdminToken() { sessionStorage.removeItem('zevra_admin_tk'); }

export async function getAdminSession() {
  const token = getToken();
  if (!token) throw new Error('No saved admin session.');

  const res = await fetch(`${API}/admin-auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || 'Admin session expired.'), { status: res.status });
  return data.user;
}

export async function adminFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API}/admin${path}`, {
    method: options.method || 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || 'Request failed'), { status: res.status, errors: data.errors || [] });
  return data;
}

export async function adminAuthFetch(path, body) {
  const res = await fetch(`${API}/admin-auth${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || 'Request failed'), { status: res.status });
  return data;
}
