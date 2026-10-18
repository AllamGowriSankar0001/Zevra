import { useEffect, useState } from 'react';
import { clearAdminToken, getAdminSession, hasAdminToken } from './hooks/useAdminApi';
import AdminLayout  from './components/AdminLayout';
import AdminLogin   from './pages/AdminLogin';
import Dashboard    from './pages/Dashboard';
import Products     from './pages/Products';
import Categories   from './pages/Categories';
import Inventory    from './pages/Inventory';
import Customers    from './pages/Customers';
import Orders       from './pages/Orders';
import './styles/admin.css';

const PAGES = { dashboard: Dashboard, products: Products, categories: Categories, inventory: Inventory, customers: Customers, orders: Orders };

export default function AdminApp() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [checkingSession, setCheckingSession] = useState(hasAdminToken);
  const [sessionError, setSessionError] = useState('');

  function handleLogin(u) { setUser(u); }

  function handleLogout() {
    clearAdminToken();
    setUser(null);
    setSessionError('');
  }

  async function restoreSession() {
    setCheckingSession(true);
    setSessionError('');
    try {
      setUser(await getAdminSession());
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        clearAdminToken();
        setUser(null);
      } else {
        setSessionError(error.message || 'Unable to restore admin session.');
      }
    } finally {
      setCheckingSession(false);
    }
  }

  useEffect(() => {
    if (!hasAdminToken()) return undefined;

    restoreSession();
  }, []);

  if (checkingSession) {
    return <div className="admin-root"><div className="admin-loading">Restoring admin session…</div></div>;
  }

  if (sessionError) {
    return (
      <div className="admin-root admin-login">
        <div className="admin-login__card">
          <h1 className="admin-login__title">Admin connection unavailable</h1>
          <p className="admin-login__sub">Your saved session is still available. Check the connection and try again.</p>
          <div className="admin-error" role="alert">{sessionError}</div>
          <button className="a-btn a-btn--primary" onClick={restoreSession}>Retry</button>
        </div>
      </div>
    );
  }

  if (!user) return <AdminLogin onLogin={handleLogin} />;

  const PageComponent = PAGES[page] || Dashboard;

  return (
    <AdminLayout page={page} onNavigate={setPage} user={user} onLogout={handleLogout}>
      <PageComponent />
    </AdminLayout>
  );
}
