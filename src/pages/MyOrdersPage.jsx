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
    <div className="min-h-screen bg-sky-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-900 mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-sky-700">You have no orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-sky-100 text-sky-700">
                      <Package />
                    </div>
                    <div>
                      <p className="font-semibold text-sky-900">
                        Order #{order._id.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toDateString()}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items Preview */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Items ({order.items.length})
                  </p>

                  <div className="flex gap-4 overflow-hidden">
                    {order.items.slice(0, 2).map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 flex-1"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="text-sm">
                          <p className="font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-gray-500">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}

                    {order.items.length > 2 && (
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        +{order.items.length - 2} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Address + Total */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="mt-0.5" />
                    <p>
                      {order.address.city}, {order.address.state} –{" "}
                      {order.address.pincode}
                    </p>
                  </div>

                  <p className="text-lg font-bold text-sky-900">
                    Total: ₹{order.totalAmount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;