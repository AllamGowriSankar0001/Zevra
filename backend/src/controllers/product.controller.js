const Product = require('../models/Product');
const Category = require('../models/Category');
const VALID_SORTS = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, 'price-asc': { price: 1 }, 'price-desc': { price: -1 } };

// GET /api/v1/products
async function listProducts(req, res, next) {
  try {
    let { category, search, page = 1, limit = 20, sort = 'newest' } = req.query;
    page  = Math.max(1, parseInt(page)  || 1);
    limit = Math.min(100, Math.max(1, parseInt(limit) || 20));

    const filter = { isActive: true, isAdminCreated: true };
    if (category && typeof category === 'string') {
      filter.category = category.toLowerCase();
    }
    if (search && typeof search === 'string' && search.trim()) {
      const safe = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { description: { $regex: safe, $options: 'i' } },
      ];
    }

    const sortObj = VALID_SORTS[sort] || VALID_SORTS.newest;
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip((page - 1) * limit).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    res.json({ success: true, data: { products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
  } catch (err) { next(err); }
}

// GET /api/v1/products/categories
async function getCategories(req, res, next) {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean();
    res.json({
      success: true,
      data: {
        categories: categories.map(category => ({
          id: category.slug,
          slug: category.slug,
          name: category.name,
          label: category.name,
          description: category.description,
          sizeOptions: category.sizeOptions || [],
          imageUrl: category.imageUrl || '',
        })),
      },
    });
  } catch (err) { next(err); }
}

// GET /api/v1/products/:slug
async function getProduct(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true, isAdminCreated: true }).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, data: { product } });
  } catch (err) { next(err); }
}

module.exports = { listProducts, getProduct, getCategories };
