import { useEffect, useState } from "react";
import {
  getProducts,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/api";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { cartItems, addToCart } = useCart();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sort, setSort] = useState("newest");
  const [wishlistIds, setWishlistIds] = useState(new Set());

  useEffect(() => {
    const fetchWishlistIds = async () => {
      try {
        const res = await getWishlist();
        setWishlistIds(new Set((res.data.wishlist || []).map((p) => p._id)));
      } catch {
        // Ignore wishlist errors for unauthenticated users.
      }
    };

    fetchWishlistIds();
  }, []);

  const handleToggleWishlist = async (productId, currentlyWishlisted) => {
    if (currentlyWishlisted) {
      await removeFromWishlist(productId);
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    } else {
      await addToWishlist(productId);
      setWishlistIds((prev) => new Set(prev).add(productId));
    }
  };

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {};
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (category && category !== "All Categories") params.category = category;
        if (sort !== "newest") params.sort = sort;

        const res = await getProducts(params);
        setProducts(res.data.products || []);
      } catch {
        setError("Something went wrong while loading products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch, category, sort]);

  return (
    <div className="min-h-screen bg-[#f7f8f4]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-7 flex flex-col justify-between gap-3 border-b border-[#e2e7de] pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#648064]">THE SHOPKART COLLECTION</p>
            <h1 className="text-3xl leading-tight text-[#202720] sm:text-4xl">Good finds, all in one place.</h1>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#69736a]">Useful things, lovely details, and a few little treats for your everyday.</p>
        </div>

        <SearchBar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
        />

        <div className="mt-8">
          {!loading && !error && (
            <div className="mb-4 flex items-center justify-between text-xs text-[#707970]">
              <p><span className="font-bold text-[#303a31]">{products.length}</span> {products.length === 1 ? "item" : "items"}</p>
              {category !== "All Categories" && <button onClick={() => setCategory("All Categories")} className="font-semibold text-[#326246] hover:underline">Clear category</button>}
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d8e2d2] border-t-[#326246]" aria-label="Loading products" />
            </div>
          )}

          {!loading && error && (
            <div className="py-20 text-center">
              <p className="text-sm text-[#9b5146]">{error}</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="py-20 text-center">
              <h2 className="text-2xl text-[#303a31]">Nothing on this shelf yet.</h2>
              <p className="mt-2 text-sm text-[#707970]">Try a different search or browse all categories.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isWishlisted={wishlistIds.has(product._id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={addToCart}
                  inCart={cartItems.some((item) => item._id === product._id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Products;
