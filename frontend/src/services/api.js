import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
export const WISHLIST_CHANGE_EVENT = "shopkart:wishlist-change";
export const CART_EVENT = "shopkart:cart-change";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerCustomer = (data) => api.post("/customers/register", data);
export const loginCustomer = (data) => api.post("/customers/login", data);
export const getCurrentCustomer = () => api.get("/customers/me");
export const logoutCustomer = () => api.post("/customers/logout");

export const getProducts = (params) => api.get("/products", { params });
export const getProductById = (id) => api.get(`/products/${id}`);

export const getWishlist = () => api.get("/wishlist");
export const addToWishlist = async (productId) => {
  const response = await api.post(`/wishlist/${productId}`);
  window.dispatchEvent(new Event(WISHLIST_CHANGE_EVENT));
  return response;
};
export const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`);
  window.dispatchEvent(new Event(WISHLIST_CHANGE_EVENT));
  return response;
};

export const getCart = () => api.get("/cart");
export const addToCart = async (productId) => {
  const response = await api.post(`/cart/${productId}`);
  window.dispatchEvent(new Event(CART_EVENT));
  return response;
};
export const updateCartQuantity = async (productId, quantity) => {
  const response = await api.patch(`/cart/${productId}`, { quantity });
  window.dispatchEvent(new Event(CART_EVENT));
  return response;
};
export const removeFromCart = async (productId) => {
  const response = await api.delete(`/cart/${productId}`);
  window.dispatchEvent(new Event(CART_EVENT));
  return response;
};

export const createPaymentOrder = (payload = {}) => api.post("/orders/create-payment-order", payload);
export const verifyPayment = (payload) => api.post("/orders/verify-payment", payload);
export const getOrders = () => api.get("/orders");
export const getOrderById = (id) => api.get(`/orders/${id}`);

export default api;
