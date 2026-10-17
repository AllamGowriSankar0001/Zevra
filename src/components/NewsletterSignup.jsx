import { useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSignup() {
  const [email, setEmail]     = useState('');
  const [status, setStatus]   = useState('idle'); // idle | success | error
  const [errMsg, setErrMsg]   = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setErrMsg('');
    if (!email.trim()) {
      setErrMsg('Please enter your email address.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setErrMsg('Please enter a valid email address.');
      return;
    }
    // UI-only — no backend integration
    setStatus('success');
  }

  return (
    <section className="nl" aria-labelledby="nl-title">
      <div className="nl__inner container">
        <div className="nl__text">
          <span className="nl__eyebrow">Stay Connected</span>
          <h2 className="nl__title" id="nl-title">Stay in the ZEVRA Loop</h2>
          <p className="nl__sub">
            Be the first to discover new arrivals, collections, and exclusive updates.
          </p>
        </div>

        <div className="nl__form-wrap">
          {status === 'success' ? (
            <div className="nl__success" role="status">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <p className="nl__success-title">You're on the list.</p>
                <p className="nl__success-note">
                  This is a demo — subscriptions are not stored.
                </p>
              </div>
            </div>
          ) : (
            <form className="nl__form" onSubmit={handleSubmit} noValidate>
              <div className="nl__input-wrap">
                <label htmlFor="nl-email" className="sr-only">Email address</label>
                <input
                  id="nl-email"
                  type="email"
                  className={`nl__input${errMsg ? ' nl__input--error' : ''}`}
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrMsg(''); }}
                  autoComplete="email"
                  aria-describedby={errMsg ? 'nl-error' : undefined}
                />
                <button type="submit" className="nl__btn btn-primary">
                  Subscribe
                </button>
              </div>
              {errMsg && (
                <p id="nl-error" className="nl__error" role="alert">{errMsg}</p>
              )}
              <p className="nl__disclaimer">
                Demo only — no data is collected or stored.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
