import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ================= USER LAYOUT ================= */
import Layout from "./components/Layout";
/* ================= USER PAGES ================= */
import IndexPage from "./components/IndexPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryProductsPage from "./pages/CategoryProductPage";
import SpecificProductPage from "./pages/SpecificProductPage";
import PrescriptionPageMedicines from "./pages/PrescriptionPageMedicines";
import PrescriptionUploadPage from "./pages/PrescriptionUploadPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrdersPage from "./pages/MyOrdersPage";
import MyPrescriptions from "./pages/MyPrescriptions";
import ProfilePage from "./pages/ProfilePage";
import AddressPage from "./pages/AddressPage";
import UserDashboard from "./pages/UserDashboard";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminLoginPage from "./pages/Admin/AdminLoginPage";
import AdminPrescriptions from "./pages/Admin/AdminPrescriptions";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminRoute from "./pages/Admin/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminUsers from "./pages/Admin/AdminUsers";

/* ================= ADMIN ================= */

const App = () => {
  return (
    <>
      <Toaster position="top-right" />

      <Router>
        <Routes>
          {/* ================= WEBSITE (WITH LAYOUT) ================= */}
          <Route path="/" element={<Layout />}>
            {/* Home */}
            <Route index element={<IndexPage />} />

            {/* Auth (part of website UI) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Browsing */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<SpecificProductPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route
              path="/category/:category"
              element={<CategoryProductsPage />}
            />
            <Route
              path="/prescription-medicines"
              element={<PrescriptionPageMedicines />}
            />
            {/* User actions */}
            <Route
              path="/upload-prescription"
              element={<PrescriptionUploadPage />}
            />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccess />} />

            {/* Account */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/my-prescriptions" element={<MyPrescriptions/>} />
            <Route path="/account/dashboard" element={<UserDashboard />} />
            <Route path="/account/addresses" element={<AddressPage />} />

            {/* Info */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* ================= ADMIN AUTH (NO WEBSITE UI) ================= */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* ================= ADMIN PANEL (PROTECTED) ================= */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="prescriptions" element={<AdminPrescriptions />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
