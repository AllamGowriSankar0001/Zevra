const mongoose = require('mongoose');
const Product  = require('../models/Product');
const Category = require('../models/Category');
const User     = require('../models/User');
const Order    = require('../models/Order');
const Cart     = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const PasswordResetToken = require('../models/PasswordResetToken');

const LOW_STOCK_THRESHOLD = 5;

function isValidImageUrl(value) {
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeProductFields(body) {
  const fields = {};
  if (Array.isArray(body.images)) {
    fields.images = body.images
      .filter(image => image && typeof image.url === 'string' && image.url.trim())
      .map(image => ({ ...image, url: image.url.trim() }));
  }
  if (Array.isArray(body.colors)) {
    fields.colors = body.colors
      .filter(color => color && typeof color.name === 'string' && color.name.trim()
        && typeof color.hex === 'string' && color.hex.trim())
      .map(color => ({ ...color, name: color.name.trim(), hex: color.hex.trim() }));
  }
  return fields;
}

/* ── Helpers ─────────────────────────────────────────────────── */
function paginate(page, limit) {
  page  = Math.max(1, parseInt(page)  || 1);
  limit = Math.min(100, Math.max(1, parseInt(limit) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

function customerFilter(status, role) {
  const filter = {};
  if (status === 'active') filter.isActive = true;
  if (status === 'inactive') filter.isActive = false;
  if (role === 'customer' || role === 'admin') filter.role = role;
  return filter;
}

/* ══════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════ */
async function getDashboard(req, res, next) {
  try {
    const [
      totalProducts,
      totalCustomers,
      totalOrders,
      productsByCategory,
      ordersByStatus,
      recentOrders,
      allProducts,
      categories,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true, isAdminCreated: true }),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      Product.aggregate([
        { $match: { isActive: true, isAdminCreated: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5)
        .populate({ path: 'user', select: 'fullName email' }).lean(),
      Product.find({ isActive: true, isAdminCreated: true }).select('name stock variants').lean(),
      Category.find().select('slug name').lean(),
    ]);

    const categoryNames = new Map(categories.map(category => [category.slug, category.name]));
    const categorizedProducts = productsByCategory.map(category => ({
      ...category,
      name: categoryNames.get(category._id) || category._id,
    }));

    // Low stock: variants with stock <= threshold
    let lowStockCount = 0;
    for (const p of allProducts) {
      if (p.variants?.length) {
        for (const variant of p.variants) {
          if (variant.stock <= LOW_STOCK_THRESHOLD) lowStockCount++;
        }
      } else if ((p.stock ?? 0) <= LOW_STOCK_THRESHOLD) {
        lowStockCount++;
      }
    }

    res.json({
      success: true,
      data: {
        stats: { totalProducts, totalCustomers, totalOrders, lowStockCount },
        productsByCategory: categorizedProducts,
        ordersByStatus,
        recentOrders,
      },
    });
  } catch (err) { next(err); }
}

/* ══════════════════════════════════════════════════════════════
   PRODUCTS
══════════════════════════════════════════════════════════════ */
async function listProducts(req, res, next) {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);
    const filter = { isAdminCreated: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status === 'active')   filter.isActive = true;
    if (req.query.status === 'inactive') filter.isActive = false;
    if (req.query.search) {
      const s = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: s, $options: 'i' };
    }
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);
    res.json({ success: true, data: { products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
  } catch (err) { next(err); }
}

async function createProduct(req, res, next) {
  try {
    if (req.body.images !== undefined && !Array.isArray(req.body.images))
      return res.status(400).json({ success: false, message: 'Product images must be a list.' });
    if (Array.isArray(req.body.images) && req.body.images.some(image =>
      !image || typeof image.url !== 'string' || (image.url.trim() && !isValidImageUrl(image.url.trim()))
    ))
      return res.status(400).json({ success: false, message: 'Enter a full http(s) image URL or a site path starting with /.' });
    const slug = typeof req.body.slug === 'string' ? req.body.slug.trim().toLowerCase() : '';
    const categorySlug = typeof req.body.category === 'string' ? req.body.category.trim().toLowerCase() : '';
    const category = await Category.findOne({ slug: categorySlug, isActive: true });
    if (!category)
      return res.status(400).json({ success: false, message: 'Choose an active product category.' });
    if (slug) {
      const exists = await Product.findOne({ slug });
      if (exists) return res.status(409).json({ success: false, message: 'Slug already exists.' });
    }
    const product = await Product.create({
      ...req.body,
      ...normalizeProductFields(req.body),
      name: typeof req.body.name === 'string' ? req.body.name.trim() : req.body.name,
      slug,
      category: categorySlug,
      isAdminCreated: true,
    });
    res.status(201).json({ success: true, message: 'Product created.', data: { product } });
  } catch (err) { next(err); }
}

async function getProduct(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: 'Invalid ID.' });
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, data: { product } });
  } catch (err) { next(err); }
}

async function updateProduct(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: 'Invalid ID.' });
    if (req.body.images !== undefined && !Array.isArray(req.body.images))
      return res.status(400).json({ success: false, message: 'Product images must be a list.' });
    if (Array.isArray(req.body.images) && req.body.images.some(image =>
      !image || typeof image.url !== 'string' || (image.url.trim() && !isValidImageUrl(image.url.trim()))
    ))
      return res.status(400).json({ success: false, message: 'Enter a full http(s) image URL or a site path starting with /.' });
    const categorySlug = typeof req.body.category === 'string' ? req.body.category.trim().toLowerCase() : req.body.category;
    if (categorySlug && !await Category.exists({ slug: categorySlug, isActive: true }))
      return res.status(400).json({ success: false, message: 'Choose an active product category.' });
    // Prevent slug collision
    if (req.body.slug) {
      const conflict = await Product.findOne({ slug: req.body.slug, _id: { $ne: req.params.id } });
      if (conflict) return res.status(409).json({ success: false, message: 'Slug already in use.' });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...normalizeProductFields(req.body),
        ...(req.body.name !== undefined && typeof req.body.name === 'string' ? { name: req.body.name.trim() } : {}),
        ...(req.body.slug !== undefined && typeof req.body.slug === 'string' ? { slug: req.body.slug.trim().toLowerCase() } : {}),
        ...(categorySlug !== undefined ? { category: categorySlug } : {}),
        isAdminCreated: true,
      },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product updated.', data: { product } });
  } catch (err) { next(err); }
}

async function updateProductStatus(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: 'Invalid ID.' });
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean')
      return res.status(400).json({ success: false, message: 'isActive must be boolean.' });
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive, ...(isActive ? { isAdminCreated: true } : {}) },
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: `Product ${isActive ? 'activated' : 'deactivated'}.`, data: { product } });
  } catch (err) { next(err); }
}

/* ══════════════════════════════════════════════════════════════
   CATEGORIES
══════════════════════════════════════════════════════════════ */
async function getCategories(req, res, next) {
  try {
    const counts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const map = Object.fromEntries(counts.map(c => [c._id, c.count]));
    const records = await Category.find().sort({ name: 1 }).lean();
    const categories = records.map(category => ({
      id: category._id,
      slug: category.slug,
      name: category.name,
      description: category.description,
      sizeOptions: category.sizeOptions || [],
      imageUrl: category.imageUrl || '',
      isActive: category.isActive,
      count: map[category.slug] || 0,
    }));
    res.json({ success: true, data: { categories } });
  } catch (err) { next(err); }
}

async function createCategory(req, res, next) {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const slug = typeof req.body.slug === 'string'
      ? req.body.slug.trim().toLowerCase()
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const description = typeof req.body.description === 'string' ? req.body.description.trim() : '';
    if (req.body.imageUrl !== undefined && typeof req.body.imageUrl !== 'string')
      return res.status(400).json({ success: false, message: 'Category image URL must be text.' });
    const imageUrl = typeof req.body.imageUrl === 'string' ? req.body.imageUrl.trim() : '';
    if (imageUrl && !isValidImageUrl(imageUrl))
      return res.status(400).json({ success: false, message: 'Enter a full http(s) image URL or a site path starting with /.' });
    if (req.body.sizeOptions !== undefined && !Array.isArray(req.body.sizeOptions))
      return res.status(400).json({ success: false, message: 'Size options must be a list.' });
    const sizeOptions = Array.isArray(req.body.sizeOptions)
      ? [...new Set(req.body.sizeOptions.filter(size => typeof size === 'string').map(size => size.trim()).filter(Boolean))]
      : [];
    if (!name || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
      return res.status(400).json({ success: false, message: 'Enter a category name and a valid URL slug.' });
    const exists = await Category.exists({ slug });
    if (exists) return res.status(409).json({ success: false, message: 'A category with this slug already exists.' });
    const category = await Category.create({ name, slug, description, sizeOptions, imageUrl });
    res.status(201).json({ success: true, message: 'Category created.', data: { category } });
  } catch (err) { next(err); }
}

async function updateCategory(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: 'Invalid category ID.' });
    const updates = {};
    if (typeof req.body.name === 'string') updates.name = req.body.name.trim();
    if (typeof req.body.description === 'string') updates.description = req.body.description.trim();
    if (req.body.imageUrl !== undefined && typeof req.body.imageUrl !== 'string')
      return res.status(400).json({ success: false, message: 'Category image URL must be text.' });
    if (typeof req.body.imageUrl === 'string') {
      updates.imageUrl = req.body.imageUrl.trim();
      if (updates.imageUrl && !isValidImageUrl(updates.imageUrl))
        return res.status(400).json({ success: false, message: 'Enter a full http(s) image URL or a site path starting with /.' });
    }
    if (req.body.sizeOptions !== undefined && !Array.isArray(req.body.sizeOptions))
      return res.status(400).json({ success: false, message: 'Size options must be a list.' });
    if (Array.isArray(req.body.sizeOptions)) {
      updates.sizeOptions = [...new Set(req.body.sizeOptions
        .filter(size => typeof size === 'string')
        .map(size => size.trim())
        .filter(Boolean))];
    }
    if (!updates.name && typeof req.body.name === 'string')
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, message: 'Category updated.', data: { category } });
  } catch (err) { next(err); }
}

async function deleteCategory(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: 'Invalid category ID.' });
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    const productCount = await Product.countDocuments({ category: category.slug });
    if (productCount > 0)
      return res.status(409).json({ success: false, message: 'Move or delete this category’s products before removing the category.' });
    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted.' });
  } catch (err) { next(err); }
}

/* ══════════════════════════════════════════════════════════════
   INVENTORY
══════════════════════════════════════════════════════════════ */
async function getInventory(req, res, next) {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);
    const filter = { isAdminCreated: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      const s = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: s, $options: 'i' };
    }

    const products = await Product.find(filter).sort({ name: 1 }).lean();

    // Flatten to variant rows
    let rows = [];
    for (const p of products) {
      if (p.variants && p.variants.length > 0) {
        for (const v of p.variants) {
          rows.push({
            productId:   p._id,
            productName: p.name,
            category:    p.category,
            sku:         v.sku || '',
            color:       v.color || '',
            size:        v.size  || '',
            stock:       v.stock,
            isActive:    v.isActive,
            variantIndex: p.variants.indexOf(v),
          });
        }
      } else {
        // No variants — show product-level row
        rows.push({
          productId:    p._id,
          productName:  p.name,
          category:     p.category,
          sku:          '',
          color:        '',
          size:         p.sizes?.join(', ') || '',
          stock:        p.stock ?? 0,
          isActive:     p.isActive,
          variantIndex: -1,
        });
      }
    }

    if (req.query.lowStock === 'true')
      rows = rows.filter(r => r.stock !== null && r.stock <= LOW_STOCK_THRESHOLD);
    if (req.query.outOfStock === 'true')
      rows = rows.filter(r => r.stock === 0);

    const total = rows.length;
    const paged = rows.slice(skip, skip + limit);
    res.json({ success: true, data: { rows: paged, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
  } catch (err) { next(err); }
}

async function updateVariantStock(req, res, next) {
  try {
    const { productId, variantIndex } = req.params;
    const { stock } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    const idx = parseInt(variantIndex);
    if (isNaN(idx) || idx < 0)
      return res.status(400).json({ success: false, message: 'Invalid variant index.' });
    if (!Number.isInteger(stock) || stock < 0)
      return res.status(400).json({ success: false, message: 'Stock must be a non-negative whole number.' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    if (!product.variants[idx]) return res.status(404).json({ success: false, message: 'Variant not found.' });

    product.variants[idx].stock = stock;
    await product.save();
    res.json({ success: true, message: 'Stock updated.', data: { variant: product.variants[idx] } });
  } catch (err) { next(err); }
}

async function updateProductStock(req, res, next) {
  try {
    const { productId } = req.params;
    const { stock } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    if (!Number.isInteger(stock) || stock < 0)
      return res.status(400).json({ success: false, message: 'Stock must be a non-negative whole number.' });

    const product = await Product.findOneAndUpdate(
      { _id: productId, isAdminCreated: true, 'variants.0': { $exists: false } },
      { $set: { stock } },
      { new: true, runValidators: true },
    ).select('_id name stock');
    if (!product) {
      const existing = await Product.exists({ _id: productId, isAdminCreated: true });
      if (!existing) return res.status(404).json({ success: false, message: 'Product not found.' });
      return res.status(409).json({ success: false, message: 'This product has variants. Update stock for each variant instead.' });
    }
    res.json({ success: true, message: 'Product stock updated.', data: { product } });
  } catch (err) { next(err); }
}

/* ══════════════════════════════════════════════════════════════
   CUSTOMERS
══════════════════════════════════════════════════════════════ */
async function listCustomers(req, res, next) {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);
    const filter = customerFilter(req.query.status, req.query.role);
    if (req.query.search) {
      const s = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { fullName: { $regex: s, $options: 'i' } },
        { email:    { $regex: s, $options: 'i' } },
      ];
    }
    const [customers, total] = await Promise.all([
      User.find(filter).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, data: { customers, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
  } catch (err) { next(err); }
}

async function getCustomer(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: 'Invalid ID.' });
    const customer = await User.findById(req.params.id).select('-passwordHash').lean();
    if (!customer) return res.status(404).json({ success: false, message: 'User not found.' });
    const orderCount = await Order.countDocuments({ user: req.params.id });
    res.json({ success: true, data: { customer, orderCount } });
  } catch (err) { next(err); }
}

async function updateCustomer(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: 'Invalid ID.' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const { fullName, email, phone, role } = req.body;
    if (fullName !== undefined) {
      if (typeof fullName !== 'string' || !fullName.trim())
        return res.status(400).json({ success: false, message: 'Name is required.' });
      user.fullName = fullName.trim();
    }
    if (email !== undefined) {
      if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
      user.email = email.trim().toLowerCase();
    }
    if (phone !== undefined) {
      if (typeof phone !== 'string')
        return res.status(400).json({ success: false, message: 'Phone must be text.' });
      user.phone = phone.trim();
    }
    if (role !== undefined) {
      if (!['customer', 'admin'].includes(role))
        return res.status(400).json({ success: false, message: 'Role must be customer or admin.' });
      if (String(req.adminUser.id) === req.params.id && role !== 'admin')
        return res.status(400).json({ success: false, message: 'You cannot remove your own admin role.' });
      if (user.role === 'admin' && role !== 'admin') {
        const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
        if (adminCount <= 1)
          return res.status(400).json({ success: false, message: 'Cannot change the role of the last active admin.' });
      }
      user.role = role;
    }

    await user.save();
    res.json({ success: true, message: 'User updated.', data: { user: user.toSafeObject() } });
  } catch (err) { next(err); }
}

async function deleteCustomer(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: 'Invalid ID.' });
    if (String(req.adminUser.id) === req.params.id)
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (user.isActive && adminCount <= 1)
        return res.status(400).json({ success: false, message: 'Cannot delete the last active admin.' });
    }

    const orderCount = await Order.countDocuments({ user: user._id });
    if (orderCount > 0)
      return res.status(409).json({ success: false, message: 'This user has order history and cannot be deleted. Deactivate the account to preserve order records.' });

    await Promise.all([
      Cart.deleteOne({ user: user._id }),
      Wishlist.deleteMany({ user: user._id }),
      PasswordResetToken.deleteMany({ user: user._id }),
    ]);
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) { next(err); }
}

async function updateCustomerStatus(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: 'Invalid ID.' });
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean')
      return res.status(400).json({ success: false, message: 'isActive must be boolean.' });

    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ success: false, message: 'User not found.' });
    if (target.role === 'admin')
      return res.status(400).json({ success: false, message: 'Admin accounts cannot be deactivated here.' });

    target.isActive = isActive;
    await target.save();
    res.json({ success: true, message: `Account ${isActive ? 'activated' : 'deactivated'}.` });
  } catch (err) { next(err); }
}

/* ══════════════════════════════════════════════════════════════
   ORDERS
══════════════════════════════════════════════════════════════ */
const VALID_ORDER_STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled'];

async function listOrders(req, res, next) {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);
    const filter = {};
    if (req.query.status && VALID_ORDER_STATUSES.includes(req.query.status)) filter.status = req.query.status;
    if (req.query.search) filter.orderNumber = { $regex: req.query.search, $options: 'i' };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 }).skip(skip).limit(limit)
        .populate({ path: 'user', select: 'fullName email' }).lean(),
      Order.countDocuments(filter),
    ]);
    res.json({ success: true, data: { orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
  } catch (err) { next(err); }
}

async function getOrder(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: 'Invalid ID.' });
    const order = await Order.findById(req.params.id)
      .populate({ path: 'user', select: 'fullName email phone' }).lean();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: { order } });
  } catch (err) { next(err); }
}

async function updateOrderStatus(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: 'Invalid ID.' });
    const { status } = req.body;
    if (!VALID_ORDER_STATUSES.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, message: 'Order status updated.', data: { order } });
  } catch (err) { next(err); }
}

module.exports = {
  getDashboard,
  listProducts, createProduct, getProduct, updateProduct, updateProductStatus,
  getCategories,
  createCategory, updateCategory, deleteCategory,
  getInventory, updateVariantStock, updateProductStock,
  listCustomers, getCustomer, updateCustomer, deleteCustomer, updateCustomerStatus,
  listOrders, getOrder, updateOrderStatus,
};
