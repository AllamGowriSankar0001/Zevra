require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const Product  = require('../models/Product');
const Category = require('../models/Category');
const DEFAULT_CATEGORIES = require('../config/defaultCategories');

const PRODUCTS = [
  {
    slug: 'essential-oxford-shirt', name: 'Essential Oxford Shirt', category: 'shirts', price: 3990,
    description: 'A classic Oxford weave shirt with a button-down collar. Relaxed through the chest, slightly tapered at the waist. Made from 100% cotton Oxford cloth.',
    images: [
      { url: '/images/products/oxford-shirt-1.jpg', alt: 'Essential Oxford Shirt', isPrimary: true },
      { url: '/images/products/oxford-shirt-2.jpg', alt: 'Essential Oxford Shirt alternate' },
    ],
    colors: [{ name: 'White', hex: '#F5F5F0' }, { name: 'Light Blue', hex: '#C8D8E8' }, { name: 'Ecru', hex: '#E8E0D0' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    slug: 'relaxed-poplin-shirt', name: 'Relaxed Poplin Shirt', category: 'shirts', price: 3490,
    description: 'A loose, easy-wearing poplin shirt with a spread collar and clean, unstructured front. Fine 100% cotton poplin.',
    images: [
      { url: '/images/products/poplin-shirt-1.jpg', alt: 'Relaxed Poplin Shirt', isPrimary: true },
      { url: '/images/products/poplin-shirt-2.jpg', alt: 'Relaxed Poplin Shirt alternate' },
    ],
    colors: [{ name: 'White', hex: '#F5F5F0' }, { name: 'Stone', hex: '#C8B89A' }, { name: 'Navy', hex: '#1C2B4B' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    slug: 'everyday-crewneck-tee', name: 'Everyday Crewneck Tee', category: 'tshirts', price: 1490,
    description: 'Our everyday crewneck in a medium-weight jersey. Relaxed fit with a clean neckline. 180 gsm combed cotton.',
    images: [
      { url: '/images/products/crewneck-tee-1.jpg', alt: 'Everyday Crewneck Tee', isPrimary: true },
      { url: '/images/products/crewneck-tee-2.jpg', alt: 'Everyday Crewneck Tee alternate' },
    ],
    colors: [{ name: 'White', hex: '#F5F5F0' }, { name: 'Black', hex: '#111111' }, { name: 'Slate Grey', hex: '#8A9098' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    slug: 'heavyweight-cotton-tee', name: 'Heavyweight Cotton Tee', category: 'tshirts', price: 1990,
    description: 'A boxy, substantial tee cut from 260 gsm ring-spun cotton. Drop shoulders, ribbed cuffs and neckline.',
    images: [
      { url: '/images/products/heavy-tee-1.jpg', alt: 'Heavyweight Cotton Tee', isPrimary: true },
      { url: '/images/products/heavy-tee-2.jpg', alt: 'Heavyweight Cotton Tee alternate' },
    ],
    colors: [{ name: 'Off White', hex: '#EDE8E0' }, { name: 'Faded Black', hex: '#2C2C2C' }, { name: 'Olive', hex: '#6B6B4A' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    slug: 'straight-fit-denim', name: 'Straight Fit Denim', category: 'jeans', price: 4990,
    description: 'A clean straight-leg jean with a mid rise. Cut from 12 oz selvedge-style denim that softens over time.',
    images: [
      { url: '/images/products/straight-denim-1.jpg', alt: 'Straight Fit Denim', isPrimary: true },
      { url: '/images/products/straight-denim-2.jpg', alt: 'Straight Fit Denim alternate' },
    ],
    colors: [{ name: 'Indigo', hex: '#2B3A5E' }, { name: 'Mid Wash', hex: '#6A7FA0' }, { name: 'Ecru', hex: '#D8CFC0' }],
    sizes: ['28', '30', '32', '34', '36'],
  },
  {
    slug: 'relaxed-fit-denim', name: 'Relaxed Fit Denim', category: 'jeans', price: 4490,
    description: 'A wider, roomier take on a classic jean. High rise, relaxed through the thigh, slightly tapered below the knee.',
    images: [
      { url: '/images/products/relaxed-denim-1.jpg', alt: 'Relaxed Fit Denim', isPrimary: true },
      { url: '/images/products/relaxed-denim-2.jpg', alt: 'Relaxed Fit Denim alternate' },
    ],
    colors: [{ name: 'Washed Blue', hex: '#7A95B2' }, { name: 'Dark Wash', hex: '#1E2A42' }],
    sizes: ['28', '30', '32', '34', '36'],
  },
  {
    slug: 'tailored-everyday-trousers', name: 'Tailored Everyday Trousers', category: 'trousers', price: 4290,
    description: 'Clean, straight-leg tailored trousers with a mid rise and a single reverse pleat. Woven from a wool-blend fabric.',
    images: [
      { url: '/images/products/tailored-trousers-1.jpg', alt: 'Tailored Everyday Trousers', isPrimary: true },
      { url: '/images/products/tailored-trousers-2.jpg', alt: 'Tailored Everyday Trousers alternate' },
    ],
    colors: [{ name: 'Charcoal', hex: '#3C3C3C' }, { name: 'Sand', hex: '#C8B898' }, { name: 'Navy', hex: '#1C2B4B' }],
    sizes: ['28', '30', '32', '34', '36'],
  },
  {
    slug: 'pleated-straight-trousers', name: 'Pleated Straight Trousers', category: 'trousers', price: 4790,
    description: 'Double-pleated trousers with a generous fit through the hip and thigh. Cut from a textured Italian cotton-linen blend.',
    images: [
      { url: '/images/products/pleated-trousers-1.jpg', alt: 'Pleated Straight Trousers', isPrimary: true },
      { url: '/images/products/pleated-trousers-2.jpg', alt: 'Pleated Straight Trousers alternate' },
    ],
    colors: [{ name: 'Camel', hex: '#C09060' }, { name: 'Charcoal', hex: '#3C3C3C' }, { name: 'Cream', hex: '#EDE8DE' }],
    sizes: ['28', '30', '32', '34', '36'],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Promise.all(DEFAULT_CATEGORIES.map(category =>
      Category.updateOne({ slug: category.slug }, { $setOnInsert: category }, { upsert: true })
    ));

    let created = 0, updated = 0;
    for (const p of PRODUCTS) {
      const result = await Product.findOneAndUpdate(
        { slug: p.slug },
        { $setOnInsert: { ...p, isAdminCreated: false } },
        { upsert: true, new: true }
      );
      if (result.createdAt?.getTime() === result.updatedAt?.getTime()) created++;
      else updated++;
    }
    console.log(`✅ Seed complete — ${created} created, ${updated} existing (not overwritten)`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
