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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("all");

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

  const chartData = useMemo(() => {
    if (!stats?.monthlyRevenue) return [];

    if (selectedMonth === "all") {
      return MONTHS.map((m) => ({ month: m, revenue: stats.monthlyRevenue[m] || 0 }));
    }

    return [{ month: selectedMonth, revenue: stats.monthlyRevenue[selectedMonth] || 0 }];
  }, [stats, selectedMonth]);

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center text-lg font-semibold text-slate-600">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">📊 Admin Dashboard</h1>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 sm:w-44">
          <option value="all">All Months</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard title="Users" value={stats.totalUsers} icon={<Users size={22} />} gradient="from-blue-500 to-blue-600" />
        <StatCard title="Orders" value={stats.totalOrders} icon={<ShoppingCart size={22} />} gradient="from-purple-500 to-purple-600" />
        <StatCard title="Revenue" value={`₹${stats.totalRevenue?.toLocaleString()}`} icon={<IndianRupee size={22} />} gradient="from-green-500 to-green-600" />
        <StatCard title="Prescriptions" value={stats.prescriptions.totalPrescriptions} icon={<FileText size={22} />} gradient="from-indigo-500 to-indigo-600" />
        <StatCard title="Pending" value={stats.prescriptions.pendingPrescriptions} icon={<Clock size={22} />} gradient="from-yellow-500 to-yellow-600" />
        <StatCard title="Approved" value={stats.prescriptions.approvedPrescriptions} icon={<CheckCircle size={22} />} gradient="from-emerald-500 to-emerald-600" />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-700">📈 Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, gradient }) => (
  <div className={`rounded-2xl bg-linear-to-br ${gradient} p-4 text-white shadow-md transition hover:scale-[1.01]`}>
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs opacity-80">{title}</p>
        <h2 className="mt-1 text-lg font-bold">{value}</h2>
      </div>
      <div className="opacity-80">{icon}</div>
    </div>
  </div>
);

export default AdminDashboard;