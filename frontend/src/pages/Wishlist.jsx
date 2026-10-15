import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../services/api";
import Navbar from "../components/Navbar";
import WishlistCard from "../components/WishlistCard";

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      setProducts(res.data.wishlist || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const loadWishlist = async () => {
      try {
        const res = await getWishlist();
        if (active) setProducts(res.data.wishlist || []);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadWishlist();
    return () => {
      active = false;
    };
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    fetchWishlist();
  };

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
    setProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  return (
    <div className="min-h-screen bg-[#f7f8f4]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#648064]">KEPT CLOSE</p>
        <h1 className="mb-1 text-3xl text-[#202720] sm:text-4xl">Your Wishlist</h1>
        {!loading && !error && (
          <p className="mb-6 text-sm text-[#69736a]">
            {products.length} product{products.length === 1 ? "" : "s"} in your wishlist
          </p>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-20" role="status">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d8e2d2] border-t-[#326246]" aria-hidden="true" />
            <p className="text-sm text-[#69736a]">Loading your wishlist...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="text-center">
              <p className="font-medium text-[#303a31]">Something went wrong.</p>
              <p className="mt-1 text-sm text-[#69736a]">
                We couldn't load your wishlist.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-sm bg-[#255a40] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4933]"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <span className="text-4xl text-[#a34d43]">♡</span>
            <p className="font-medium text-[#303a31]">
              Your wishlist is empty
            </p>
            <p className="max-w-xs text-sm text-[#69736a]">
              Add products you love to your wishlist and find them here later.
            </p>
            <Link
              to="/products"
              className="mt-2 rounded-sm bg-[#255a40] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4933]"
            >
              Browse Products
            </Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {products.map((product) => (
              <WishlistCard
                key={product._id}
                product={product}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
