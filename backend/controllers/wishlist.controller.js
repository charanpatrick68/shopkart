const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");

const PRODUCT_FIELDS = "name price category image stock description";

// ─────────────────────────────────────────────────────────────────────────────
// POST /wishlist/:productId   (protected)
// ─────────────────────────────────────────────────────────────────────────────
const addToWishlist = async (req, res) => {
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

    // Atomically prevent duplicate references when requests overlap.
    const result = await Customer.updateOne(
      { _id: req.user._id, wishlist: { $ne: product._id } },
      { $addToSet: { wishlist: product._id } }
    );

    if (result.matchedCount === 0) {
      const customerExists = await Customer.exists({ _id: req.user._id });
      if (!customerExists) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Customer not found.",
        });
      }

      return res.status(409).json({
        success: false,
        message: "Product is already in your wishlist",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist",
    });
  } catch (error) {
    console.error("Add to wishlist error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /wishlist   (protected — always the current user's own wishlist)
// ─────────────────────────────────────────────────────────────────────────────
const getWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: "wishlist",
      select: PRODUCT_FIELDS,
    });
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Customer not found.",
      });
    }

    const products = customer.wishlist.filter(Boolean);

    return res.status(200).json({
      success: true,
      count: products.length,
      wishlist: products,
    });
  } catch (error) {
    console.error("Get wishlist error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /wishlist/:productId   (protected)
// ─────────────────────────────────────────────────────────────────────────────
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const result = await Customer.updateOne(
      { _id: req.user._id, wishlist: productId },
      { $pull: { wishlist: productId } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not in wishlist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /wishlist/:productId/toggle   (protected — bonus)
// ─────────────────────────────────────────────────────────────────────────────
const toggleWishlist = async (req, res) => {
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
    const alreadySaved = customer.wishlist.some(
      (id) => id.toString() === productId
    );

    if (alreadySaved) {
      customer.wishlist = customer.wishlist.filter(
        (id) => id.toString() !== productId
      );
      await customer.save();
      return res.status(200).json({
        success: true,
        wishlisted: false,
        message: "Product removed from wishlist",
      });
    }

    customer.wishlist.push(productId);
    await customer.save();
    return res.status(200).json({
      success: true,
      wishlisted: true,
      message: "Product added to wishlist",
    });
  } catch (error) {
    console.error("Toggle wishlist error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  toggleWishlist,
};
