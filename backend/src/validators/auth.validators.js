const { z } = require('zod');

const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters.'),
  email:    z.string().trim().email('Enter a valid email address.').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  phone:    z.string().trim().optional(),
});

const loginSchema = z.object({
  email:    z.string().trim().email('Enter a valid email address.').toLowerCase(),
  password: z.string().min(1, 'Password is required.'),
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').toLowerCase(),
});

const resetPasswordSchema = z.object({
  token:    z.string().min(1),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }));
      return res.status(400).json({ success: false, message: 'Please correct the highlighted fields.', errors });
    }
    req.body = result.data;
    next();
  };
}

module.exports = { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, validate };
