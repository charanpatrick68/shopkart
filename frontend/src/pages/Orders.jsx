import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import OrderCard from "../components/OrderCard";
import { getOrders } from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getOrders();
        if (active) {
          setOrders(response.data.orders || []);
        }
      } catch {
        if (active) {
          setError("Unable to load your orders.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchOrders();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8f4]">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#648064]">MY ORDERS</p>
        <h1 className="text-3xl text-[#202720] sm:text-4xl">Your Orders</h1>

        {loading && (
          <div className="mt-12 text-center text-sm text-[#69736a]">Loading your orders...</div>
        )}

        {!loading && error && (
          <div className="mt-12 rounded-md border border-[#efd6d1] bg-[#fff8f6] p-6 text-center">
            <p className="text-sm text-[#9b5146]">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-sm bg-[#255a40] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4933]"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="mt-12 rounded-md border border-[#e7ebe3] bg-white p-10 text-center">
            <p className="text-2xl text-[#303a31]">You have not placed any orders yet.</p>
            <p className="mt-3 text-sm text-[#69736a]">Start shopping and your order history will appear here.</p>
            <Link to="/products" className="mt-6 inline-flex rounded-sm bg-[#255a40] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1d4933]">
              Start Shopping
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="mt-8 grid gap-5">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
