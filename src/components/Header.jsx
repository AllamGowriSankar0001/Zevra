import { useState, useEffect } from 'react';
import { Search, ShoppingBag, User } from 'lucide-react';
import { CATEGORIES } from '../data/products';

export default function Header({ itemCount, onCartOpen, onSearchOpen, activeCategory, onCategoryChange }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  function handleNavClick(categoryId) {
    onCategoryChange(categoryId);
    const section = document.getElementById('collection');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  }

  const navCategories = CATEGORIES.filter(c => c.id !== 'all');

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`} role="banner">
        <div className="container header__inner">

          {/* Logo */}
          <button
            className="header__logo btn-ghost"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="ZEVRA — go to top"
          >
            <img src="/images/brand/logo.png" alt="ZEVRA Clothing Store" className="header__logo-img" />
          </button>

          {/* Desktop nav */}
          <nav className="header__nav" aria-label="Product categories">
            {navCategories.map(cat => (
              <button
                key={cat.id}
                className={`header__nav-link${activeCategory === cat.id ? ' active' : ''}`}
                onClick={() => handleNavClick(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="header__actions">
            {/* Desktop only */}
            <button className="btn-ghost header__desktop-only" onClick={onSearchOpen} aria-label="Open search">
              <Search size={19} strokeWidth={1.75} />
            </button>

            <button
              className="btn-ghost header__cart-btn header__desktop-only"
              onClick={onCartOpen}
              aria-label={`Shopping bag, ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
            >
              <ShoppingBag size={19} strokeWidth={1.75} />
              {itemCount > 0 && (
                <span className="header__cart-count" aria-hidden="true">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            <button className="header__auth-link header__desktop-only" onClick={() => setAuthModal('login')} aria-label="Log in">
              Login
            </button>
            <button className="header__auth-signup header__desktop-only" onClick={() => setAuthModal('signup')} aria-label="Create an account">
              Sign Up
            </button>

            {/* Hamburger — mobile only */}
            <button
              className="header__hamburger btn-ghost"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {menuOpen && (
          <MobileMenuInline
            onClose={() => setMenuOpen(false)}
            onCategoryChange={(id) => { handleNavClick(id); setMenuOpen(false); }}
            onSearchOpen={() => { setMenuOpen(false); onSearchOpen(); }}
            onCartOpen={() => { setMenuOpen(false); onCartOpen(); }}
            itemCount={itemCount}
            activeCategory={activeCategory}
            onLogin={() => { setMenuOpen(false); setAuthModal('login'); }}
            onSignup={() => { setMenuOpen(false); setAuthModal('signup'); }}
          />
        )}
      </header>

      {/* Auth demo modal */}
      {authModal && (
        <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSwitch={setAuthModal} />
      )}
    </>
  );
}

/* ── Mobile Menu ── */
function MobileMenuInline({ onClose, onCategoryChange, onSearchOpen, onCartOpen, itemCount, activeCategory, onLogin, onSignup }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const navCategories = CATEGORIES.filter(c => c.id !== 'all');

  return (
    <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation menu">
      <div className="mobile-menu__backdrop" onClick={onClose} />
      <div className="mobile-menu__panel">
        <div className="mobile-menu__header">
          <img src="/images/brand/logo.png" alt="ZEVRA Clothing Store" style={{ height: '38px', width: 'auto' }} />
          <button className="mobile-menu__close btn-ghost" onClick={onClose} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4l12 12M16 4L4 16" />
            </svg>
          </button>
        </div>

        {/* Category nav */}
        <nav className="mobile-menu__nav" aria-label="Product categories">
          {navCategories.map(cat => (
            <button
              key={cat.id}
              className={`mobile-menu__nav-link${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => onCategoryChange(cat.id)}
            >
              {cat.label}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M4 8h8M9 5l3 3-3 3" />
              </svg>
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="mobile-menu__actions">
          <button className="mobile-menu__action-btn" onClick={() => { onClose(); onSearchOpen(); }}>
            <Search size={17} strokeWidth={1.5} />
            Search
          </button>
          <button className="mobile-menu__action-btn" onClick={() => { onClose(); onCartOpen(); }}>
            <ShoppingBag size={17} strokeWidth={1.5} />
            Bag
            {itemCount > 0 && <span className="mobile-menu__cart-count">{itemCount}</span>}
          </button>
        </div>

        {/* Auth */}
        <div className="mobile-menu__auth">
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onSignup}>
            Sign Up
          </button>
          <button className="mobile-menu__login-link" onClick={onLogin}>
            Already have an account? <strong>Log in</strong>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Auth Demo Modal ── */
function AuthModal({ mode, onClose, onSwitch }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  const isLogin = mode === 'login';

  return (
    <div
      className="auth-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={isLogin ? 'Log in' : 'Create account'}
    >
      <div className="auth-modal">
        <button className="auth-modal__close btn-ghost" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3l12 12M15 3L3 15"/>
          </svg>
        </button>

        <div style={{ marginBottom: '0.75rem' }}>
          <img src="/images/brand/logo.png" alt="ZEVRA Clothing Store" style={{ height: '36px', width: 'auto' }} />
        </div>
        <h2 className="auth-modal__title">{isLogin ? 'Welcome back' : 'Create account'}</h2>
        <p className="auth-modal__sub">
          {isLogin ? 'Log in to your account.' : 'Join ZEVRA for a better shopping experience.'}
        </p>

        <form className="auth-modal__form" onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <div className="auth-modal__field">
              <label className="auth-modal__label" htmlFor="auth-name">Full name</label>
              <input id="auth-name" type="text" className="auth-modal__input" placeholder="Your name" autoComplete="name" />
            </div>
          )}
          <div className="auth-modal__field">
            <label className="auth-modal__label" htmlFor="auth-email">Email</label>
            <input id="auth-email" type="email" className="auth-modal__input" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="auth-modal__field">
            <label className="auth-modal__label" htmlFor="auth-password">Password</label>
            <input id="auth-password" type="password" className="auth-modal__input" placeholder="••••••••" autoComplete={isLogin ? 'current-password' : 'new-password'} />
          </div>

          <div className="auth-modal__demo-note" role="note">
            Demo only — no account is created or authenticated.
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}>
            {isLogin ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <p className="auth-modal__switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button className="auth-modal__switch-btn" onClick={() => onSwitch(isLogin ? 'signup' : 'login')}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
}
