import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/products");
  };

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data.items || []);
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Increment / Decrement Quantity
  const incrementQty = async (productId) => {
    try {
      const res = await api.post("/cart/update", {
        productId,
        action: "increment",
      });
      setCart(res.data.items);
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const decrementQty = async (productId) => {
    try {
      const res = await api.post("/cart/update", {
        productId,
        action: "decrement",
      });
      setCart(res.data.items);
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  // Remove item
  const removeItem = async (productId) => {
    try {
      const res = await api.post("/cart/remove", { productId });
      setCart(res.data.items);
      toast.success("Item removed");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-sky-700 text-lg">
        Loading cart...
      </div>
    );

  // Calculate totals
  const itemsTotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0,
  );
  const gstTotal = cart.reduce(
    (sum, item) =>
      sum +
      item.quantity * item.product.price * (item.product.gstPercentage / 100),
    0,
  );
  const grandTotal = itemsTotal + gstTotal;

  return (
    <div className="min-h-screen bg-sky-50 py-10 px-4">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[2fr,1fr] gap-8">
        {/* CART ITEMS */}
        <div>
          <h1 className="text-2xl font-bold text-sky-900 mb-4">Your Cart</h1>
          {cart.length === 0 ? (
            <p className="text-sky-700 text-sm">
              Your cart is empty. Start adding medicines to continue.
            </p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-sky-100 shadow-sm p-4 flex items-center gap-4 "
                >
                  {/* IMAGE */}
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      onClick={handleNavigate}
                      className="w-full h-full object-contain rounded-xl cursor-pointer"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/100?text=No+Image")
                      }
                    />
                  </div>

                  {/* PRODUCT DETAILS */}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-sky-900">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-sky-600 mt-1">
                      ₹{item.product.price} per unit
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      GST: {item.product.gstPercentage}%
                    </p>
                  </div>

                  {/* QUANTITY + TOTAL */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border border-sky-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => decrementQty(item.product._id)}
                        disabled={item.quantity === 1}
                        className="px-2 py-1 text-sky-700 text-sm hover:bg-sky-50 disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm text-sky-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQty(item.product._id)}
                        className="px-2 py-1 text-sky-700 text-sm hover:bg-sky-50"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-sky-900">
                      ₹
                      {(
                        item.quantity *
                        item.product.price *
                        (1 + item.product.gstPercentage / 100)
                      ).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="text-sky-500 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUMMARY */}
        <aside className="bg-white rounded-2xl border border-sky-100 shadow-md p-5 h-fit">
          <h2 className="text-lg font-semibold text-sky-900 mb-4">
            Order Summary
          </h2>
          <div className="space-y-2 text-sm text-sky-800 mb-4">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span>₹{itemsTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total GST</span>
              <span>₹{gstTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-emerald-600 font-semibold">Free</span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-sky-900">
              Grand Total
            </span>
            <span className="text-xl font-bold text-sky-900">
              ₹{grandTotal.toFixed(2)}
            </span>
          </div>

          {cart.length > 0 && (
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-sm transition"
            >
              Proceed to Payment
            </button>
          )}
          <p className="text-[11px] text-sky-600 mt-2">
            Payments are securely processed via Stripe. Your card details are
            never stored.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
