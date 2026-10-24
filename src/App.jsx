import { useState, useCallback, useEffect } from 'react';

import Header           from './components/Header';
import Hero             from './components/Hero';
import MarqueeBanner    from './components/MarqueeBanner';
import ShopByCategory   from './components/ShopByCategory';
import NewArrivals      from './components/NewArrivals';
import ZevraEdit        from './components/ZevraEdit';
import ProductGrid      from './components/ProductGrid';
import Bestsellers      from './components/Bestsellers';
import ZevraStandard    from './components/ZevraStandard';
import NewsletterSignup from './components/NewsletterSignup';
import Footer           from './components/Footer';
import ProductQuickView from './components/ProductQuickView';
import CartDrawer       from './components/CartDrawer';
import SearchPanel      from './components/SearchPanel';
import ScrollReveal     from './components/ScrollReveal';

import AboutUs          from './pages/AboutUs';
import ContactUs        from './pages/ContactUs';
import FAQs             from './pages/FAQs';
import ShippingReturns  from './pages/ShippingReturns';
import PrivacyPolicy    from './pages/PrivacyPolicy';
import TermsConditions  from './pages/TermsConditions';
import LoginPage        from './pages/LoginPage';
import SignupPage        from './pages/SignupPage';
import CategoryPage     from './pages/CategoryPage';
import MyProfile        from './pages/MyProfile';
import MyOrders         from './pages/MyOrders';
import MyWishlist       from './pages/MyWishlist';

import { useCart } from './hooks/useCart';
import { useAuth } from './hooks/useAuth';
import { productApi } from './services/api';
import './styles/global.css';
import './styles/components.css';

const INFO_PAGES = {
  about: AboutUs, contact: ContactUs, faqs: FAQs,
  shipping: ShippingReturns, privacy: PrivacyPolicy, terms: TermsConditions,
};

export default function App() {
  const { items, addItem, updateQuantity, removeItem, itemCount, subtotal } = useCart();
  const {
    user,
    logout,
    setUser,
    requireLoginTrigger,
    clearAuthNotice,
    pendingAction,
    toggleWishlist,
    triggerRequireLogin,
  } = useAuth();

  const [catalog, setCatalog] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');
  const [categoriesError, setCategoriesError] = useState('');
  const [categoryRefreshToken, setCategoryRefreshToken] = useState(0);
  const [cartOpen,   setCartOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewTrigger, setQuickViewTrigger] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [returnPage, setReturnPage] = useState(null);

  // Automatically navigate to login page when requireLogin is triggered
  useEffect(() => {
    if (requireLoginTrigger) {
      if (currentPage !== 'login' && currentPage !== 'signup') {
        setReturnPage(currentPage);
      }
      setCurrentPage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [requireLoginTrigger]);

  async function handleAuthSuccess() {
    if (pendingAction) {
      if (pendingAction.type === 'wishlist' && pendingAction.productId) {
        try {
          await toggleWishlist(pendingAction.productId);
        } catch {
          // ignore
        }
      } else if (pendingAction.type === 'cart' && pendingAction.product) {
        addItem(
          pendingAction.product,
          pendingAction.colour || '',
          pendingAction.size || '',
          pendingAction.quantity || 1
        );
        setCartOpen(true);
      }
    }

    clearAuthNotice();

    if (returnPage) {
      openPage(returnPage);
      setReturnPage(null);
    } else {
      goHome();
    }
  }

  useEffect(() => {
    let active = true;
    productApi.listAll()
      .then(products => {
        if (active) setCatalog(products);
      })
      .catch(error => {
        if (active) setCatalogError(error.message || 'Unable to load products.');
      })
      .finally(() => {
        if (active) setCatalogLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    productApi.categories()
      .then(response => {
        if (!active) return;
        setCategories(response.data.categories);
        setCategoriesError('');
      })
      .catch(error => {
        if (!active) return;
        setCategories([]);
        setCategoriesError(error.message || 'Unable to load categories.');
      });
    return () => { active = false; };
  }, [categoryRefreshToken]);

  const handleOpenQuickView = useCallback((product, trigger) => {
    setQuickViewProduct(product); setQuickViewTrigger(trigger);
  }, []);
  const handleCloseQuickView = useCallback(() => setQuickViewProduct(null), []);
  const handleAddToCart = useCallback((p, c, s, q) => addItem(p, c, s, q), [addItem]);

  function openPage(page) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goHome() {
    setCurrentPage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCategoryChange(id) {
    if (categories.some(category => category.id === id)) openPage(id);
    else goHome();
  }

  function handleLogout() {
    logout();
    goHome();
  }

  function handleGoBack() {
    clearAuthNotice();
    if (returnPage) {
      openPage(returnPage);
      setReturnPage(null);
    } else {
      goHome();
    }
  }

  const isAuthPage     = currentPage === 'login' || currentPage === 'signup';
  const isCategoryPage = categories.some(category => category.id === currentPage);
  const InfoComponent  = currentPage && INFO_PAGES[currentPage];

  function renderPage() {
    if (currentPage === 'login')    return <LoginPage   onSuccess={handleAuthSuccess} onGoSignup={() => openPage('signup')} onBack={handleGoBack} />;
    if (currentPage === 'signup')   return <SignupPage  onSuccess={handleAuthSuccess} onGoLogin={() => openPage('login')} onBack={handleGoBack} />;
    if (currentPage === 'profile')  return user ? <MyProfile   user={user} onUpdate={u => setUser?.(u)} /> : <LoginPage onSuccess={handleAuthSuccess} onGoSignup={() => openPage('signup')} onBack={handleGoBack} />;
    if (currentPage === 'orders')   return user ? <MyOrders /> : <LoginPage onSuccess={handleAuthSuccess} onGoSignup={() => openPage('signup')} onBack={handleGoBack} />;
    if (currentPage === 'wishlist') return user ? <MyWishlist  onQuickView={handleOpenQuickView} /> : <LoginPage onSuccess={handleAuthSuccess} onGoSignup={() => openPage('signup')} onBack={handleGoBack} />;
    if (isCategoryPage)             return <CategoryPage categoryId={currentPage} categories={categories} products={catalog} loading={catalogLoading} error={catalogError} onQuickView={handleOpenQuickView} onCategoryChange={handleCategoryChange} />;
    if (InfoComponent)              return <ScrollReveal><InfoComponent /></ScrollReveal>;
    return (
      <>
        <ScrollReveal><Hero /></ScrollReveal>
        <ScrollReveal><MarqueeBanner /></ScrollReveal>
        <ScrollReveal><ShopByCategory categories={categories} products={catalog} onCategoryChange={handleCategoryChange} /></ScrollReveal>
        <ScrollReveal><NewArrivals products={catalog} loading={catalogLoading} error={catalogError} onQuickView={handleOpenQuickView} onViewAll={goHome} /></ScrollReveal>
        <ScrollReveal><ZevraEdit onExplore={goHome} /></ScrollReveal>
        <ScrollReveal><ProductGrid categories={categories} products={catalog} loading={catalogLoading} error={catalogError} activeCategory="all" onCategoryChange={handleCategoryChange} onQuickView={handleOpenQuickView} /></ScrollReveal>
        <ScrollReveal><Bestsellers products={catalog} loading={catalogLoading} error={catalogError} onQuickView={handleOpenQuickView} onShopAll={goHome} /></ScrollReveal>
        <ScrollReveal><ZevraStandard /></ScrollReveal>
        <ScrollReveal><NewsletterSignup /></ScrollReveal>
      </>
    );
  }

  return (
    <>
      {!isAuthPage && (
        <Header
          itemCount={itemCount}
          onCartOpen={() => setCartOpen(true)}
          onSearchOpen={() => setSearchOpen(true)}
          activeCategory={isCategoryPage ? currentPage : 'all'}
          categories={categories}
          onCategoryChange={handleCategoryChange}
          onLogoClick={goHome}
          user={user}
          onLogout={handleLogout}
          onLogin={() => { clearAuthNotice(); openPage('login'); }}
          onSignup={() => { clearAuthNotice(); openPage('signup'); }}
          onProfile={() => openPage('profile')}
          onOrders={() => openPage('orders')}
          onWishlist={() => {
            if (!user) {
              triggerRequireLogin('Please sign in to view your wishlist.');
            } else {
              openPage('wishlist');
            }
          }}
        />
      )}

      <main id="main-content">
        {categoriesError && !isAuthPage && (
          <div className="catalog-error container" role="alert">
            <span>Categories could not be loaded: {categoriesError}</span>
            <button type="button" onClick={() => setCategoryRefreshToken(token => token + 1)}>Try again</button>
          </div>
        )}
        {renderPage()}
      </main>

      {!isAuthPage && (
        <Footer categories={categories} onCategoryChange={handleCategoryChange} onPageChange={openPage} />
      )}

      {searchOpen && <SearchPanel products={catalog} loading={catalogLoading} error={catalogError} onClose={() => setSearchOpen(false)} onQuickView={handleOpenQuickView} />}
      {cartOpen && <CartDrawer items={items} subtotal={subtotal} onClose={() => setCartOpen(false)} onUpdateQuantity={updateQuantity} onRemove={removeItem} />}
      {quickViewProduct && <ProductQuickView product={quickViewProduct} onClose={handleCloseQuickView} onAddToCart={handleAddToCart} triggerRef={quickViewTrigger} />}
    </>
  );
}
