const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");

const CART_PRODUCT_FIELDS = "name price category image stock description";

const formatCartPayload = (customer) => {
  if (!customer || !Array.isArray(customer.cart)) {
    return [];
  }

  return customer.cart
    .filter((entry) => entry && entry.product)
    .map((entry) => ({
      product: entry.product,
      quantity: Number(entry.quantity || 1),
    }));
};

const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Customer not found.",
      });
    }

    const existingItem = customer.cart.find(
      (item) => item && item.product && item.product.toString() === productId
    );

    if (existingItem) {
      const nextQuantity = existingItem.quantity + 1;
      if (nextQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Requested quantity exceeds available stock",
        });
      }

      existingItem.quantity = nextQuantity;
    } else {
      if (product.stock <= 0) {
        return res.status(400).json({
          success: false,
          message: "This product is out of stock",
        });
      }

      customer.cart.push({
        product: product._id,
        quantity: 1,
      });
    }

    await customer.save();

    await customer.populate({
      path: "cart.product",
      select: CART_PRODUCT_FIELDS,
    });

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: formatCartPayload(customer),
    });
  } catch (error) {
    console.error("Add to cart error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: CART_PRODUCT_FIELDS,
    });

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Customer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      cart: formatCartPayload(customer),
    });
  } catch (error) {
    console.error("Get cart error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (typeof quantity !== "number" || !Number.isFinite(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a number greater than or equal to 1",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Customer not found.",
      });
    }

    const existingItem = customer.cart.find(
      (item) => item && item.product && item.product.toString() === productId
    );

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    existingItem.quantity = quantity;
    await customer.save();

    await customer.populate({
      path: "cart.product",
      select: CART_PRODUCT_FIELDS,
    });

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: formatCartPayload(customer),
    });
  } catch (error) {
    console.error("Update cart quantity error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Customer not found.",
      });
    }

    const initialLength = customer.cart.length;
    customer.cart = customer.cart.filter(
      (item) => item && item.product && item.product.toString() !== productId
    );

    if (customer.cart.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    await customer.save();

    await customer.populate({
      path: "cart.product",
      select: CART_PRODUCT_FIELDS,
    });

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: formatCartPayload(customer),
    });
  } catch (error) {
    console.error("Remove from cart error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
};
