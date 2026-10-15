import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentCustomer, getProducts } from "../services/api";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [catalogError, setCatalogError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchProfile = async () => {
      try {
        const res = await getCurrentCustomer();
        if (cancelled) return;
        setCustomer(res.data);
      } catch {
        navigate("/login");
        return;
      }

      try {
        const res = await getProducts();
        if (!cancelled) setProducts(res.data.products || []);
      } catch {
        if (!cancelled) setCatalogError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8f4]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d8e2d2] border-t-[#326246]" aria-label="Loading shop" />
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f8f4]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        <section
          className="relative flex min-h-[390px] items-end overflow-hidden rounded-md bg-cover bg-center px-6 py-8 sm:min-h-[470px] sm:px-12 sm:py-12"
          style={{
            backgroundImage: "linear-gradient(90deg, rgba(17, 37, 25, .82) 0%, rgba(17, 37, 25, .48) 52%, rgba(17, 37, 25, .08) 100%), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800')",
          }}
        >
          <div className="relative max-w-xl text-white">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#e2f39b]">A good day to find something lovely</p>
            <h1 className="max-w-lg text-4xl leading-[1.06] sm:text-6xl">The ShopKart edit</h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">A considered mix of everyday essentials and the little things you didn’t know you needed.</p>
            <Link to="/products" className="mt-7 inline-flex items-center gap-8 rounded-sm bg-[#e0f174] px-5 py-3.5 text-sm font-bold text-[#253a28] transition hover:bg-white">
              Shop the collection <span aria-hidden="true">→</span>
            </Link>
          </div>
          <span className="absolute bottom-5 right-6 hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75 sm:block">Objects for everyday living</span>
        </section>

        <section className="pt-11 sm:pt-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#648064]">A few good picks</p>
              <h2 className="text-2xl text-[#202720] sm:text-3xl">Worth a closer look</h2>
            </div>
            <Link to="/products" className="shrink-0 pb-1 text-xs font-bold text-[#326246] hover:underline sm:text-sm">Shop everything →</Link>
          </div>
          {catalogError ? (
            <p className="py-8 text-sm text-[#707970]">Our collection is taking a moment to load.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={addToCart}
                  inCart={cartItems.some((item) => item._id === product._id)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-12 flex flex-col justify-between gap-5 border-y border-[#e2e7de] py-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold text-[#303a31]">Hello, {customer.fullName.split(" ")[0]}.</p>
            <p className="mt-1 text-xs text-[#707970]">Your next favourite might be just around the corner.</p>
          </div>
          <Link to="/wishlist" className="text-sm font-semibold text-[#326246] hover:underline">See your saved items →</Link>
        </section>
      </main>
    </div>
  );
};

export default Home;
