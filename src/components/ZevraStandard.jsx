const pillars = [
  {
    icon: <VersatileIcon />,
    title: 'Versatile Design',
    copy: 'Styles that move seamlessly between occasions — from morning to evening, casual to considered.',
  },
  {
    icon: <ComfortIcon />,
    title: 'Everyday Comfort',
    copy: 'Clothing cut and crafted with comfort and practicality in mind, without sacrificing how it looks.',
  },
  {
    icon: <StyleIcon />,
    title: 'Effortless Style',
    copy: 'Simple, considered pieces that take the effort out of dressing well, every single day.',
  },
];

export default function ZevraStandard() {
  return (
    <section className="zstd" aria-labelledby="zstd-title">
      <div className="zstd__inner container">
        <div className="zstd__head">
          <span className="zstd__eyebrow">The ZEVRA Standard</span>
          <h2 className="zstd__title" id="zstd-title">Built around you.</h2>
        </div>

        <div className="zstd__grid">
          {pillars.map((p, i) => (
            <div key={i} className="zstd__pillar">
              <div className="zstd__icon" aria-hidden="true">{p.icon}</div>
              <h3 className="zstd__pillar-title">{p.title}</h3>
              <p className="zstd__pillar-copy">{p.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Minimal line icons ── */
function VersatileIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.25"/>
      <path d="M11 18 L18 11 L25 18 L18 25 Z" stroke="currentColor" strokeWidth="1.25" fill="none" strokeLinejoin="round"/>
      <circle cx="18" cy="18" r="2.5" fill="currentColor"/>
    </svg>
  );
}

function ComfortIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M7 14 Q7 8 18 8 Q29 8 29 14 L29 26 Q29 30 18 30 Q7 30 7 26 Z" stroke="currentColor" strokeWidth="1.25" fill="none"/>
      <path d="M7 14 Q18 18 29 14" stroke="currentColor" strokeWidth="1.25" fill="none"/>
      <line x1="13" y1="21" x2="23" y2="21" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  );
}

function StyleIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18 6 L20.5 14 L28.5 14 L22 19 L24.5 27 L18 22.5 L11.5 27 L14 19 L7.5 14 L15.5 14 Z" stroke="currentColor" strokeWidth="1.25" fill="none" strokeLinejoin="round"/>
    </svg>
  );
}
