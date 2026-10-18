import { BRAND } from '../config/brand';

const INFO_LINKS = [
  { label: 'About Us',          page: 'about' },
  { label: 'Contact Us',        page: 'contact' },
  { label: 'FAQs',              page: 'faqs' },
  { label: 'Shipping & Returns',page: 'shipping' },
  { label: 'Privacy Policy',    page: 'privacy' },
  { label: 'Terms & Conditions',page: 'terms' },
];

export default function Footer({ categories, onCategoryChange, onPageChange }) {
  const cats = categories || [];

  function go(id) {
    onCategoryChange(id);
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner container">
        <div className="footer__brand">
          <img src="/images/brand/logo.png" alt="ZEVRA" className="footer__logo" loading="lazy" />
          <p className="footer__about">{BRAND.about}</p>
          <p className="footer__tagline">{BRAND.tagline}</p>
        </div>
        <div className="footer__col">
          <p className="footer__col-title">Shop</p>
          <ul className="footer__links">
            {cats.map(c => (
              <li key={c.id}>
                <button className="footer__link" onClick={() => go(c.id)}>{c.label}</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer__col">
          <p className="footer__col-title">Information</p>
          <ul className="footer__links">
            {INFO_LINKS.map(l => (
              <li key={l.page}>
                <button className="footer__link" onClick={() => onPageChange(l.page)}>{l.label}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer__bottom container">
        <span className="footer__copy">© {new Date().getFullYear()} ZEVRA. All rights reserved.</span>
        <span className="footer__demo">Demo storefront — no orders processed</span>
      </div>
    </footer>
  );
}
