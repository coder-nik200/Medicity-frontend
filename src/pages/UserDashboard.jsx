import {
  User,
  ShoppingCart,
  Package,
  FileText,
  MapPin,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    cartItems: 0,
    orders: 0,
    prescriptions: 0,
    addresses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/users/dashboard-stats");
        setStats(res.data.stats);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-sky-50">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-sky-100 mt-1">
            Manage your medicines, orders & prescriptions
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            icon={<ShoppingCart size={26} />}
            title="Cart Items"
            value={loading ? "–" : stats.cartItems}
            link="/cart"
            color="from-emerald-500 to-emerald-600"
          />

          <DashboardCard
            icon={<Package size={26} />}
            title="My Orders"
            value={loading ? "–" : stats.orders}
            link="/my-orders"
            color="from-sky-500 to-blue-600"
          />

          <DashboardCard
            icon={<FileText size={26} />}
            title="Prescriptions"
            value={loading ? "–" : stats.prescriptions}
            link="/my-prescriptions"
            color="from-rose-500 to-pink-600"
          />

          <DashboardCard
            icon={<MapPin size={26} />}
            title="Addresses"
            value={loading ? "–" : stats.addresses}
            link="/account/addresses"
            color="from-amber-500 to-orange-500"
          />
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-sky-900 mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickAction title="Browse Medicines" link="/products" />
            <QuickAction
              title="Upload Prescription"
              link="/my-prescriptions"
            />
            <QuickAction title="Edit Profile" link="/profile" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* Dashboard Card */
const DashboardCard = ({ icon, title, value, link, color }) => (
  <Link
    to={link}
    className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lg hover:scale-[1.02] transition"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${color}`} />
    <div className="relative z-10 flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className="bg-white/20 p-4 rounded-2xl">
        {icon}
      </div>
    </div>
  </Link>
);

/* Quick Action */
const QuickAction = ({ title, link }) => (
  <Link
    to={link}
    className="border border-sky-200 rounded-2xl px-5 py-4
    hover:bg-sky-50 hover:border-sky-400 transition font-medium text-sky-700"
  >
    {title}
  </Link>
);

export default UserDashboard;