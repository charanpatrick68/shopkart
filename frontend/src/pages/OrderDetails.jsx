import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getOrderById } from "../services/api";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);

const formatDate = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchOrder = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getOrderById(id);
        if (active) {
          setOrder(response.data.order);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Unable to load order details.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchOrder();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8f4]">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-12 text-center text-sm text-[#69736a] sm:px-6">Loading order...</main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f8f4]">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
          <p className="text-sm text-[#9b5146]">{error}</p>
          <Link to="/orders" className="mt-6 inline-flex rounded-sm bg-[#255a40] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1d4933]">
            Back to Orders
          </Link>
        </main>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f8f4]">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#648064]">ORDER DETAILS</p>
        <h1 className="text-3xl text-[#202720] sm:text-4xl">Order #{order._id.slice(-6)}</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-md border border-[#e7ebe3] bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-3 border-b border-[#edf0ea] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-[#69736a]">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <span className="inline-flex w-fit rounded-full bg-[#edf6e8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#214d38]">
                {order.status}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {(order.items || []).map((item) => (
                <div key={`${order._id}-${item.product}`} className="flex items-center justify-between gap-4 rounded-sm border border-[#edf0ea] p-3">
                  <div>
                    <p className="font-semibold text-[#202720]">{item.name}</p>
                    <p className="text-sm text-[#69736a]">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-[#202720]">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="h-fit rounded-md border border-[#e7ebe3] bg-white p-5">
            <h2 className="text-xl text-[#202720]">Shipping</h2>
            <div className="mt-4 space-y-1 text-sm text-[#465148]">
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.pincode}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>

            <div className="mt-6 border-t border-[#edf0ea] pt-4">
              <div className="flex items-center justify-between text-sm text-[#465148]">
                <span>Total</span>
                <span className="font-bold text-[#202720]">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-[#465148]">
                <span>Payment</span>
                <span className="font-semibold text-[#202720]">{order.paymentStatus}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
