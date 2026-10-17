export default function PrivacyPolicy() {
  return (
    <div className="info-page">
      <div className="info-page__inner container">
        <div className="info-page__hero">
          <span className="info-page__eyebrow">Legal</span>
          <h1 className="info-page__title">Privacy Policy</h1>
        </div>
        <div className="info-page__body">
          <div className="contact-note">This is a demo storefront. No personal data is collected, stored, or processed.</div>
          <p><strong>Last updated:</strong> {new Date().getFullYear()}</p>
          <h2>Information We Collect</h2>
          <p>When you use this demo storefront, no personal information is collected. The shopping bag is stored locally in your browser and is not transmitted to any server.</p>
          <h2>Cookies</h2>
          <p>This site does not use tracking cookies or third-party analytics in its current demo state.</p>
          <h2>Third Parties</h2>
          <p>We do not share, sell, or transfer any personal data to third parties.</p>
          <h2>Your Rights</h2>
          <p>You have the right to access, correct, and delete any personal data we hold about you. As this is a demo with no data collection, there is nothing to access or delete.</p>
          <h2>Contact</h2>
          <p>For privacy-related questions, please use the Contact Us page.</p>
        </div>
      </div>
    </div>
  );
}
