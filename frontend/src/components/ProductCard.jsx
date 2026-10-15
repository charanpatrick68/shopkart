import { useState } from "react";
import { Link } from "react-router-dom";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const ProductCard = ({
  product,
  isWishlisted = false,
  onToggleWishlist,
  onAddToCart,
  inCart = false,
}) => {
  const { _id, name, price, category, image, stock } = product;
  const outOfStock = stock <= 0;

  const [saving, setSaving] = useState(false);
  const [wishlistError, setWishlistError] = useState("");
  const [cartSaving, setCartSaving] = useState(false);
  const [cartError, setCartError] = useState("");

  const handleWishlistClick = async () => {
    if (saving || !onToggleWishlist) return;

    setSaving(true);
    setWishlistError("");
    try {
      await onToggleWishlist(_id, isWishlisted);
    } catch {
      setWishlistError("Unable to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCartClick = async () => {
    if (cartSaving || !onAddToCart || outOfStock) return;

    setCartSaving(true);
    setCartError("");
    try {
      await onAddToCart(_id);
    } catch {
      setCartError("Unable to add product to cart.");
    } finally {
      setCartSaving(false);
    }
  };

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-md border border-[#e7ebe3] bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#cad8bf] hover:shadow-[0_12px_28px_rgba(31,48,34,0.08)]">
      <Link to={`/products/${_id}`} className="flex flex-1 flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#326246]">
        <div className="relative aspect-square w-full overflow-hidden bg-[#f0f2ec]">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src ="https://placehold.co/400x400?text=No+Image";
            }}
          />
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${outOfStock ? "bg-white/90 text-[#9b5146]" : "bg-white/90 text-[#476746]"}`}>
            {outOfStock ? "Sold out" : "In stock"}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#71806f]">{category}</p>
          <h3 className="mt-1 line-clamp-2 min-h-[2.9rem] text-[17px] leading-snug text-[#202720]">
            {name}
          </h3>

          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-lg font-bold tracking-tight text-[#202720]">
              {formatPrice(price)}
            </span>
            <span className="text-[10px] font-medium text-[#818a80] sm:text-xs">
              {outOfStock ? "Out of stock" : `${stock} units left`}
            </span>
          </div>
        </div>
      </Link>

      <div className="space-y-2 px-4 pb-4 sm:px-5 sm:pb-5">
        {onAddToCart && (
          <button
            type="button"
            onClick={handleCartClick}
            disabled={cartSaving || outOfStock}
            className="w-full rounded-sm bg-[#255a40] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4933] disabled:cursor-not-allowed disabled:bg-[#b7beb6]"
          >
            {cartSaving ? "Adding..." : inCart ? "Add Another" : "Add to Cart"}
          </button>
        )}

        {onToggleWishlist && (
          <button
            type="button"
            onClick={handleWishlistClick}
            disabled={saving}
            className={`w-full rounded-sm border py-2.5 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60 ${
              isWishlisted
                ? "border-[#dce7d4] bg-[#f4f8ef] text-[#326246] hover:bg-[#ebf3e3]"
                : "border-[#dce2d8] text-[#465148] hover:border-[#9cb895] hover:text-[#326246]"
            }`}
          >
            {saving
              ? "Saving..."
              : isWishlisted
              ? "♥ Added to Wishlist"
              : "♡ Add to Wishlist"}
          </button>
        )}

        {wishlistError && <p role="alert" className="text-center text-xs text-[#9b5146]">{wishlistError}</p>}
        {cartError && <p role="alert" className="text-center text-xs text-[#9b5146]">{cartError}</p>}
      </div>
    </article>
  );
};

export default ProductCard;
