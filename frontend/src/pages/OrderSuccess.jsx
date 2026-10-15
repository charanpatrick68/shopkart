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

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(id);
        setOrder(response.data.order);
      } catch {
        setOrder(null);
      }
    };

    fetchOrder();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#f7f8f4]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6">
        <div className="rounded-md border border-[#dfe9d1] bg-white p-8 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#edf6e8] text-3xl">✅</div>
          <h1 className="mt-5 text-3xl text-[#202720]">Order Placed Successfully</h1>
          <p className="mt-3 text-sm text-[#69736a]">Your order has been saved successfully.</p>

          <div className="mt-6 space-y-3 text-sm text-[#465148]">
            <div className="flex justify-between gap-4 border-b border-[#edf0ea] pb-3">
              <span>Order ID</span>
              <span className="font-semibold text-[#202720]">{order?._id || id}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-[#edf0ea] pb-3">
              <span>Total</span>
              <span className="font-semibold text-[#202720]">{formatPrice(order?.totalAmount || 0)}</span>
            </div>
            <div className="flex justify-between gap-4 pb-1">
              <span>Status</span>
              <span className="font-semibold text-[#202720]">{order?.status || "PLACED"}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/orders" className="rounded-sm bg-[#255a40] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1d4933]">
              View My Orders
            </Link>
            <Link to="/products" className="rounded-sm border border-[#dce2d8] bg-white px-5 py-3 text-sm font-semibold text-[#2d4d3a] hover:border-[#326246] hover:text-[#1d4933]">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccess;
