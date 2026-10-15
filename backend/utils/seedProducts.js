/**
 * Optional helper: seed the sample catalog for the Products page.
 * Run with: `node utils/seedProducts.js`
 * (make sure your MongoDB server / MONGO_URI is reachable first).
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/product.model");

const sampleProducts = [
  {
    name: "Noise Cancelling Headphones",
    description: "Wireless over-ear headphones with active noise cancellation.",
    price: 4999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    stock: 25,
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with blue switches.",
    price: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600",
    stock: 10,
  },
  {
    name: "Running Shoes",
    description: "Lightweight breathable running shoes for daily training.",
    price: 1899,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    stock: 40,
  },
  {
    name: "Atomic Habits",
    description: "A guide to building good habits and breaking bad ones.",
    price: 399,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
    stock: 100,
  },
  {
    name: "Table Lamp",
    description: "Minimalist wooden table lamp with warm white light.",
    price: 999,
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600",
    stock: 0,
  },
    {
      name: "Studio Wireless Earbuds",
      description: "Compact wireless earbuds with clear sound and a pocket-sized charging case.",
      price: 2499,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800",
      stock: 32,
    },
    {
      name: "Instant Camera",
      description: "A playful instant camera for keeping your favorite moments in print.",
      price: 6499,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
      stock: 14,
    },
    {
      name: "Everyday Canvas Tote",
      description: "A roomy cotton canvas carryall with sturdy handles for everyday errands.",
      price: 899,
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800",
      stock: 45,
    },
    {
      name: "Classic Leather Sneakers",
      description: "Clean low-top sneakers with a cushioned footbed and versatile profile.",
      price: 3299,
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
      stock: 21,
    },
    {
      name: "Sculpted Ceramic Vase",
      description: "A hand-finished ceramic vase that brings a considered accent to any shelf.",
      price: 1299,
      category: "Home",
      image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800",
      stock: 18,
    },
    {
      name: "Linen Cushion Cover",
      description: "Soft, breathable linen cushion cover in a versatile natural tone.",
      price: 699,
      category: "Home",
      image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800",
      stock: 36,
    },
    {
      name: "Pour-over Coffee Set",
      description: "A ceramic dripper and server set for an unhurried cup of coffee.",
      price: 1899,
      category: "Home",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
      stock: 12,
    },
    {
      name: "The Creative Act",
      description: "Rick Rubin's thoughtful reflections on creativity and the artistic process.",
      price: 599,
      category: "Books",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
      stock: 27,
    },
    {
      name: "A Field Guide to Calm",
      description: "A beautifully illustrated guide to slowing down and noticing more.",
      price: 449,
      category: "Books",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800",
      stock: 19,
    },
    {
      name: "Stainless Steel Bottle",
      description: "Double-wall insulated bottle that keeps drinks cold through long days.",
      price: 1199,
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
      stock: 40,
    },
    {
      name: "Woven Lounge Throw",
      description: "A lightweight textured throw for a little extra comfort at home.",
      price: 2199,
      category: "Home",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
      stock: 9,
    },
    {
      name: "Portable Bluetooth Speaker",
      description: "A compact speaker with rich sound, simple controls and all-day battery.",
      price: 3799,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
      stock: 16,
    },
    {
      name: "Polarized Everyday Sunglasses",
      description: "Lightweight polarized lenses in a timeless frame for bright days out.",
      price: 1599,
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
      stock: 24,
    },
    {
      name: "Softcover Sketchbook",
      description: "A lay-flat sketchbook with heavyweight pages ready for ideas and ink.",
      price: 349,
      category: "Books",
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800",
      stock: 55,
    },
    {
      name: "Arc Floor Light",
      description: "A slim reading light with an adjustable head and warm ambient glow.",
      price: 4299,
      category: "Home",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
      stock: 7,
    },
    {
      name: "Wireless Desk Charger",
      description: "A tidy wireless charging stand for your bedside table or work desk.",
      price: 1799,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800",
      stock: 28,
    },
];

async function seed() {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/shopkart";
  await mongoose.connect(mongoUri);
  console.log("✅ Connected. Seeding products...");

  await Product.bulkWrite(
    sampleProducts.map((product) => ({
      updateOne: {
        filter: { name: product.name },
        update: { $set: product },
        upsert: true,
      },
    }))
  );

  console.log(`Seeded ${sampleProducts.length} products (existing inventory was preserved).`);
  await mongoose.disconnect();
  process.exit(0);
}

module.exports = sampleProducts;

if (require.main === module) {
  seed().catch((err) => {
    console.error("Seed error:", err.message);
    process.exit(1);
  });
}
