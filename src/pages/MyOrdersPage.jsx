import { useEffect, useState } from "react";
import { Package, MapPin } from "lucide-react";
import api from "../api/axios";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        setOrders(res.data.orders || []);
        console.log(res.data.orders);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order._id}
          className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                <Package size={24} />
              </div>

              <div>
                <p className="text-lg font-bold text-sky-900">
                  Order #{order._id.slice(-6).toUpperCase()}
                </p>

                <p className="text-sm text-slate-500">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <span
              className={`rounded-full px-4 py-2 text-xs font-semibold ${
                order.status === "DELIVERED"
                  ? "bg-emerald-100 text-emerald-700"
                  : order.status === "CANCELLED"
                    ? "bg-red-100 text-red-700"
                    : order.status === "SHIPPED"
                      ? "bg-sky-100 text-sky-700"
                      : "bg-amber-100 text-amber-700"
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Products */}
          <div className="space-y-4 p-6">
            <h3 className="font-semibold text-slate-800">
              Ordered Medicines ({order.items.length})
            </h3>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl object-contain bg-white p-2"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{item.name}</p>

                    <p className="text-sm text-slate-500">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>

                  <p className="font-bold text-sky-900">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-col gap-5 border-t border-slate-100 pt-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 text-emerald-600" />

                <div>
                  <p className="font-semibold text-slate-800">
                    Delivery Address
                  </p>

                  <p className="text-sm text-slate-600">
                    {order.address.fullName}
                  </p>

                  <p className="text-sm text-slate-500">
                    {order.address.addressLine}, {order.address.city},{" "}
                    {order.address.state} - {order.address.pincode}
                  </p>

                  <p className="text-sm text-slate-500">
                    {order.address.phone}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-500">Total Amount</p>

                <p className="text-2xl font-bold text-emerald-600">
                  ₹{order.totalAmount}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrdersPage;
