import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/orders");
      setOrders(res.data.data || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await api.patch(`/admin/orders/${id}/status`, { status });
      toast.success("Order updated");
      fetchOrders();
    } catch {
      toast.error("Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const badge = (status) => {
    const map = {
      placed: "bg-yellow-100 text-yellow-700",
      delivered: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return map[status] || "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 font-semibold">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 sm:p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            📦 Orders Management
          </h1>
          <p className="text-slate-500 mt-1">
            Monitor and manage customer orders
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64 text-slate-600 font-semibold">
          Loading orders...
        </div>
      )}

      {!loading && (
        <>
          {/* ================= MOBILE VIEW ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:hidden">
            {orders.map((o) => (
              <div
                key={o._id}
                className="bg-white p-5 rounded-3xl shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400 font-mono">
                      #{o._id.slice(-6)}
                    </p>
                    <p className="font-semibold text-slate-800">
                      {o.user?.name}
                    </p>
                    <p className="text-xs text-slate-500">{o.user?.email}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${badge(
                      o.status,
                    )}`}
                  >
                    {o.status.toUpperCase()}
                  </span>
                </div>

                <div className="mt-4 text-sm">
                  <span className="text-slate-500">Total:</span>{" "}
                  <span className="font-bold text-slate-800">
                    ₹{o.totalAmount}
                  </span>
                </div>

                {o.status === "placed" && (
                  <div className="flex gap-3 mt-5">
                    <button
                      disabled={updatingId === o._id}
                      onClick={() => updateStatus(o._id, "delivered")}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition"
                    >
                      Approve
                    </button>

                    <button
                      disabled={updatingId === o._id}
                      onClick={() => updateStatus(o._id, "cancelled")}
                      className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ================= DESKTOP VIEW ================= */}
          <div className="hidden lg:block bg-white rounded-3xl shadow-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left">Order ID</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-center">Total</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      #{o._id.slice(-6)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">
                        {o.user?.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {o.user?.email}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center font-bold text-slate-800">
                      ₹{o.totalAmount}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${badge(
                          o.status,
                        )}`}
                      >
                        {o.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {o.status === "placed" ? (
                        <div className="flex justify-center gap-3">
                          <button
                            disabled={updatingId === o._id}
                            onClick={() => updateStatus(o._id, "delivered")}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition"
                          >
                            Approve
                          </button>

                          <button
                            disabled={updatingId === o._id}
                            onClick={() => updateStatus(o._id, "cancelled")}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center text-slate-500 mt-10">
              No orders found
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminOrders;
