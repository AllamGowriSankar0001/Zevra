import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { authApi, wishlistApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wishlistIds, setWishlistIds] = useState([]);
  const [authNotice, setAuthNotice] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const [requireLoginTrigger, setRequireLoginTrigger] = useState(null);

  // Fetch current session on mount
  useEffect(() => {
    let active = true;
    authApi.me()
      .then(data => {
        if (!active) return;
        setUser(data.data.user || null);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  // Sync wishlist whenever user changes
  useEffect(() => {
    let active = true;
    if (user) {
      wishlistApi.get()
        .then(response => {
          if (!active) return;
          const items = response.data?.items || [];
          const ids = items
            .map(item => item.product?._id || item.product?.id || item.product)
            .filter(Boolean);
          setWishlistIds(ids);
        })
        .catch(() => {
          if (active) setWishlistIds([]);
        });
    } else {
      setWishlistIds([]);
    }
    return () => { active = false; };
  }, [user]);

  const register = useCallback(async (fullName, email, password, phone) => {
    setLoading(true);
    setError('');
    try {
      const data = await authApi.register({ fullName, email, password, phone });
      setUser(data.data.user);
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const data = await authApi.login({ email, password });
      setUser(data.data.user);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    setUser(null);
    setWishlistIds([]);
  }, []);

  const isInWishlist = useCallback((productId) => {
    if (!productId) return false;
    const strId = String(productId);
    return wishlistIds.some(id => String(id) === strId);
  }, [wishlistIds]);

  const toggleWishlist = useCallback(async (productId) => {
    if (!user) {
      return { requiresAuth: true };
    }
    const strId = String(productId);
    const currentlyIn = wishlistIds.some(id => String(id) === strId);

    // Optimistic UI update
    setWishlistIds(prev =>
      currentlyIn ? prev.filter(id => String(id) !== strId) : [...prev, productId]
    );

    try {
      if (currentlyIn) {
        await wishlistApi.remove(productId);
      } else {
        await wishlistApi.add(productId);
      }
      return { requiresAuth: false, wishlisted: !currentlyIn };
    } catch (err) {
      // Revert optimistic update on failure
      setWishlistIds(prev =>
        currentlyIn ? [...prev, productId] : prev.filter(id => String(id) !== strId)
      );
      throw err;
    }
  }, [user, wishlistIds]);

  const triggerRequireLogin = useCallback((notice = '', action = null) => {
    setAuthNotice(notice);
    setPendingAction(action);
    setRequireLoginTrigger(Date.now());
  }, []);

  const clearAuthNotice = useCallback(() => {
    setAuthNotice('');
    setPendingAction(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        setError,
        setUser,
        wishlistIds,
        isInWishlist,
        toggleWishlist,
        authNotice,
        setAuthNotice,
        pendingAction,
        setPendingAction,
        triggerRequireLogin,
        clearAuthNotice,
        requireLoginTrigger,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
