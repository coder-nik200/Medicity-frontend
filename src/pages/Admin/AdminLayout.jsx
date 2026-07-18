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
        `admin-link flex items-center gap-3 rounded-xl px-3 py-2.5 ${isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800"}`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-20 bg-black/40 lg:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col bg-slate-900 text-white transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex h-16 items-center justify-between border-b border-slate-700 px-5 text-lg font-semibold">
          Medicity Admin
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/admin/products" icon={Package} label="Products" />
          <NavItem to="/admin/orders" icon={ShoppingBag} label="Orders" />
          <NavItem to="/admin/prescriptions" icon={FileText} label="Prescriptions" />
          <NavItem to="/admin/users" icon={Users} label="Users" />
        </nav>

        <button onClick={handleLogout} className="flex h-16 items-center gap-3 border-t border-slate-700 px-5 text-left text-red-400 transition hover:bg-slate-800">
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <div className="flex flex-1 flex-col lg:ml-72">
        <header className="fixed left-0 right-0 top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:left-72 lg:px-8">
          <button onClick={() => setOpen(true)} className="rounded-full p-2 text-slate-700 lg:hidden">
            <Menu size={20} />
          </button>
          <span className="font-semibold text-slate-700">Admin Panel</span>
        </header>

        <main className="mt-16 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;