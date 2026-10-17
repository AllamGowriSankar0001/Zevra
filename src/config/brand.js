/**
 * ZEVRA — Central Brand & Asset Configuration
 * Replace asset paths here without touching any component.
 */

export const BRAND = {
  name: 'ZEVRA',
  tagline: 'Made for your everyday.',
  about:
    'ZEVRA brings shirts, tees, denim and trousers into one considered everyday wardrobe.',
};

/**
 * Hero assets.
 *
 * bgSrc    — Full-bleed hero background image (JPG / PNG / WebP).
 *            Set to null to use the built-in SVG illustration.
 *
 * modelSrc — Kept for a standalone model cutout approach (legacy option).
 *            Not used when bgSrc is set.
 */
export const HERO_ASSETS = {
  bgSrc:    null,   // e.g. '/images/brand/hero-bg.jpg'  — set when photo is ready
  modelSrc: null,   // e.g. '/images/brand/model.png'   — standalone cutout (optional)
  modelAlt: 'A man wearing a white overshirt and tailored dark trousers',
};

export const LOGO = {
  src: '/images/brand/zevra-logo.png',
  alt: 'ZEVRA logo',
};
