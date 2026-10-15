const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const Product = require("./models/product.model");
const sampleProducts = require("./utils/seedProducts");

const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,               // allow the browser to send/receive cookies
  })
);
app.use(express.json());          // parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(cookieParser());          // parse cookies (needed to read req.cookies.token)

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// Health check — useful to confirm the server is up
app.get("/", (req, res) => {
  res.json({ message: "ShopKart Auth API is running 🛒" });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Database + Server ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const { MongoMemoryServer } = require("mongodb-memory-server");

async function seedProductsIfEmpty() {
  const totalProducts = await Product.countDocuments();

  if (totalProducts === 0) {
    await Product.insertMany(sampleProducts);
    console.log(`🌱 Loaded ${sampleProducts.length} sample products into MongoDB`);
  }
}

async function startDatabaseAndServer() {
  const useInMemoryFallback = process.env.USE_IN_MEMORY === "true";
  let mongoUri = process.env.MONGO_URI;
  let usingInMemoryDatabase = false;

  if (!mongoUri && !useInMemoryFallback) {
    throw new Error("MONGO_URI is missing. Add your MongoDB connection string to backend/.env");
  }

  if (!mongoUri) {
    console.log("⚠️  No MONGO_URI found. Starting in-memory MongoDB...");
    const memoryServer = await MongoMemoryServer.create();
    mongoUri = memoryServer.getUri();
    usingInMemoryDatabase = true;
  }

  try {
    await mongoose.connect(mongoUri);
  } catch (err) {
    const isLocalConnectionIssue =
      err?.message?.includes("ECONNREFUSED") ||
      err?.cause?.code === "ECONNREFUSED" ||
      err?.code === "ECONNREFUSED";

    if (!isLocalConnectionIssue && !useInMemoryFallback) {
      throw err;
    }

    if (!usingInMemoryDatabase) {
      console.log("⚠️  MongoDB connection failed. Starting in-memory MongoDB...");
      const memoryServer = await MongoMemoryServer.create();
      await mongoose.connect(memoryServer.getUri());
      usingInMemoryDatabase = true;
    }
  }

  await seedProductsIfEmpty();

  console.log(`✅  Connected to MongoDB${usingInMemoryDatabase ? " (in-memory fallback)" : ""}`);
  app.listen(PORT, () => {
    console.log(`🚀  ShopKart server running on http://localhost:${PORT}`);
  });
}

startDatabaseAndServer().catch((err) => {
  console.error("❌  MongoDB connection failed:", err.message);
  process.exit(1);
});
