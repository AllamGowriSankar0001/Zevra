import { useState } from 'react';

const faqs = [
  { q: 'What sizes do you carry?', a: 'Our shirts and T-shirts are available in XS through XXL. Jeans and trousers are available in waist sizes 28 through 36.' },
  { q: 'How do I find my size?', a: 'A full size guide is coming soon. In the meantime, our pieces are cut with a relaxed, everyday fit. If you are between sizes, we recommend sizing up.' },
  { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in their original condition. Full details are in our Shipping & Returns page.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3–7 business days. Express options may be available at checkout. This is a demo — no real orders are processed.' },
  { q: 'Can I change or cancel my order?', a: 'Orders can be amended within 1 hour of placement. After that, changes may not be possible. Please contact us as soon as possible.' },
  { q: 'Do you ship internationally?', a: 'We currently deliver within India. International shipping is planned for a future launch.' },
  { q: 'How do I care for my ZEVRA pieces?', a: 'Each garment includes care instructions on the label. Most pieces can be machine-washed on a gentle cycle in cold water.' },
  { q: 'Is this a real store?', a: 'ZEVRA is currently a demo storefront. No real orders, payments, or accounts are processed.' },
];

function Item({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? ' faq-item--open' : ''}`}>
      <button className="faq-item__q" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        {q}
        <span className="faq-item__icon" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="faq-item__a">{a}</p>}
    </div>
  );
}

export default function FAQs() {
  return (
    <div className="info-page">
      <div className="info-page__inner container">
        <div className="info-page__hero">
          <span className="info-page__eyebrow">Help Centre</span>
          <h1 className="info-page__title">Frequently Asked Questions</h1>
        </div>
        <div className="info-page__body">
          <div className="faq-list">
            {faqs.map((f, i) => <Item key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
