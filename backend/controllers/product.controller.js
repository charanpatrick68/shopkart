const mongoose = require("mongoose");
const Product = require("../models/product.model");

// ─────────────────────────────────────────────────────────────────────────────
// POST /products
// ─────────────────────────────────────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    // 1. Required field check
    if (!name || !description || !price || !category || !image || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, description, price, category, image, stock",
      });
    }

    // 2. Price validation
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a number greater than 0",
      });
    }

    // 3. Stock validation
    if (typeof stock !== "number" || stock < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a number and cannot be negative",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    // Mongoose schema validation errors also land here → 400
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }

    console.error("Create product error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /products
// Supports: ?search=keyboard  ?category=Electronics  ?sort=price_asc|price_desc
// ─────────────────────────────────────────────────────────────────────────────
const getAllProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    // Build query dynamically instead of separate endpoints per filter
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" }; // case-insensitive
    }

    if (category && category !== "All") {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    let productsQuery = Product.find(query);

    // Bonus — sorting
    if (sort === "price_asc") {
      productsQuery = productsQuery.sort({ price: 1 });
    } else if (sort === "price_desc") {
      productsQuery = productsQuery.sort({ price: -1 });
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }

    const products = await productsQuery.select(
      "name price category image stock description createdAt"
    );

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /products/:id
// ─────────────────────────────────────────────────────────────────────────────
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate ObjectId shape before hitting the DB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    // 2. Not found
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get single product error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
};
