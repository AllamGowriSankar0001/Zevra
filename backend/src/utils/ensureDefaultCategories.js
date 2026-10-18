const Category = require('../models/Category');
const CategoryBootstrap = require('../models/CategoryBootstrap');
const DEFAULT_CATEGORIES = require('../config/defaultCategories');

async function ensureDefaultCategories() {
  if (await CategoryBootstrap.exists({ _id: 'default-categories' })) return;
  if (!(await Category.exists({}))) {
    await Category.insertMany(DEFAULT_CATEGORIES, { ordered: true });
  }
  await CategoryBootstrap.create({ _id: 'default-categories' });
}

module.exports = ensureDefaultCategories;
