import { useEffect, useState } from 'react';
import {
  Boxes,
  ExternalLink,
  LayoutDashboard,
  Layers3,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  UsersRound,
  X,
} from 'lucide-react';

const NAV = [
  { key: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { key: 'products',   label: 'Products',   icon: Package },
  { key: 'categories', label: 'Categories', icon: Layers3 },
  { key: 'inventory',  label: 'Inventory',  icon: Boxes },
  { key: 'customers',  label: 'Customers',  icon: UsersRound },
  { key: 'orders',     label: 'Orders',     icon: ShoppingBag },
];

export default function AdminLayout({ page, onNavigate, user, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function nav(key) { onNavigate(key); setSidebarOpen(false); }

  useEffect(() => {
    if (!sidebarOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key === 'Escape') setSidebarOpen(false);
    }

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [sidebarOpen]);

  const displayName = user?.fullName || user?.email || 'Admin';
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className="admin-root">
      <aside id="admin-sidebar" className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar__logo">
          <img src="/images/brand/logo.png" alt="ZEVRA" />
          <span className="admin-sidebar__badge">Admin</span>
        </div>
        <nav className="admin-sidebar__nav" aria-label="Admin navigation">
          <span className="admin-sidebar__section-label">Workspace</span>
          {NAV.map(n => (
            <button
              key={n.key}
              className={`admin-nav-link${page === n.key ? ' active' : ''}`}
              onClick={() => nav(n.key)}
              aria-current={page === n.key ? 'page' : undefined}
            >
              <n.icon size={18} strokeWidth={1.8} aria-hidden="true" />
              {n.label}
            </button>
          ))}
          <a className="admin-nav-link" href="/" target="_blank" rel="noreferrer">
            <ExternalLink size={18} strokeWidth={1.8} aria-hidden="true" />
            View Store
          </a>
        </nav>
        <div className="admin-sidebar__footer">
          <button className="admin-nav-link admin-nav-link--logout" onClick={onLogout}>
            <LogOut size={18} strokeWidth={1.8} aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__heading">
            <button
              className="admin-hamburger"
              onClick={() => setSidebarOpen(o => !o)}
              aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={sidebarOpen}
              aria-controls="admin-sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="admin-topbar__title">
              {NAV.find(n => n.key === page)?.label || 'Admin'}
            </span>
          </div>
          <div className="admin-topbar__account">
            <span className="admin-topbar__avatar" aria-hidden="true">{initials}</span>
            <span className="admin-topbar__user">{displayName}</span>
          </div>
        </header>
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
