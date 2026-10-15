import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { CART_EVENT, useCart } from "../context/CartContext";
import { createPaymentOrder, verifyPayment } from "../services/api";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, refreshCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cartItems]
  );

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      setPaymentError("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    setPaymentError("");

    try {
      const response = await createPaymentOrder({
        shippingAddress: {
          fullName: "Customer",
          phone: "0000000000",
          addressLine1: "Not provided",
          city: "Not provided",
          state: "Not provided",
          pincode: "000000",
        },
      });

      const { data } = response;
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Razorpay checkout could not be loaded.");
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "ShopKart",
        description: "ShopKart Order",
        order_id: data.razorpayOrderId,
        handler: async (razorpayResponse) => {
          try {
            await verifyPayment({
              shopKartOrderId: data.shopKartOrderId,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            });

            await refreshCart({ silent: true });
            window.dispatchEvent(new Event(CART_EVENT));
            navigate(`/order-success/${data.shopKartOrderId}`);
          } catch (verifyError) {
            const message = verifyError?.response?.data?.message || "Payment verification failed.";
            setPaymentError(message);
          }
        },
        theme: {
          color: "#255a40",
        },
        modal: {
          ondismiss: () => {
            setPaymentError("Payment was cancelled. Your cart remains unchanged.");
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", (failureResponse) => {
        console.error("Razorpay payment failed:", failureResponse.error);
        setPaymentError("Payment failed. Please try again.");
      });
      razorpayInstance.open();
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Unable to place your order.";
      setPaymentError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f8f4]">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <p className="text-2xl font-semibold text-[#202720]">Your cart is empty.</p>
          <p className="mt-3 text-sm text-[#69736a]">Add something before completing checkout.</p>
          <Link to="/products" className="mt-6 inline-flex rounded-sm bg-[#255a40] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1d4933]">
            Browse Products
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8f4]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#648064]">CHECKOUT</p>
        <h1 className="text-3xl text-[#202720] sm:text-4xl">Review your order</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="rounded-md border border-[#e7ebe3] bg-white p-5 sm:p-7">
            <div className="rounded-sm border border-dashed border-[#dfe6d8] bg-[#f9faf6] p-4 text-sm text-[#465148]">
              Shipping details are not required for this demo checkout. The Razorpay test payment will open once you place the order.
            </div>

            {paymentError && <p className="mt-5 rounded-sm border border-[#efd6d1] bg-[#fff8f6] px-3 py-2 text-sm text-[#9b5146]">{paymentError}</p>}

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handlePlaceOrder}
              className="mt-6 w-full rounded-sm bg-[#255a40] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4933] disabled:cursor-not-allowed disabled:bg-[#b7beb6]"
            >
              {isSubmitting ? "Processing..." : "Pay with Razorpay"}
            </button>
          </div>

          <aside className="h-fit rounded-md border border-[#e7ebe3] bg-white p-5">
            <h2 className="text-xl text-[#202720]">Order Summary</h2>
            <div className="mt-5 space-y-3 text-sm text-[#465148]">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-start justify-between gap-3">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold text-[#202720]">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-[#e2e7de] pt-4">
              <div className="flex items-center justify-between text-sm text-[#465148]">
                <span>Items</span>
                <span className="font-semibold text-[#202720]">{totalItems}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-base font-bold text-[#202720]">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
