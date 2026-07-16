import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  ShoppingCart,
  IndianRupee,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react";

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("all");

  /* ================= FETCH STATS ================= */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const params = {};
        if (selectedMonth !== "all") {
          params.month = selectedMonth;
        }

        const { data } = await api.get("/admin/stats", { params });
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedMonth]);

  /* ================= CHART DATA ================= */
  const chartData = useMemo(() => {
    if (!stats?.monthlyRevenue) return [];

    if (selectedMonth === "all") {
      return MONTHS.map((m) => ({
        month: m,
        revenue: stats.monthlyRevenue[m] || 0,
      }));
    }

    return [
      {
        month: selectedMonth,
        revenue: stats.monthlyRevenue[selectedMonth] || 0,
      },
    ];
  }, [stats, selectedMonth]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-lg font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
          📊 Admin Dashboard
        </h1>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-44 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Months</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Users" value={stats.totalUsers} icon={<Users size={26} />} gradient="from-blue-500 to-blue-600" />
        <StatCard title="Orders" value={stats.totalOrders} icon={<ShoppingCart size={26} />} gradient="from-purple-500 to-purple-600" />
        <StatCard title="Revenue" value={`₹${stats.totalRevenue?.toLocaleString()}`} icon={<IndianRupee size={26} />} gradient="from-green-500 to-green-600" />
        <StatCard title="Prescriptions" value={stats.prescriptions.totalPrescriptions} icon={<FileText size={26} />} gradient="from-indigo-500 to-indigo-600" />
        <StatCard title="Pending" value={stats.prescriptions.pendingPrescriptions} icon={<Clock size={26} />} gradient="from-yellow-500 to-yellow-600" />
        <StatCard title="Approved" value={stats.prescriptions.approvedPrescriptions} icon={<CheckCircle size={26} />} gradient="from-emerald-500 to-emerald-600" />
      </div>

      {/* CHART */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
          📈 Monthly Revenue
        </h2>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({ title, value, icon, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} text-white p-4 rounded-xl shadow-md hover:scale-[1.03] transition`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-xs opacity-80">{title}</p>
        <h2 className="text-lg font-bold mt-1">{value}</h2>
      </div>
      <div className="opacity-80">{icon}</div>
    </div>
  </div>
);

export default AdminDashboard;