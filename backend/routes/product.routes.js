const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
} = require("../controllers/product.controller");

// Open for this lab — admin auth is introduced later
router.post("/", createProduct);

// Supports ?search=&category=&sort=
router.get("/", getAllProducts);

router.get("/:id", getSingleProduct);

module.exports = router;
