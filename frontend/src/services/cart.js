const CART_STORAGE_KEY = "shopkart-cart";
export const CART_EVENT = "shopkart:cart-change";

export const readCart = () => {
  try {
    const cart = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
};

export const getCartCount = () =>
  readCart().reduce((total, item) => total + item.quantity, 0);

export const addProductToCart = (product) => {
  const items = readCart();
  const existing = items.find((item) => item._id === product._id);
  const stock = Number(product.stock) || 0;

  if (stock <= 0 || (existing && existing.quantity >= stock)) return false;

  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({ ...product, quantity: 1 });
  }

  saveCart(items);
  return true;
};

export const updateCartQuantity = (productId, quantity) => {
  const items = readCart()
    .map((item) =>
      item._id === productId
        ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
        : item
    );
  saveCart(items);
};

export const removeCartItem = (productId) => {
  saveCart(readCart().filter((item) => item._id !== productId));
};