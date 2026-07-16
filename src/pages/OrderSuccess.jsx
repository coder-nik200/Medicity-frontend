import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { address, total } = location.state || {};

  const { clearCart } = useCart();

  // Clear cart when component mounts
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 px-4">
      {/* Tick Icon */}
      <div className="flex flex-col items-center bg-white p-10 rounded-3xl shadow-xl">
        <CheckCircle size={80} className="text-emerald-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-4 text-center">
          Your order of ₹{total || "0"} has been placed successfully.
        </p>

        {address && (
          <div className="bg-gray-50 p-4 rounded-xl w-full text-sm text-gray-700 mb-4">
            <p className="font-semibold">{address.fullName}</p>
            <p>
              {address.addressLine}, {address.city}, {address.state} -{" "}
              {address.pincode}
            </p>
            {address.phone && <p>Phone: {address.phone}</p>}
          </div>
        )}

        <button
          onClick={() => navigate("/products")}
          className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
