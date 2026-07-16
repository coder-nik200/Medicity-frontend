import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = {};
      if (search) params.search = search;
      if (category !== "all") params.category = category;
      if (filter === "lowStock") params.lowStock = true;
      if (filter === "expired") params.expired = true;

      const res = await api.get("/admin/products", { params });
      setProducts(res.data.data || []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, filter]);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    const loadCategories = async () => {
      const res = await api.get("/admin/products");
      const unique = [
        ...new Set(
          (res.data.data || []).map((p) => p.specialCategory).filter(Boolean),
        ),
      ];
      setCategories(unique);
    };
    loadCategories();
  }, []);

  /* ================= ACTIONS ================= */
  const updateStock = async (id, stock) => {
    if (stock < 0) return;
    try {
      setUpdatingId(id);
      await api.patch(`/admin/products/${id}/stock`, { stock });
      toast.success("Stock updated");
      fetchProducts();
    } catch {
      toast.error("Stock update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleStatus = async (id, isActive) => {
    try {
      await api.patch(`/admin/products/${id}/status`, {
        isActive: !isActive,
      });
      toast.success("Status updated");
      fetchProducts();
    } catch {
      toast.error("Status update failed");
    }
  };

  const isExpired = (date) => new Date(date) < new Date();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-lg font-semibold">
        Loading products...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold  text-gray-800">
          🏥 Inventory Management
        </h1>
        <p className="text-gray-500 mt-1">
          Manage stock, expiry & availability
        </p>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white p-4 rounded-2xl shadow flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicine..."
            className="pl-10 w-full px-4 py-2 border rounded-xl"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border rounded-xl"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-xl"
        >
          <option value="all">All</option>
          <option value="lowStock">Low Stock</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* ======================================================
            📱 MOBILE & TABLET VIEW (CARDS)
      ====================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
        {products.map((p) => {
          const expired = isExpired(p.expiryDate);
          const lowStock = p.stock <= p.minStockLevel;

          return (
            <div
              key={p._id}
              className="bg-white p-4 rounded-2xl shadow space-y-3"
            >
              <div className="flex gap-3">
                {p.image && (
                  <img
                    src={`http://localhost:5001${p.image}`}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.specialCategory}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {lowStock && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    Low Stock
                  </span>
                )}
                {expired && (
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                    Expired
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    p.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {p.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <input
                type="number"
                defaultValue={p.stock}
                disabled={!p.isActive}
                onBlur={(e) => updateStock(p._id, Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl"
              />

              <button
                onClick={() => toggleStatus(p._id, p.isActive)}
                className="w-full py-2 bg-blue-600 text-white rounded-xl"
              >
                {p.isActive ? "Disable" : "Enable"}
              </button>
            </div>
          );
        })}
      </div>

      {/* ======================================================
            💻 DESKTOP VIEW (TABLE)
      ====================================================== */}
      <div className="hidden lg:block bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Medicine</th>
              <th className="p-4">Category</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Expiry</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const expired = isExpired(p.expiryDate);
              const lowStock = p.stock <= p.minStockLevel;

              return (
                <tr key={p._id} className="border-t">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">{p.specialCategory}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      defaultValue={p.stock}
                      disabled={!p.isActive}
                      onBlur={(e) => updateStock(p._id, Number(e.target.value))}
                      className="w-20 px-2 py-1 border rounded"
                    />
                    {lowStock && (
                      <div className="text-xs text-red-600 font-bold">Low</div>
                    )}
                  </td>
                  <td className="p-4">
                    {new Date(p.expiryDate).toLocaleDateString()}
                    {expired && (
                      <span className="ml-2 text-xs text-red-600">Expired</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        p.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(p._id, p.isActive)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                    >
                      {p.isActive ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!loading && products.length === 0 && (
        <p className="text-center text-gray-500">No products found</p>
      )}
    </div>
  );
};

export default AdminProducts;
