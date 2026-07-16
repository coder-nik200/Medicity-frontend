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

  /* =======================
     FETCH CART & ADDRESSES
  ======================= */
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

  /* =======================
     LOADING STATE
  ======================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-600">
        Loading your cart...
      </div>
    );
  }

  /* =======================
     TOTAL CALCULATION (UI)
  ======================= */
  const total = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  /* =======================
     PLACE ORDER
  ======================= */
  const placeOrderHandler = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    try {
      setPlacingOrder(true);

      const res = await api.post("/orders", {
        address: selectedAddress,
      });

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
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* ================= LEFT: CART ITEMS ================= */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            🛒 Your Cart
          </h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-lg">Your cart is empty.</p>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b pb-6"
                >
                  <div className="flex items-center gap-5">
                    {/* <img
                      src={
                        item.product.image
                          ? `http://localhost:5001${item.product.image}`
                          : "https://via.placeholder.com/80"
                      }
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    /> */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div>
                      <h4 className="text-lg font-semibold">
                        {item.product.name}
                      </h4>
                      <p className="text-gray-500">
                        ₹{item.product.price} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="font-bold">
                    ₹{item.product.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT: SUMMARY ================= */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 h-fit sticky top-10">
          <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

          {/* Address */}
<div className="mb-6">
  <h4 className="font-semibold mb-3">📍 Delivery Address</h4>

  {addresses.length === 0 ? (
    <div className="text-gray-500 text-sm bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center">
      🚫 No address saved yet.
      <br />
      <span className="text-xs text-gray-400">
        Please add a delivery address to continue.
      </span>
    </div>
  ) : (
    addresses.map((addr) => (
      <div
        key={addr._id}
        onClick={() => setSelectedAddress(addr)}
        className={`cursor-pointer p-4 rounded-xl border mb-3 transition
          ${
            selectedAddress?._id === addr._id
              ? "border-emerald-600 bg-emerald-50"
              : "border-gray-300"
          }`}
      >
        <p className="font-semibold">{addr.fullName}</p>
        <p className="text-sm text-gray-600">
          {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
        </p>
        {addr.phone && (
          <p className="text-sm text-gray-500">Phone: {addr.phone}</p>
        )}
      </div>
    ))
  )}
</div>

          {/* Totals */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-emerald-600 font-semibold">Free</span>
            </div>
            <hr />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-emerald-600">₹{total}</span>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            disabled={placingOrder || cartItems.length === 0}
            onClick={placeOrderHandler}
            className={`mt-6 w-full py-3 rounded-2xl text-lg font-semibold
              ${
                placingOrder
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
          >
            {placingOrder ? "Placing Order..." : "Place Order ✅"}
          </button>
        </div>
      </div>
    </div>
  );
}
