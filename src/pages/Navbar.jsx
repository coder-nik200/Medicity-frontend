import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  User,
  Package,
  LayoutDashboard,
  MapPin,
  LogOut,
  Heart,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { cartCount, fetchCartCount } = useCart();

  useEffect(() => {
    fetchCartCount();
  }, [user]);

  const goToProducts = () => {
    navigate("/products");
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <nav className="sticky top-0 z-50 border-b border-sky-100 bg-linear-to-r from-sky-700 via-sky-700 to-blue-800 text-white shadow-[0_10px_30px_rgba(2,132,199,0.16)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 text-lg font-semibold sm:text-xl"
        >
          <span className="rounded-full bg-white/15 p-2 text-xl">💊</span>
          <span className="tracking-tight">Medicity</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" label="Home" />
          <NavLink to="/products" label="Medicines" />
          <NavLink to="/categories" label="Categories" />
          <NavLink to="/about" label="About" />
          <NavLink to="/contact" label="Contact" />

          <button
            onClick={goToProducts}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
          >
            <Search size={16} />
            Search
          </button>

          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
          >
            <ShoppingCart size={18} />
            Cart
            {cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
              >
                <User size={18} />
                {user.name}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl bg-white text-slate-800 shadow-2xl">
                  <DropdownLink
                    to="/account/dashboard"
                    icon={<LayoutDashboard size={16} />}
                    label="Dashboard"
                  />
                  <DropdownLink
                    to="/profile"
                    icon={<User size={16} />}
                    label="My Profile"
                  />
                  <DropdownLink
                    to="/account/addresses"
                    icon={<MapPin size={16} />}
                    label="Addresses"
                  />
                  <DropdownLink
                    to="/my-orders"
                    icon={<Package size={16} />}
                    label="My Orders"
                  />

                  {user.role === "admin" && (
                    <DropdownLink
                      to="/admin"
                      icon={<LayoutDashboard size={16} />}
                      label="Admin Dashboard"
                    />
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-sky-50 transition hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed right-0 top-0 z-[70] h-full w-[84vw] max-w-[320px] bg-white text-slate-900 shadow-2xl transition-transform duration-300 md:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
              Quick access
            </p>
            <p className="text-sm font-semibold text-slate-900">
              Medicity Menu
            </p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className="space-y-1 overflow-y-auto px-3 py-3"
          style={{ maxHeight: "calc(100% - 73px)" }}
        >
          <MobileLink to="/" label="Home" setMobileOpen={setMobileOpen} />
          <MobileLink
            to="/products"
            label="Medicines"
            setMobileOpen={setMobileOpen}
          />
          <MobileLink
            to="/categories"
            label="Categories"
            setMobileOpen={setMobileOpen}
          />
          <MobileLink to="/about" label="About" setMobileOpen={setMobileOpen} />

          <MobileLink
            to="/contact"
            label="Contact"
            setMobileOpen={setMobileOpen}
          />

          <MobileLink
            to="/cart"
            label={`Cart (${cartCount})`}
            setMobileOpen={setMobileOpen}
          />

          {!user ? (
            <>
              <div className="my-2 border-t border-slate-200" />
              <MobileLink
                to="/login"
                label="Login"
                setMobileOpen={setMobileOpen}
              />
              <MobileLink
                to="/signup"
                label="Register"
                setMobileOpen={setMobileOpen}
              />
            </>
          ) : (
            <>
              <div className="my-2 border-t border-slate-200" />
              <MobileLink
                to="/account/dashboard"
                label="Dashboard"
                setMobileOpen={setMobileOpen}
              />
              <MobileLink
                to="/profile"
                label="My Profile"
                setMobileOpen={setMobileOpen}
              />
              <MobileLink
                to="/account/addresses"
                label="Addresses"
                setMobileOpen={setMobileOpen}
              />
              <MobileLink
                to="/my-orders"
                label="My Orders"
                setMobileOpen={setMobileOpen}
              />
              {user.role === "admin" && (
                <MobileLink
                  to="/admin"
                  label="Admin Dashboard"
                  setMobileOpen={setMobileOpen}
                />
              )}
              <button
                onClick={handleLogout}
                className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, label }) => (
  <Link
    to={to}
    className="rounded-full px-3 py-2 text-sm font-medium text-sky-50 transition hover:bg-white/10 hover:text-white"
  >
    {label}
  </Link>
);

const DropdownLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
  >
    {icon}
    {label}
  </Link>
);

const MobileLink = ({ to, label, setMobileOpen }) => (
  <Link
    to={to}
    onClick={() => setMobileOpen(false)}
    className="flex items-center rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
  >
    {label}
  </Link>
);

export default Navbar;
