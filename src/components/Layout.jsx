import React from "react";
import { Outlet, Link } from "react-router-dom";
import Navbar from "../pages/Navbar";
import Footer from "../pages/Footer";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
