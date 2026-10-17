export default function ShippingReturns() {
  return (
    <div className="info-page">
      <div className="info-page__inner container">
        <div className="info-page__hero">
          <span className="info-page__eyebrow">Delivery & Returns</span>
          <h1 className="info-page__title">Shipping & Returns</h1>
        </div>
        <div className="info-page__body">
          <div className="contact-note">Demo storefront — no real orders are processed.</div>
          <h2>Delivery</h2>
          <p>Standard delivery within India takes 3–7 business days from the date of dispatch. Orders are typically dispatched within 1–2 business days.</p>
          <table className="info-table">
            <thead><tr><th>Method</th><th>Estimate</th><th>Cost</th></tr></thead>
            <tbody>
              <tr><td>Standard</td><td>3–7 business days</td><td>₹99</td></tr>
              <tr><td>Express</td><td>1–3 business days</td><td>₹199</td></tr>
              <tr><td>Free delivery</td><td>3–7 business days</td><td>On orders above ₹2,999</td></tr>
            </tbody>
          </table>
          <h2>Returns</h2>
          <p>We accept returns within 30 days of the delivery date. Items must be:</p>
          <ul>
            <li>Unworn and unwashed</li>
            <li>In their original packaging with tags attached</li>
            <li>Free from perfume, marks, or damage</li>
          </ul>
          <h2>How to Return</h2>
          <p>To initiate a return, contact us via the Contact Us page with your order number. We will arrange a pickup or provide a return label.</p>
          <h2>Refunds</h2>
          <p>Approved refunds are processed within 5–7 business days to the original payment method.</p>
        </div>
      </div>
    </div>
  );
}
