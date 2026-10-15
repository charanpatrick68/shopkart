import { Link } from "react-router-dom";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const OrderCard = ({ order }) => {
  const itemCount = (order.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <article className="rounded-md border border-[#e7ebe3] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#edf0ea] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#648064]">Order #{order._id.slice(-6)}</p>
          <p className="mt-1 text-sm text-[#69736a]">{formatDate(order.createdAt)}</p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-[#edf6e8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#214d38]">
          {order.status}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-[#465148]">
        {(order.items || []).slice(0, 3).map((item) => (
          <div key={`${order._id}-${item.product}`} className="flex items-center justify-between gap-3">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span className="font-medium text-[#202720]">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#edf0ea] pt-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#71806f]">Items</p>
          <p className="mt-1 text-sm font-semibold text-[#202720]">{itemCount}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#71806f]">Total</p>
          <p className="mt-1 text-sm font-bold text-[#202720]">{formatPrice(order.totalAmount)}</p>
        </div>
      </div>

      <div className="mt-5">
        <Link
          to={`/orders/${order._id}`}
          className="inline-flex rounded-sm border border-[#dce2d8] bg-[#f7f8f4] px-4 py-2 text-sm font-semibold text-[#2d4d3a] hover:border-[#326246] hover:text-[#1d4933]"
        >
          View Details
        </Link>
      </div>
    </article>
  );
};

export default OrderCard;
