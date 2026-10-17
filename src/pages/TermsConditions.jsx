export default function TermsConditions() {
  return (
    <div className="info-page">
      <div className="info-page__inner container">
        <div className="info-page__hero">
          <span className="info-page__eyebrow">Legal</span>
          <h1 className="info-page__title">Terms & Conditions</h1>
        </div>
        <div className="info-page__body">
          <div className="contact-note">This is a demo storefront. These terms are illustrative only.</div>
          <p><strong>Last updated:</strong> {new Date().getFullYear()}</p>
          <h2>1. Use of This Website</h2>
          <p>By accessing this website, you agree to these terms. This is a demonstration storefront — no real transactions take place and no products are sold or shipped.</p>
          <h2>2. Products and Pricing</h2>
          <p>All products, descriptions, and prices displayed are for demonstration purposes only. Availability, pricing, and specifications may change without notice.</p>
          <h2>3. Intellectual Property</h2>
          <p>All content on this site, including the ZEVRA brand name, logo, illustrations, and copy, is the property of ZEVRA and may not be reproduced without permission.</p>
          <h2>4. Limitation of Liability</h2>
          <p>ZEVRA accepts no liability for any loss or damage arising from your use of this demo website.</p>
          <h2>5. Changes to These Terms</h2>
          <p>We reserve the right to update these terms at any time. Continued use of the website constitutes acceptance of any changes.</p>
          <h2>6. Contact</h2>
          <p>For any questions about these terms, please contact us via the Contact Us page.</p>
        </div>
      </div>
    </div>
  );
}
