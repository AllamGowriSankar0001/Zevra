import { BRAND } from '../config/brand';
import { CATEGORIES } from '../data/products';

const INFO_LINKS = [
  { label: 'About Us' },
  { label: 'Contact Us' },
  { label: 'FAQs' },
  { label: 'Shipping & Returns' },
  { label: 'Privacy Policy' },
  { label: 'Terms & Conditions' },
];

export default function Footer({ onCategoryChange }) {
  const cats = CATEGORIES.filter(c => c.id !== 'all');

  function handleCategoryClick(id) {
    onCategoryChange(id);
    const el = document.getElementById('collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <footer className="footer" role="contentinfo">

      {/* Top divider */}
      <div className="footer__top-bar" />

      <div className="footer__main container">

        {/* Brand column */}
        <div className="footer__brand">
          <img
            src="/images/brand/logo.png"
            alt="ZEVRA Clothing Store"
            className="footer__logo"
            loading="lazy"
          />
          <p className="footer__about">{BRAND.about}</p>
          <p className="footer__tagline">{BRAND.tagline}</p>
        </div>

        {/* Shop column */}
        <div className="footer__col">
          <p className="footer__col-title">Shop</p>
          <ul className="footer__links">
            {cats.map(cat => (
              <li key={cat.id}>
                <button className="footer__link" onClick={() => handleCategoryClick(cat.id)}>
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Information column */}
        <div className="footer__col">
          <p className="footer__col-title">Information</p>
          <ul className="footer__links">
            {INFO_LINKS.map(link => (
              <li key={link.label}>
                <span className="footer__link footer__link--static">
                  {link.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter micro column */}
        <div className="footer__col footer__col--nl">
          <p className="footer__col-title">Stay Updated</p>
          <p className="footer__nl-copy">
            New arrivals and exclusive updates, straight to your inbox.
          </p>
          <a href="#newsletter" className="footer__nl-link">
            Subscribe →
          </a>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer__bottom container">
        <span className="footer__copy">
          © {new Date().getFullYear()} ZEVRA. All rights reserved.
        </span>
        <span className="footer__demo">
          Demo storefront — no orders are processed
        </span>
      </div>

    </footer>
  );
}
