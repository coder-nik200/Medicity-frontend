import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import toast from "react-hot-toast";

const AdminLayout = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    finally {
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/admin/login");
    }
  };

  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      end
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `admin-link flex items-center gap-3 px-3 py-2 rounded-lg ${
          isActive
            ? "bg-slate-800 text-white"
            : "text-slate-300 hover:bg-slate-800"
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white flex flex-col
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 text-xl font-bold border-b border-slate-700">
          Medicity Admin
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/admin/products" icon={Package} label="Products" />
          <NavItem to="/admin/orders" icon={ShoppingBag} label="Orders" />
          <NavItem
            to="/admin/prescriptions"
            icon={FileText}
            label="Prescriptions"
          />
          <NavItem to="/admin/users" icon={Users} label="Users" />
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="h-16 flex items-center gap-3 px-6 text-red-400 hover:bg-slate-800 border-t border-slate-700"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8 shadow-sm fixed top-0 left-0 right-0 lg:left-64 z-10">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden text-slate-700"
          >
            <Menu />
          </button>
          <span className="font-semibold text-slate-700">
            Admin Panel
          </span>
        </header>

        {/* Content */}
        <main className="flex-1 mt-16 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;