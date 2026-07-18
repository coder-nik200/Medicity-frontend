import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleNavigate = (productId) => {
    navigate(`/products/${productId}`);
  };

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

  const removeItem = async (productId) => {
    try {
      const res = await api.post("/cart/remove", { productId });
      setCart(res.data.items);
      toast.success("Item removed");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-lg font-semibold text-sky-700">
        Loading cart...
      </div>
    );
  }

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
    <div className="min-h-screen bg-sky-50 px-3 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <h1 className="mb-4 text-2xl font-bold text-sky-900 sm:text-3xl">
            Your Cart
          </h1>
          {cart.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
              Your cart is empty. Start adding medicines to continue.
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      onClick={() => handleNavigate(item.product._id)}
                      className="h-20 w-20 cursor-pointer rounded-2xl object-contain transition hover:scale-105 sm:h-24 sm:w-24"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100?text=No+Image";
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.product.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      ₹{item.product.price} per unit
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      GST: {item.product.gstPercentage}%
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <div className="flex overflow-hidden rounded-2xl border border-slate-200">
                      <button
                        onClick={() => decrementQty(item.product._id)}
                        disabled={item.quantity === 1}
                        className="min-h-11 px-3 text-slate-700 disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="flex min-w-10 items-center justify-center bg-slate-50 px-3 text-sm font-semibold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQty(item.product._id)}
                        className="min-h-11 px-3 text-slate-700"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      ₹
                      {(
                        item.quantity *
                        item.product.price *
                        (1 + item.product.gstPercentage / 100)
                      ).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="text-sky-600 transition hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:h-fit">
          <h2 className="text-lg font-semibold text-slate-900">
            Order Summary
          </h2>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
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
              <span className="font-semibold text-emerald-600">Free</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
            <span className="text-sm font-semibold text-slate-900">
              Grand Total
            </span>
            <span className="text-xl font-bold text-slate-900">
              ₹{grandTotal.toFixed(2)}
            </span>
          </div>

          {cart.length > 0 && (
            <button
              onClick={() => navigate("/checkout")}
              className="mt-5 flex min-h-11 w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Proceed to Payment
            </button>
          )}
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            Payments are securely processed via Stripe. Your card details are
            never stored.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
