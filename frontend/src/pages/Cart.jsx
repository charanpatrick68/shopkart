import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const Cart = () => {
  const { cartItems, loading, error, refreshCart, updateQuantity, removeFromCart, subtotal } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f7f8f4]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#648064]">MY CART</p>
        <div className="mb-8 flex items-end justify-between border-b border-[#e2e7de] pb-5">
          <h1 className="text-3xl text-[#202720] sm:text-4xl">My Cart</h1>
          <span className="text-sm text-[#707970]">{totalItems} item{totalItems === 1 ? "" : "s"}</span>
        </div>

        {loading && (
          <div className="py-16 text-center text-sm text-[#69736a]">Loading your cart...</div>
        )}

        {!loading && error && (
          <div className="py-16 text-center">
            <p className="text-sm text-[#9b5146]">Unable to load your cart.</p>
            <button
              type="button"
              onClick={() => refreshCart()}
              className="mt-4 rounded-sm bg-[#255a40] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4933]"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && cartItems.length === 0 && (
          <div className="py-16 text-center sm:py-24">
            <p className="text-2xl text-[#303a31]">Your cart is empty 🛒</p>
            <p className="mt-3 text-sm text-[#707970]">Looks like you haven't added anything yet.</p>
            <Link to="/products" className="mt-6 inline-flex rounded-sm bg-[#255a40] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4933]">Browse Products</Link>
          </div>
        )}

        {!loading && !error && cartItems.length > 0 && (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="divide-y divide-[#e2e7de] border-y border-[#e2e7de]">
              {cartItems.map((item) => (
                <article key={item._id} className="grid grid-cols-[90px_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[110px_minmax(0,1fr)_auto] sm:gap-6">
                  <Link to={`/products/${item._id}`} className="aspect-square overflow-hidden rounded-sm bg-[#eef1e9]">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </Link>

                  <div className="flex min-w-0 flex-col justify-center">
                    <Link to={`/products/${item._id}`} className="text-base font-semibold text-[#202720] hover:text-[#326246]">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-[#586258]">{formatPrice(item.price)}</p>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex items-center rounded-sm border border-[#dce2d8] bg-white">
                        <button
                          type="button"
                          onClick={() => item.quantity > 1 && updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="h-9 w-9 text-lg font-semibold text-[#465148] disabled:cursor-not-allowed disabled:text-[#b0b7ae]"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          −
                        </button>
                        <span className="min-w-[40px] text-center text-sm font-semibold text-[#202720]">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => item.quantity < item.stock && updateQuantity(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="h-9 w-9 text-lg font-semibold text-[#465148] disabled:cursor-not-allowed disabled:text-[#b0b7ae]"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item._id)}
                        className="text-xs font-semibold text-[#8b5148] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="col-start-2 text-sm font-bold text-[#303a31] sm:col-start-auto sm:self-center">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </article>
              ))}
            </div>

            <aside className="h-fit border-t border-[#dce2d8] pt-5 lg:sticky lg:top-28">
              <h2 className="text-xl text-[#202720]">Order Summary</h2>
              <div className="mt-5 space-y-4 text-sm text-[#465148]">
                <div className="flex items-center justify-between">
                  <span>Items:</span>
                  <span className="font-semibold text-[#202720]">{totalItems}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#e2e7de] pt-4">
                  <span>Subtotal:</span>
                  <span className="font-bold text-[#202720]">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-6 block w-full rounded-sm bg-[#255a40] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#1d4933]"
              >
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
