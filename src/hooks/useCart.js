import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'zevra_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Validate each item has the expected shape
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.productId === 'string' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota exceeded or private browsing — fail silently
  }
}

/** Generate a stable line-item ID from product + variant */
function lineItemId(productId, colour, size) {
  return `${productId}::${colour}::${size}`;
}

export function useCart() {
  const [items, setItems] = useState(loadCart);

  // Persist whenever items change
  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback((product, colour, size, quantity = 1) => {
    const id = lineItemId(product.id, colour, size);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [
        ...prev,
        {
          id,
          productId: product.id,
          name: product.name,
          price: product.price,
          colour,
          size,
          quantity,
          image: product.images[0] || null,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { items, addItem, updateQuantity, removeItem, clearCart, itemCount, subtotal };
}
