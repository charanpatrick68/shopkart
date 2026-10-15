import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutCustomer, getWishlist, WISHLIST_CHANGE_EVENT } from "../services/api";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [wishlistCount, setWishlistCount] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await getWishlist();
        setWishlistCount(res.data.count ?? 0);
      } catch {
        setWishlistCount(null);
      }
    };

    fetchCount();
    window.addEventListener(WISHLIST_CHANGE_EVENT, fetchCount);

    return () => {
      window.removeEventListener(WISHLIST_CHANGE_EVENT, fetchCount);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutCustomer();
    } catch (err) {
      console.error("Logout error:", err.message);
    } finally {
      navigate("/login");
    }
  };

  return (
    <>
      <div className="bg-[#e7f2c9] px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-[#31553b] sm:text-xs">
        Good things, gathered for everyday living
      </div>
      <nav className="sticky top-0 z-20 border-b border-[#e8ebe5] bg-white/95 px-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-3">
          <Link to="/home" className="flex shrink-0 items-center gap-2.5" aria-label="ShopKart home">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#dff06a] text-sm font-bold text-[#263b26]">S</span>
            <span className="text-[19px] font-bold tracking-tight text-[#202720]">shopkart</span>
          </Link>
          <div className="flex items-center gap-3 text-xs font-semibold text-[#465148] sm:gap-7 sm:text-sm">
            <Link to="/home" className="hidden transition hover:text-[#276346] min-[360px]:inline">Home</Link>
            <Link to="/products" className="transition hover:text-[#276346]">Shop</Link>
            <Link to="/wishlist" className="hidden transition hover:text-[#276346] min-[360px]:inline">
              Wishlist{wishlistCount !== null && wishlistCount > 0 ? ` (${wishlistCount})` : ""}
            </Link>
            <Link to="/cart" className="transition hover:text-[#276346]">Cart ({cartCount})</Link>
            <Link to="/orders" className="hidden transition hover:text-[#276346] min-[360px]:inline">My Orders</Link>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#dce2d8] text-sm font-semibold text-[#465148] transition hover:border-[#276346] hover:text-[#276346] sm:h-auto sm:w-auto sm:px-4 sm:py-2 sm:text-sm"
          >
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden" aria-hidden="true">↗</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
