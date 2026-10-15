const crypto = require("crypto");
const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const razorpay = require("../config/razorpay");

const getFallbackShippingAddress = () => ({
  fullName: "Customer",
  phone: "0000000000",
  addressLine1: "Not provided",
  city: "Not provided",
  state: "Not provided",
  pincode: "000000",
});

const normalizeShippingAddress = (shippingAddress) => {
  const fallback = getFallbackShippingAddress();
  const input = shippingAddress && typeof shippingAddress === "object" ? shippingAddress : {};

  return {
    fullName: (input.fullName || fallback.fullName).trim() || fallback.fullName,
    phone: (input.phone || fallback.phone).toString().trim() || fallback.phone,
    addressLine1: (input.addressLine1 || fallback.addressLine1).trim() || fallback.addressLine1,
    city: (input.city || fallback.city).trim() || fallback.city,
    state: (input.state || fallback.state).trim() || fallback.state,
    pincode: (input.pincode || fallback.pincode).toString().trim() || fallback.pincode,
  };
};

const getCartItemsForOrder = async (customer) => {
  const productIds = customer.cart
    .map((item) => {
      const productRef = item?.product;
      if (!productRef) return null;
      return productRef._id ? productRef._id : productRef;
    })
    .filter(Boolean);

  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const validatedItems = [];

  for (const cartItem of customer.cart) {
    const productRef = cartItem?.product;
    const productId = productRef?._id ? productRef._id.toString() : productRef?.toString();
    const product = productMap.get(productId);

    if (!product) {
      throw new Error("One or more products are no longer available.");
    }

    if (product.stock < cartItem.quantity) {
      throw new Error(`Insufficient stock for ${product.name}.`);
    }

    validatedItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: cartItem.quantity,
      image: product.image,
    });
  }

  return validatedItems;
};

const createPaymentOrder = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in again." });
    }

    const customer = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price stock image",
    });

    if (!customer) {
      return res.status(401).json({ success: false, message: "Unauthorized. Customer not found." });
    }

    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty." });
    }

    const shippingAddress = normalizeShippingAddress(req.body?.shippingAddress);

    const items = await getCartItemsForOrder(customer);
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: customer._id,
      items,
      shippingAddress,
      totalAmount,
      paymentStatus: "PENDING",
      status: "PENDING_PAYMENT",
    });

    if (!razorpay) {
      return res.status(400).json({
        success: false,
        message: "Razorpay is not configured. Add valid RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET values in backend/.env.",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: order._id.toString(),
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(200).json({
      success: true,
      shopKartOrderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    const razorpayError =
      error?.response?.data?.error ||
      error?.response?.body?.error ||
      error?.error ||
      {};
    const errorMessage =
      razorpayError.description ||
      razorpayError.message ||
      error?.response?.data?.message ||
      error?.message ||
      "Unable to create your order.";

    console.error("Create payment order error:", JSON.stringify({
      message: errorMessage,
      details: error?.response?.data || error,
    }, null, 2));

    if (
      errorMessage.includes("Insufficient stock") ||
      errorMessage.includes("no longer available") ||
      errorMessage.includes("Invalid API key") ||
      errorMessage.includes("Key is required") ||
      errorMessage.includes("not configured") ||
      errorMessage.includes("Razorpay")
    ) {
      return res.status(400).json({ success: false, message: errorMessage });
    }

    return res.status(500).json({ success: false, message: errorMessage });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!shopKartOrderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment details are incomplete." });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in again." });
    }

    const order = await Order.findById(shopKartOrderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You are not allowed to access this order." });
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ success: false, message: "Invalid payment order reference." });
    }

    const body = `${order.razorpayOrderId}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = "FAILED";
      order.status = "PENDING_PAYMENT";
      await order.save();
      return res.status(400).json({ success: false, message: "Invalid payment signature." });
    }

    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    const customer = await Customer.findById(req.user._id);
    if (customer) {
      customer.cart = [];
      await customer.save();
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Verify payment error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to verify payment." });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get orders error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to load your orders." });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You are not allowed to access this order." });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Get order by id error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to load order details." });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getOrders,
  getOrderById,
  getFallbackShippingAddress,
  normalizeShippingAddress,
  getCartItemsForOrder,
};
