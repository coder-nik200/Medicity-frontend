import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartRes = await api.get("/cart");
        setCartItems(cartRes?.data?.items || []);

        const addrRes = await api.get("/addresses");
        const savedAddresses = addrRes?.data?.data || [];
        setAddresses(savedAddresses);

        if (savedAddresses.length > 0) {
          setSelectedAddress(savedAddresses[0]);
        }
      } catch (error) {
        console.error("Failed to load checkout data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center px-4 text-xl font-semibold text-slate-600">
        Loading your cart...
      </div>
    );
  }

  const total = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  const placeOrderHandler = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    try {
      setPlacingOrder(true);
      const res = await api.post("/orders", { address: selectedAddress });
      const order = res.data.order;

      navigate("/order-success", {
        state: {
          orderId: order._id,
          address: order.address,
          total: order.totalAmount,
        },
      });
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to place order. Try again.",
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto grid max-w-6xl gap-4 sm:gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">
            Your Cart
          </h2>

          {cartItems.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">Your cart is empty.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-16 w-16 flex-shrink-0 rounded-2xl object-cover sm:h-20 sm:w-20"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 break-words sm:text-base">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-slate-500">
                        ₹{item.product.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="pl-[76px] text-sm font-semibold text-slate-900 sm:pl-0">
                    ₹{item.product.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-24 lg:h-fit">
          <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
            Order Summary
          </h3>

          <div className="mt-5">
            <h4 className="mb-3 font-semibold text-slate-800">
              Delivery Address
            </h4>
            {addresses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
                No address saved yet. Please add a delivery address to continue.
              </div>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr._id}
                  onClick={() => setSelectedAddress(addr)}
                  className={`mb-3 cursor-pointer rounded-2xl border p-4 transition ${selectedAddress?._id === addr._id ? "border-emerald-600 bg-emerald-50" : "border-slate-200 bg-white"}`}
                >
                  <p className="break-words font-semibold text-slate-900">
                    {addr.fullName}
                  </p>
                  <p className="mt-1 break-words text-sm text-slate-600">
                    {addr.addressLine}, {addr.city}, {addr.state} -{" "}
                    {addr.pincode}
                  </p>
                  {addr.phone && (
                    <p className="mt-1 text-sm text-slate-500">
                      Phone: {addr.phone}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
              <span>Total</span>
              <span className="text-emerald-600">₹{total}</span>
            </div>
          </div>

          <button
            disabled={placingOrder || cartItems.length === 0}
            onClick={placeOrderHandler}
            className={`mt-6 flex min-h-11 w-full items-center justify-center rounded-2xl px-4 py-3 text-base font-semibold text-white ${placingOrder ? "cursor-not-allowed bg-slate-400" : "bg-emerald-600 transition hover:bg-emerald-700"}`}
          >
            {placingOrder ? "Placing Order..." : "Place Order ✅"}
          </button>
        </div>
      </div>
    </div>
  );
}
