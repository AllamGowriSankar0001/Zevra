const { z } = require('zod');

const addItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required.'),
  quantity:  z.number().int().min(1).default(1),
  color:     z.string().trim().default(''),
  size:      z.string().trim().default(''),
  sku:       z.string().trim().optional(),
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1.'),
  color:    z.string().trim().optional(),
  size:     z.string().trim().optional(),
});

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }));
      return res.status(400).json({ success: false, message: 'Invalid request.', errors });
    }
    req.body = result.data;
    next();
  };
}

module.exports = { addItemSchema, updateItemSchema, validate };
