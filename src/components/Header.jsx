import { useState, useEffect } from 'react';
import { ChevronDown, Search, ShoppingBag } from 'lucide-react';

export default function Header({ itemCount, categories, onCartOpen, onSearchOpen, activeCategory, onCategoryChange, onLogoClick, user, onLogout, onLogin, onSignup, onProfile, onOrders, onWishlist }) {
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

  const navCategories = categories || [];
  const parentCategories = navCategories.filter(c => !c.parent);
  const getSubcategories = (parentSlug) => navCategories.filter(c => c.parent === parentSlug);

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`} role="banner">
        <div className="container header__inner">

          {/* Logo */}
          <button
            className="header__logo btn-ghost"
            onClick={() => onLogoClick ? onLogoClick() : window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="ZEVRA — go to home"
          >
            <img src="/images/brand/logo.png" alt="ZEVRA Clothing Store" className="header__logo-img" />
          </button>

          {/* Desktop nav */}
          <nav className="header__nav" aria-label="Product categories">
            {parentCategories.map(cat => {
              const subcats = getSubcategories(cat.id);
              const isSubActive = subcats.some(s => s.id === activeCategory);
              const isCatActive = activeCategory === cat.id || isSubActive;

              if (subcats.length === 0) {
                return (
                  <button
                    key={cat.id}
                    className={`header__nav-link${isCatActive ? ' active' : ''}`}
                    onClick={() => handleNavClick(cat.id)}
                  >
                    {cat.label}
                  </button>
                );
              }

              return (
                <div key={cat.id} className="header__nav-dropdown-wrap">
                  <button
                    className={`header__nav-link header__nav-link--has-sub${isCatActive ? ' active' : ''}`}
                    onClick={() => handleNavClick(cat.id)}
                  >
                    <span>{cat.label}</span>
                    <ChevronDown size={13} className="header__nav-arrow" aria-hidden="true" />
                  </button>
                  <div className="header__nav-dropdown">
                    <button
                      className="header__dropdown-item header__dropdown-item--all"
                      onClick={() => handleNavClick(cat.id)}
                    >
                      All {cat.label}
                    </button>
                    {subcats.map(sub => (
                      <button
                        key={sub.id}
                        className={`header__dropdown-item${activeCategory === sub.id ? ' active' : ''}`}
                        onClick={() => handleNavClick(sub.id)}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
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

            {/* Login / Sign Up — desktop */}
            {user ? (
              <div className="header__account-wrap">
                <button
                  className="header__auth-link header__desktop-only header__account-btn"
                  aria-haspopup="true"
                  aria-label="Open account menu"
                >
                  {(user.fullName || user.name || 'Account').split(' ')[0]}
                  <ChevronDown size={14} aria-hidden="true" />
                </button>
                <div className="header__account-menu">
                  <button className="header__account-item" onClick={onProfile}>My Profile</button>
                  <button className="header__account-item" onClick={onOrders}>My Orders</button>
                  <button className="header__account-item" onClick={onWishlist}>Wishlist</button>
                  <div className="header__account-divider" />
                  <button className="header__account-item header__account-item--danger" onClick={onLogout}>Logout</button>
                </div>
              </div>
            ) : (
              <>
                <button className="header__auth-link header__desktop-only" onClick={onLogin}>Login</button>
                <button className="header__auth-signup header__desktop-only" onClick={onSignup}>Sign Up</button>
              </>
            )}

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
            categories={navCategories}
            onSearchOpen={() => { setMenuOpen(false); onSearchOpen(); }}
            onCartOpen={() => { setMenuOpen(false); onCartOpen(); }}
            itemCount={itemCount}
            activeCategory={activeCategory}
            user={user}
            onLogin={() => { setMenuOpen(false); onLogin(); }}
            onSignup={() => { setMenuOpen(false); onSignup(); }}
            onLogout={() => { setMenuOpen(false); onLogout(); }}
            onProfile={() => { setMenuOpen(false); onProfile?.(); }}
            onOrders={() => { setMenuOpen(false); onOrders?.(); }}
            onWishlist={() => { setMenuOpen(false); onWishlist?.(); }}
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
function MobileMenuInline({ onClose, categories, onCategoryChange, onSearchOpen, onCartOpen, itemCount, activeCategory, user, onLogin, onSignup, onLogout, onProfile, onOrders, onWishlist }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const navCategories = categories || [];
  const parentCategories = navCategories.filter(c => !c.parent);
  const getSubcategories = (parentSlug) => navCategories.filter(c => c.parent === parentSlug);

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
          {parentCategories.map(cat => {
            const subcats = getSubcategories(cat.id);
            const isSubActive = subcats.some(s => s.id === activeCategory);
            const isCatActive = activeCategory === cat.id || isSubActive;

            if (subcats.length === 0) {
              return (
                <button
                  key={cat.id}
                  className={`mobile-menu__nav-link${isCatActive ? ' active' : ''}`}
                  onClick={() => onCategoryChange(cat.id)}
                >
                  {cat.label}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M4 8h8M9 5l3 3-3 3" />
                  </svg>
                </button>
              );
            }

            return (
              <div key={cat.id} className="mobile-menu__group">
                <button
                  className={`mobile-menu__nav-link mobile-menu__nav-link--parent${isCatActive ? ' active' : ''}`}
                  onClick={() => onCategoryChange(cat.id)}
                >
                  <span>{cat.label}</span>
                  <span className="mobile-menu__all-tag">View All</span>
                </button>
                <div className="mobile-menu__subcats">
                  {subcats.map(sub => (
                    <button
                      key={sub.id}
                      className={`mobile-menu__sub-link${activeCategory === sub.id ? ' active' : ''}`}
                      onClick={() => onCategoryChange(sub.id)}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
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
          {user ? (
            <>
              <p className="mobile-menu__user">Hi, {(user.fullName || user.name || '').split(' ')[0]} 👋</p>
              <button className="mobile-menu__nav-link" onClick={onProfile}>My Profile</button>
              <button className="mobile-menu__nav-link" onClick={onOrders}>My Orders</button>
              <button className="mobile-menu__nav-link" onClick={onWishlist}>Wishlist</button>
              <button className="btn-primary" style={{ width:'100%', justifyContent:'center', marginTop:'0.5rem' }} onClick={onLogout}>Log Out</button>
            </>
          ) : (
            <>
              <button className="btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={onSignup}>Sign Up</button>
              <button className="mobile-menu__login-link" onClick={onLogin}>Already have an account? <strong>Log in</strong></button>
            </>
          )}
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
