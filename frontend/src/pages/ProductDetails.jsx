import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getProductById,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistSaving, setWishlistSaving] = useState(false);
  const [wishlistError, setWishlistError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [cartSaving, setCartSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getProductById(id);
        setProduct(res.data.product);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Product not found.");
        } else {
          setError("Something went wrong while loading this product.");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlistStatus = async () => {
      try {
        const res = await getWishlist();
        const saved = (res.data.wishlist || []).some((p) => p._id === id);
        setIsWishlisted(saved);
      } catch {
        // Ignore unauthenticated wishlist requests.
      }
    };

    fetchProduct();
    fetchWishlistStatus();
  }, [id]);

  const handleWishlistClick = async () => {
    if (wishlistSaving) return;
    setWishlistSaving(true);
    setWishlistError("");
    try {
      if (isWishlisted) {
        await removeFromWishlist(id);
        setIsWishlisted(false);
      } else {
        await addToWishlist(id);
        setIsWishlisted(true);
      }
    } catch {
      setWishlistError("Unable to save product. Please try again.");
    } finally {
      setWishlistSaving(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0 || cartSaving) return;

    setCartSaving(true);
    setCartMessage("");
    try {
      await addToCart(product._id);
      setCartMessage("Added to your cart.");
    } catch {
      setCartMessage("Unable to add product to cart.");
    } finally {
      setCartSaving(false);
    }
  };

  const isAlreadyInCart = product ? cartItems.some((item) => item._id === product._id) : false;

  return (
    <div className="min-h-screen bg-[#f7f8f4]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          to="/products"
          className="mb-6 inline-block text-sm font-semibold text-[#326246] hover:underline"
        >
          ← Continue shopping
        </Link>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-gray-500">Loading product...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && product && (
          <div className="grid grid-cols-1 overflow-hidden rounded-md border border-[#e7ebe3] bg-white md:grid-cols-2">
            <div className="aspect-square bg-[#eef1e9]">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://placehold.co/600x600?text=No+Image";
                }}
              />
            </div>

            <div className="flex flex-col p-6 sm:p-10">
              <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#648064]">
                {product.category}
              </span>
              <h1 className="mb-3 text-3xl leading-tight text-[#202720] sm:text-4xl">
                {product.name}
              </h1>
              <p className="mb-6 text-sm leading-relaxed text-[#69736a]">
                {product.description}
              </p>

              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold tracking-tight text-[#202720]">
                    {formatPrice(product.price)}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      product.stock > 0 ? "text-[#326246]" : "text-[#9b5146]"
                    }`}
                  >
                    {product.stock > 0 ? "Ready to ship" : "Currently unavailable"}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    disabled={product.stock <= 0 || cartSaving}
                    onClick={handleAddToCart}
                    className="rounded-sm bg-[#255a40] py-3 text-sm font-semibold text-white transition hover:bg-[#1d4933] disabled:cursor-not-allowed disabled:bg-[#b7beb6]"
                  >
                    {cartSaving ? "Adding..." : isAlreadyInCart ? "Add Another" : "Add to Cart"}
                  </button>

                  <button
                    type="button"
                    onClick={handleWishlistClick}
                    disabled={wishlistSaving}
                    className={`rounded-sm border py-3 text-sm font-semibold transition ${
                      isWishlisted
                        ? "border-[#efd6d1] bg-[#fff8f6] text-[#9b5146] hover:bg-[#fff0eb]"
                        : "border-[#dce2d8] text-[#465148] hover:bg-[#f7f8f4]"
                    } disabled:opacity-60`}
                  >
                    {wishlistSaving
                      ? "⏳ Saving..."
                      : isWishlisted
                      ? "♥ Added to Wishlist"
                      : "♡ Add to Wishlist"}
                  </button>
                </div>
                {cartMessage && <p className="text-center text-xs font-medium text-[#326246]">{cartMessage}</p>}
                {wishlistError && (
                  <p className="text-center text-xs text-red-600">
                    {wishlistError}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetails;
