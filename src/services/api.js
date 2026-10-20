/**
 * ZEVRA — Central API client
 * Base URL reads from Vite env variable (falls back to localhost:4001)
 * All requests send session cookies automatically (credentials: 'include')
 */

const rawApiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const BASE = rawApiUrl
  ? (rawApiUrl.endsWith('/api/v1') ? rawApiUrl : `${rawApiUrl}/api/v1`)
  : '/api/v1';

class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors || [];
  }
}

export function normalizeProduct(product) {
  return {
    ...product,
    id: String(product._id || product.id),
    images: (product.images || []).map(image => typeof image === 'string' ? image : image?.url).filter(Boolean),
    colours: product.colours || product.colors || [],
  };
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'include',
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.message || 'Request failed.', res.status, data.errors);
  }
  return data;
}

// Auth
export const authApi = {
  register:       (body) => request('/auth/register',        { method: 'POST', body }),
  login:          (body) => request('/auth/login',           { method: 'POST', body }),
  me:             ()     => request('/auth/me'),
  logout:         ()     => request('/auth/logout',          { method: 'POST' }),
  forgotPassword: (body) => request('/auth/forgot-password', { method: 'POST', body }),
  resetPassword:  (body) => request('/auth/reset-password',  { method: 'POST', body }),
};

// Products
export const productApi = {
  list: async (params = {}) => {
    const response = await request(`/products?${new URLSearchParams(params)}`);
    return {
      ...response,
      data: {
        ...response.data,
        products: response.data.products.map(normalizeProduct),
      },
    };
  },
  listAll: async () => {
    const firstPage = await productApi.list({ page: 1, limit: 100 });
    const pageCount = Math.max(1, firstPage.data.pagination?.pages || 1);
    if (pageCount === 1) return firstPage.data.products;

    const remainingPages = await Promise.all(
      Array.from({ length: pageCount - 1 }, (_, index) =>
        productApi.list({ page: index + 2, limit: 100 })
      )
    );
    return [
      ...firstPage.data.products,
      ...remainingPages.flatMap(response => response.data.products),
    ];
  },
  categories: async () => {
    const response = await request('/products/categories');
    return {
      ...response,
      data: {
        ...response.data,
        categories: response.data.categories.map(category => ({
          ...category,
          id: category.slug || category.id,
          label: category.name || category.label,
        })),
      },
    };
  },
  get:        (slug)        => request(`/products/${slug}`),
};

// Cart
export const cartApi = {
  get:        ()           => request('/cart'),
  addItem:    (body)       => request('/cart/items',        { method: 'POST',   body }),
  updateItem: (itemId, body) => request(`/cart/items/${itemId}`, { method: 'PATCH', body }),
  removeItem: (itemId)     => request(`/cart/items/${itemId}`,   { method: 'DELETE' }),
  clear:      ()           => request('/cart',              { method: 'DELETE' }),
};

// Wishlist
export const wishlistApi = {
  get:        ()          => request('/wishlist'),
  add:        (productId) => request('/wishlist/items',           { method: 'POST',   body: { productId } }),
  remove:     (productId) => request(`/wishlist/items/${productId}`, { method: 'DELETE' }),
};

// Orders
export const orderApi = {
  list: (params = {}) => request(`/orders?${new URLSearchParams(params)}`),
  get:  (orderId)     => request(`/orders/${orderId}`),
};

// Users
export const userApi = {
  getProfile:        ()               => request('/users/me'),
  updateProfile:     (body)           => request('/users/me',                          { method: 'PATCH',  body }),
  getAddresses:      ()               => request('/users/me/addresses'),
  addAddress:        (body)           => request('/users/me/addresses',                { method: 'POST',   body }),
  updateAddress:     (id, body)       => request(`/users/me/addresses/${id}`,          { method: 'PATCH',  body }),
  deleteAddress:     (id)             => request(`/users/me/addresses/${id}`,          { method: 'DELETE' }),
  setDefaultAddress: (id)             => request(`/users/me/addresses/${id}/default`,  { method: 'PATCH' }),
};

export { ApiError };
