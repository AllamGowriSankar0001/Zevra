/**
 * ZEVRA — Central Product Dataset
 * All product data lives here. Replace image paths with real assets.
 */

export const CATEGORIES = [
  { id: 'all',      label: 'All' },
  { id: 'shirts',   label: 'Shirts' },
  { id: 'tshirts',  label: 'T-Shirts' },
  { id: 'jeans',    label: 'Jeans' },
  { id: 'trousers', label: 'Trousers' },
];

export const products = [
  {
    id: 'p001',
    name: 'Essential Oxford Shirt',
    category: 'shirts',
    price: 3990,
    images: ['/images/products/oxford-shirt-1.jpg', '/images/products/oxford-shirt-2.jpg'],
    colours: [
      { name: 'White', hex: '#F5F5F0' },
      { name: 'Light Blue', hex: '#C8D8E8' },
      { name: 'Ecru', hex: '#E8E0D0' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description:
      'A classic Oxford weave shirt with a button-down collar. Relaxed through the chest, slightly tapered at the waist. Made from 100% cotton Oxford cloth.',
  },
  {
    id: 'p002',
    name: 'Relaxed Poplin Shirt',
    category: 'shirts',
    price: 3490,
    images: ['/images/products/poplin-shirt-1.jpg', '/images/products/poplin-shirt-2.jpg'],
    colours: [
      { name: 'White', hex: '#F5F5F0' },
      { name: 'Stone', hex: '#C8B89A' },
      { name: 'Navy', hex: '#1C2B4B' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description:
      'A loose, easy-wearing poplin shirt with a spread collar and a clean, unstructured front. Fine 100% cotton poplin. Works equally well tucked or untucked.',
  },
  {
    id: 'p003',
    name: 'Everyday Crewneck Tee',
    category: 'tshirts',
    price: 1490,
    images: ['/images/products/crewneck-tee-1.jpg', '/images/products/crewneck-tee-2.jpg'],
    colours: [
      { name: 'White', hex: '#F5F5F0' },
      { name: 'Black', hex: '#111111' },
      { name: 'Slate Grey', hex: '#8A9098' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description:
      'Our everyday crewneck in a medium-weight jersey. Relaxed fit with a clean neckline. 180 gsm combed cotton. Washes well and holds its shape.',
  },
  {
    id: 'p004',
    name: 'Heavyweight Cotton Tee',
    category: 'tshirts',
    price: 1990,
    images: ['/images/products/heavy-tee-1.jpg', '/images/products/heavy-tee-2.jpg'],
    colours: [
      { name: 'Off White', hex: '#EDE8E0' },
      { name: 'Faded Black', hex: '#2C2C2C' },
      { name: 'Olive', hex: '#6B6B4A' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description:
      'A boxy, substantial tee cut from 260 gsm ring-spun cotton. Drop shoulders, ribbed cuffs and neckline. Built to last and soften with every wash.',
  },
  {
    id: 'p005',
    name: 'Straight Fit Denim',
    category: 'jeans',
    price: 4990,
    images: ['/images/products/straight-denim-1.jpg', '/images/products/straight-denim-2.jpg'],
    colours: [
      { name: 'Indigo', hex: '#2B3A5E' },
      { name: 'Mid Wash', hex: '#6A7FA0' },
      { name: 'Ecru', hex: '#D8CFC0' },
    ],
    sizes: ['28', '30', '32', '34', '36'],
    description:
      'A clean straight-leg jean with a mid rise. Cut from 12 oz selvedge-style denim that softens and molds over time. Five pockets, clean coin pocket, metal rivet hardware.',
  },
  {
    id: 'p006',
    name: 'Relaxed Fit Denim',
    category: 'jeans',
    price: 4490,
    images: ['/images/products/relaxed-denim-1.jpg', '/images/products/relaxed-denim-2.jpg'],
    colours: [
      { name: 'Washed Blue', hex: '#7A95B2' },
      { name: 'Dark Wash', hex: '#1E2A42' },
    ],
    sizes: ['28', '30', '32', '34', '36'],
    description:
      'A wider, roomier take on a classic jean. High rise, relaxed through the thigh, slightly tapered below the knee. Soft 11 oz cotton-blend denim with minimal distressing.',
  },
  {
    id: 'p007',
    name: 'Tailored Everyday Trousers',
    category: 'trousers',
    price: 4290,
    images: ['/images/products/tailored-trousers-1.jpg', '/images/products/tailored-trousers-2.jpg'],
    colours: [
      { name: 'Charcoal', hex: '#3C3C3C' },
      { name: 'Sand', hex: '#C8B898' },
      { name: 'Navy', hex: '#1C2B4B' },
    ],
    sizes: ['28', '30', '32', '34', '36'],
    description:
      'Clean, straight-leg tailored trousers with a mid rise and a single reverse pleat. Woven from a wool-blend fabric with a smooth, refined drape.',
  },
  {
    id: 'p008',
    name: 'Pleated Straight Trousers',
    category: 'trousers',
    price: 4790,
    images: ['/images/products/pleated-trousers-1.jpg', '/images/products/pleated-trousers-2.jpg'],
    colours: [
      { name: 'Camel', hex: '#C09060' },
      { name: 'Charcoal', hex: '#3C3C3C' },
      { name: 'Cream', hex: '#EDE8DE' },
    ],
    sizes: ['28', '30', '32', '34', '36'],
    description:
      'Double-pleated trousers with a generous fit through the hip and thigh. Cropped slightly above the ankle. Cut from a textured Italian cotton-linen blend.',
  },
];

/** Format a price in INR */
export function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}
