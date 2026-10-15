import { useState } from "react";
import { Link } from "react-router-dom";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const WishlistCard = ({ product, onRemove }) => {
  const { _id, name, price, category, image, stock } = product;
  const outOfStock = stock <= 0;

  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");

  const handleRemove = async () => {
    if (removing) return;
    setRemoving(true);
    setError("");
    try {
      await onRemove(_id);
    } catch {
      setError("Unable to remove product. Please try again.");
      setRemoving(false);
    }
    // on success the parent removes this card from the list, so no need
    // to reset `removing` — the component unmounts.
  };

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-md border border-[#e7ebe3] bg-white transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(31,48,34,0.08)]">
      <div className="aspect-square w-full overflow-hidden bg-[#eef1e9]">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://placehold.co/400x400?text=No+Image";
          }}
        />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#71806f]">{category}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.9rem] text-[17px] leading-snug text-[#202720]">
          {name}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-[#202720]">
            {formatPrice(price)}
          </span>
          <span className="text-[10px] font-medium text-[#818a80] sm:text-xs">
            {outOfStock ? "Out of stock" : `${stock} units left`}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Link
            to={`/products/${_id}`}
            className="w-full rounded-sm bg-[#255a40] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#1d4933]"
          >
            View Details
          </Link>

          <button
            type="button"
            onClick={handleRemove}
            disabled={removing}
            className="w-full rounded-sm border border-[#efd6d1] py-2.5 text-center text-sm font-semibold text-[#9b5146] transition hover:bg-[#fff8f6] disabled:opacity-60"
          >
            {removing ? "Removing..." : "Remove ♥"}
          </button>

          {error && <p role="alert" className="text-center text-xs text-[#9b5146]">{error}</p>}
        </div>
      </div>
    </article>
  );
};

export default WishlistCard;
