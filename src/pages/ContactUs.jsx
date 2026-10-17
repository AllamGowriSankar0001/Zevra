import { useState } from 'react';

export default function ContactUs() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [err, setErr] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) { setErr('Please enter your name.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setErr('Please enter a valid email.'); return; }
    if (!form.message.trim()) { setErr('Please enter a message.'); return; }
    setErr('');
    setSent(true);
  }

  return (
    <div className="info-page">
      <div className="info-page__inner container">
        <div className="info-page__hero">
          <span className="info-page__eyebrow">Get in Touch</span>
          <h1 className="info-page__title">Contact Us</h1>
        </div>
        <div className="info-page__body">
          <p>Have a question about an order, product, or anything else? We're here to help.</p>
          <div className="contact-note">
            <strong>Demo storefront</strong> — this form does not send messages. No data is collected.
          </div>
          {sent ? (
            <div className="contact-success">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <p>Thanks for reaching out. We'll be in touch soon.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="contact-form__row">
                <div className="contact-form__field">
                  <label htmlFor="cf-name">Name</label>
                  <input id="cf-name" type="text" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                </div>
                <div className="contact-form__field">
                  <label htmlFor="cf-email">Email</label>
                  <input id="cf-email" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
                </div>
              </div>
              <div className="contact-form__field">
                <label htmlFor="cf-msg">Message</label>
                <textarea id="cf-msg" rows={5} placeholder="How can we help?" value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} />
              </div>
              {err && <p className="contact-form__error" role="alert">{err}</p>}
              <button type="submit" className="btn-primary">Send Message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
