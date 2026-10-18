import { useState, useCallback } from 'react';

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

import AboutUs          from './pages/AboutUs';
import ContactUs        from './pages/ContactUs';
import FAQs             from './pages/FAQs';
import ShippingReturns  from './pages/ShippingReturns';
import PrivacyPolicy    from './pages/PrivacyPolicy';
import TermsConditions  from './pages/TermsConditions';
import LoginPage        from './pages/LoginPage';
import SignupPage       from './pages/SignupPage';

import { useCart } from './hooks/useCart';
import { useAuth } from './hooks/useAuth';
import './styles/global.css';
import './styles/components.css';

const INFO_PAGES = {
  about:    AboutUs,
  contact:  ContactUs,
  faqs:     FAQs,
  shipping: ShippingReturns,
  privacy:  PrivacyPolicy,
  terms:    TermsConditions,
};

export default function App() {
  const { items, addItem, updateQuantity, removeItem, itemCount, subtotal } = useCart();
  const { user, logout } = useAuth();

  const [activeCategory, setActiveCategory] = useState('all');
  const [cartOpen,   setCartOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewTrigger, setQuickViewTrigger] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);

  const handleOpenQuickView = useCallback((product, trigger) => {
    setQuickViewProduct(product); setQuickViewTrigger(trigger);
  }, []);
  const handleCloseQuickView = useCallback(() => setQuickViewProduct(null), []);
  const handleAddToCart = useCallback((p, c, s, q) => addItem(p, c, s, q), [addItem]);

  function scrollToCollection(id = 'all') {
    setCurrentPage(null);
    setActiveCategory(id);
    setTimeout(() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  function openPage(page) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goHome() {
    setCurrentPage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const PageComponent = currentPage && INFO_PAGES[currentPage];

  return (
    <>
      <Header
        itemCount={itemCount}
        onCartOpen={() => setCartOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
        activeCategory={activeCategory}
        onCategoryChange={(id) => scrollToCollection(id)}
        onLogoClick={goHome}
        user={user}
        onLogout={logout}
        onLogin={() => openPage('login')}
        onSignup={() => openPage('signup')}
      />

      <main id="main-content">
        {currentPage === 'login'  ? <LoginPage  onSuccess={goHome} onGoSignup={() => openPage('signup')} /> :
         currentPage === 'signup' ? <SignupPage onSuccess={goHome} onGoLogin={() => openPage('login')} /> :
         PageComponent            ? <PageComponent /> : (
          <>
            <Hero />
            <MarqueeBanner />
            <ShopByCategory onCategoryChange={scrollToCollection} />
            <NewArrivals onQuickView={handleOpenQuickView} onViewAll={() => scrollToCollection('all')} />
            <ZevraEdit onExplore={() => scrollToCollection('all')} />
            <ProductGrid activeCategory={activeCategory} onCategoryChange={setActiveCategory} onQuickView={handleOpenQuickView} />
            <Bestsellers onQuickView={handleOpenQuickView} onShopAll={() => scrollToCollection('all')} />
            <ZevraStandard />
            <NewsletterSignup />
          </>
        )}
      </main>

      <Footer onCategoryChange={scrollToCollection} onPageChange={openPage} />

      {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} onQuickView={handleOpenQuickView} />}
      {cartOpen && <CartDrawer items={items} subtotal={subtotal} onClose={() => setCartOpen(false)} onUpdateQuantity={updateQuantity} onRemove={removeItem} />}
      {quickViewProduct && <ProductQuickView product={quickViewProduct} onClose={handleCloseQuickView} onAddToCart={handleAddToCart} triggerRef={quickViewTrigger} />}
    </>
  );
}
