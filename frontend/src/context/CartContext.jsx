import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  addToCart as addToCartApi,
  getCart,
  updateCartQuantity as updateCartQuantityApi,
  removeFromCart as removeFromCartApi,
} from "../services/api";

const CartContext = createContext(null);

export const CART_EVENT = "shopkart:cart-change";

const normalizeCartItems = (entries = []) =>
  (entries || [])
    .filter((entry) => entry && entry.product)
    .map((entry) => ({
      _id: entry.product._id,
      name: entry.product.name,
      price: Number(entry.product.price || 0),
      image: entry.product.image,
      stock: Number(entry.product.stock || 0),
      category: entry.product.category,
      description: entry.product.description,
      quantity: Number(entry.quantity || 1),
    }));

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshCart = useCallback(async (options = {}) => {
    const { silent = false } = options;

    if (!silent) {
      setLoading(true);
    }

    setError("");

    try {
      const response = await getCart();
      setCartItems(normalizeCartItems(response.data.cart || []));
      return response.data.cart || [];
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        setCartItems([]);
        return [];
      }

      setCartItems([]);
      setError("Unable to load your cart.");
      return [];
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    refreshCart({ silent: true });
  }, [refreshCart]);

  const addToCart = useCallback(
    async (productId) => {
      setError("");
      try {
        const response = await addToCartApi(productId);
        await refreshCart({ silent: true });
        window.dispatchEvent(new Event(CART_EVENT));
        return response;
      } catch (err) {
        setError("Unable to add this product to your cart.");
        throw err;
      }
    },
    [refreshCart]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      setError("");
      try {
        const response = await updateCartQuantityApi(productId, quantity);
        await refreshCart({ silent: true });
        window.dispatchEvent(new Event(CART_EVENT));
        return response;
      } catch (err) {
        setError("Unable to update the cart item quantity.");
        throw err;
      }
    },
    [refreshCart]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      setError("");
      try {
        const response = await removeFromCartApi(productId);
        await refreshCart({ silent: true });
        window.dispatchEvent(new Event(CART_EVENT));
        return response;
      } catch (err) {
        setError("Unable to remove this product from your cart.");
        throw err;
      }
    },
    [refreshCart]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  const value = {
    cartItems,
    cartCount,
    subtotal,
    loading,
    error,
    refreshCart,
    addToCart,
    updateQuantity,
    removeFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};
