// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count from backend
  const fetchCartCount = async () => {
    try {
      const res = await api.get("/cart");
      const count = res.data.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      setCartCount(count);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error("Failed to fetch cart count", err);
      }
      setCartCount(0);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    fetchCartCount();
  }, []);

  // Function to increment cart count after adding to cart
  const incrementCart = (quantity = 1) => {
    setCartCount((prev) => prev + quantity);
  };

  const clearCart = async () => {
    try {
      // Clear cart on backend
      await api.delete("/cart/clear"); // make sure your backend has this route
      // Clear cart locally
      setCartCount(0);
    } catch (err) {
      console.error("Failed to clear cart", err);
      toast.error("Could not clear cart");
    }
  };

  return (
    <CartContext.Provider
      value={{ cartCount, fetchCartCount, incrementCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
