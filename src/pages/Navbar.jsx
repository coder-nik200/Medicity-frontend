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

  /* ---------------- ACTIONS ---------------- */
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

  /* ---------------- CLOSE DROPDOWN ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-sky-700 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="text-2xl font-bold flex items-center gap-2"
        >
          <span className="text-3xl">💊</span>
          Medicity
        </Link>

        {/* ---------------- DESKTOP MENU ---------------- */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-blue-200">
            Home
          </Link>
          <Link to="/products" className="hover:text-blue-200">
            Medicines
          </Link>
          <Link to="/categories" className="hover:text-blue-200">
            Categories
          </Link>
          <Link to="/about" className="hover:text-blue-200">
            About
          </Link>

          <button
            onClick={goToProducts}
            className="flex items-center gap-2 bg-white text-sky-700 px-4 py-2 rounded-xl font-semibold hover:bg-sky-100"
          >
            <Search size={16} />
            Search
          </button>

          <Link
            to="/cart"
            className="relative flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-xl font-semibold"
          >
            <ShoppingCart size={18} />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* PROFILE */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2 bg-white text-sky-700 px-4 py-2 rounded-xl font-semibold"
              >
                <User size={18} />
                {user.name}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white text-gray-800 rounded-2xl shadow-xl overflow-hidden">
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
                    className="w-full text-left flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link
                to="/signup"
                className="bg-white text-blue-700 px-4 py-2 rounded-xl font-semibold"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ---------------- MOBILE MENU ---------------- */}
      {mobileOpen && (
        <div className="md:hidden bg-blue-900 px-4 py-6 space-y-3">
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
            to="/cart"
            label={`Cart (${cartCount})`}
            setMobileOpen={setMobileOpen}
          />
          {!user && (
            <>
              <MobileLink
                to="/login"
                label="Login"
                setMobileOpen={setMobileOpen}
              />
              <MobileLink
                to="/register"
                label="Register"
                setMobileOpen={setMobileOpen}
              />
            </>
          )}

          {/* NOT LOGGED IN */}
          {!user && (
            <>
              <div className="border-t border-blue-700 my-2" />
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
          )}

          {/* LOGGED IN */}
          {user && (
            <>
              <div className="border-t border-blue-700 my-2" />
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
                className="w-full text-left px-4 py-3 rounded-xl text-red-300 hover:bg-red-900/30"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

/* ---------------- REUSABLE COMPONENTS ---------------- */

const DropdownLink = ({ to, icon, label }) => (
  <Link to={to} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100">
    {icon}
    {label}
  </Link>
);

const MobileLink = ({ to, label, setMobileOpen }) => (
  <Link
    to={to}
    onClick={() => setMobileOpen(false)}
    className="block px-4 py-3 rounded-xl text-white hover:bg-blue-800"
  >
    {label}
  </Link>
);

export default Navbar;
