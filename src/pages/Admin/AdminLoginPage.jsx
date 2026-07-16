import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck } from "lucide-react";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });

      if (res.data.role !== "admin") {
        toast.error("You are not authorized to access admin panel");
        return;
      }

      setUser(res.data);
      toast.success("Welcome back, Admin");
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4">
      <div className="w-full max-w-sm bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 border border-slate-200">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-900 text-white mb-3">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Admin Access
          </h2>
          <p className="text-sm text-slate-500 mt-1 text-center">
            Authorized personnel only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition"
            />
          </div>

          <button
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              loading
                ? "bg-slate-400 cursor-not-allowed text-white"
                : "bg-slate-900 hover:bg-black text-white"
            }`}
          >
            {loading ? "Authenticating..." : "Sign in to Admin Panel"}
          </button>
        </form>

        {/* Footer note */}
        <p className="text-xs text-center text-slate-400 mt-6">
          This system is monitored and restricted to authorized users.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;