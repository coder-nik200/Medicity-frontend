import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  MoveLeftIcon,
  MoveRightIcon,
  FileText,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

const FeaturedMedicines = () => {
  const [products, setProducts] = useState([]);
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [adding, setAdding] = useState(null);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { incrementCart } = useCart();

  /* =======================
     FETCH PRODUCTS
  ======================= */
  const fetchProducts = async () => {
    const res = await api.get("/products", { params: { limit: 12, sort: "popular", inStock: true } });
    return res.data.data || [];
  };

  /* =======================
     FETCH MY PRESCRIPTIONS
  ======================= */
  const fetchMyPrescriptions = async () => {
    try {
      const res = await api.get("/prescriptions/my");
      return res.data.data || [];
    } catch {
      return [];
    }
  };

useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, prescriptionsData] = await Promise.all([
        fetchProducts(),
        fetchMyPrescriptions(),
      ]);

      // 🔥 SHOW ONLY ACTIVE PRODUCTS
      setProducts(productsData.filter(p => p.isActive === true));
      setMyPrescriptions(prescriptionsData);
    } catch {
      toast.error("Failed to load featured medicines");
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);

  /* =======================
     PRESCRIPTION STATUS
     (same logic as PrescriptionPageMedicines)
  ======================= */
  const getPrescriptionStatus = (productId) => {
    const prescription = myPrescriptions.find(
      (p) => p.medicine?._id === productId
    );
    return prescription ? prescription.status : null;
  };

  /* =======================
     CARD CLICK HANDLER (NEW FEATURE)
  ======================= */
  const handleCardClick = (item) => {
    if (item.prescriptionRequired) {
      const status = getPrescriptionStatus(item._id);

      // 🔥 Pending or Approved → redirect to My Prescriptions
      if (status === "pending" || status === "approved") {
        navigate("/my-prescriptions");
        return;
      }
    }

    // Default → product detail page
    navigate(`/products/${item._id}`);
  };

  /* =======================
     ADD TO CART
  ======================= */
  const handleAddToCart = async (productId) => {
    try {
      setAdding(productId);
      await api.post("/cart/add", { productId, quantity: 1 });
      toast.success("Added to cart 🛒");
      incrementCart(1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add to cart"
      );
    } finally {
      setAdding(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-sky-700 font-semibold">
        Loading featured medicines...
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-sky-50 via-white to-sky-50 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-sky-900">
              Featured Medicines
            </h2>
            <p className="text-sky-600 text-sm mt-2">
              Top recommended health essentials
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm font-semibold text-sky-700 underline"
          >
            View all →
          </Link>
        </div>

        {/* Scroll Container */}
        <div className="relative">
          <button
            onClick={() =>
              scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })
            }
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full w-10 h-10 items-center justify-center"
          >
            <MoveLeftIcon size={18} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 no-scrollbar"
          >
            {products.map((item) => {
              const status = item.prescriptionRequired
                ? getPrescriptionStatus(item._id)
                : null;

              return (
                <div
                  key={item._id}
                  onClick={() => handleCardClick(item)}
                  className="min-w-[260px] bg-white rounded-3xl border shadow-md p-5 hover:shadow-xl hover:-translate-y-2 transition cursor-pointer"
                >
                  {/* Image */}
                  <div className="flex justify-center mb-4">
                    <div className="w-32 h-32 bg-sky-50 rounded-3xl flex items-center justify-center">
                      {/* <img
                        src={`http://localhost:5001${item.image}`}
                        alt={item.name}
                        className="object-contain p-4"
                      /> */}
                      
                        <img
                        src={item.image}
                        alt={item.name}
                        className="object-contain p-4"
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="font-semibold text-sky-900 mb-1">
                    {item.name}
                  </h3>

                  {/* Price */}
                  <p className="text-xl font-bold mb-4">
                    ₹{item.price}
                  </p>

                  {/* CTA LOGIC */}
                  {item.stock === 0 ? (
                    <button
                      disabled
                      className="w-full bg-red-100 py-3 rounded-xl"
                    >
                      ❌ Out of Stock
                    </button>
                  ) : !item.prescriptionRequired ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item._id);
                      }}
                      className="w-full bg-sky-600 text-white py-3 rounded-xl"
                    >
                      <ShoppingCart size={16} className="inline mr-2" />
                      Add to Cart
                    </button>
                  ) : !status ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/upload-prescription?medicineId=${item._id}`);
                      }}
                      className="w-full bg-emerald-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
                    >
                      <FileText size={18} />
                      Upload Prescription
                    </button>
                  ) : status === "pending" ? (
                    <button
                      disabled
                      className="w-full bg-amber-100 py-3 rounded-xl"
                    >
                      ⏳ Pending Approval
                    </button>
                  ) : status === "rejected" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/upload-prescription?medicineId=${item._id}`);
                      }}
                      className="w-full bg-red-600 text-white py-3 rounded-xl"
                    >
                      ❌ Upload Again
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/my-prescriptions");
                      }}
                      className="w-full bg-emerald-100 text-emerald-700 py-3 rounded-xl"
                    >
                      ✅ Approved · View
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() =>
              scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })
            }
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full w-10 h-10 items-center justify-center"
          >
            <MoveRightIcon size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMedicines;
