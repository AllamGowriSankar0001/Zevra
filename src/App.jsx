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

import { useCart } from './hooks/useCart';

import './styles/global.css';
import './styles/components.css';

export default function App() {
  const { items, addItem, updateQuantity, removeItem, itemCount, subtotal } = useCart();

  const [activeCategory, setActiveCategory] = useState('all');
  const [cartOpen,   setCartOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewTrigger, setQuickViewTrigger] = useState(null);

  const handleOpenQuickView = useCallback((product, trigger) => {
    setQuickViewProduct(product);
    setQuickViewTrigger(trigger);
  }, []);

  const handleCloseQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  const handleAddToCart = useCallback((product, colour, size, quantity) => {
    addItem(product, colour, size, quantity);
  }, [addItem]);

  function scrollToCollection(categoryId = 'all') {
    setActiveCategory(categoryId);
    setTimeout(() => {
      const el = document.getElementById('collection');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  return (
    <>
      <Header
        itemCount={itemCount}
        onCartOpen={() => setCartOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <main id="main-content">
        {/* 1. Hero */}
        <Hero />

        {/* 2. Marquee ticker */}
        <MarqueeBanner />

        {/* 3. Shop by Category */}
        <ShopByCategory onCategoryChange={(id) => scrollToCollection(id)} />

        {/* 4. New Arrivals */}
        <NewArrivals
          onQuickView={handleOpenQuickView}
          onViewAll={() => scrollToCollection('all')}
        />

        {/* 5. The ZEVRA Edit */}
        <ZevraEdit onExplore={() => scrollToCollection('all')} />

        {/* 6. Full product collection */}
        <ProductGrid
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onQuickView={handleOpenQuickView}
        />

        {/* 7. Bestsellers */}
        <Bestsellers
          onQuickView={handleOpenQuickView}
          onShopAll={() => scrollToCollection('all')}
        />

        {/* 8. The ZEVRA Standard */}
        <ZevraStandard />

        {/* 9. Newsletter */}
        <NewsletterSignup />
      </main>

      {/* 10. Footer */}
      <Footer onCategoryChange={(id) => scrollToCollection(id)} />

      {/* ── Overlays ── */}
      {searchOpen && (
        <SearchPanel
          onClose={() => setSearchOpen(false)}
          onQuickView={handleOpenQuickView}
        />
      )}

      {cartOpen && (
        <CartDrawer
          items={items}
          subtotal={subtotal}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
        />
      )}

      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={handleCloseQuickView}
          onAddToCart={handleAddToCart}
          triggerRef={quickViewTrigger}
        />
      )}
    </>
  );
}
