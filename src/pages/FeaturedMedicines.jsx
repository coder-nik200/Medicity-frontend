import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, FileText } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

const FeaturedMedicines = () => {
  const [products, setProducts] = useState([]);
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [adding, setAdding] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { incrementCart } = useCart();

  const fetchProducts = async () => {
    const res = await api.get("/products", {
      params: { limit: 12, sort: "popular", inStock: true },
    });
    return res.data.data || [];
  };

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

        setProducts(productsData.filter((p) => p.isActive === true));
        setMyPrescriptions(prescriptionsData);
      } catch {
        toast.error("Failed to load featured medicines");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getPrescriptionStatus = (productId) => {
    const prescription = myPrescriptions.find(
      (p) => p.medicine?._id === productId,
    );
    return prescription ? prescription.status : null;
  };

  const handleCardClick = (item) => {
    if (item.prescriptionRequired) {
      const status = getPrescriptionStatus(item._id);
      if (status === "pending" || status === "approved") {
        navigate("/my-prescriptions");
        return;
      }
    }

    navigate(`/products/${item._id}`);
  };

  const handleAddToCart = async (productId) => {
    try {
      setAdding(productId);
      await api.post("/cart/add", { productId, quantity: 1 });
      toast.success("Added to cart 🛒");
      incrementCart(1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(null);
    }
  };

  if (loading) {
    return (
      <section className="bg-linear-to-b from-sky-50 via-white to-sky-50 py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="h-8 w-40 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-2 h-4 w-56 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-3xl bg-slate-200"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-linear-to-b from-sky-50 via-white to-sky-50 py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-sky-900 sm:text-3xl">
              Featured Medicines
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Top recommended health essentials
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs sm:text-sm font-semibold text-sky-700 transition hover:text-sky-900"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {products.map((item) => {
            const status = item.prescriptionRequired
              ? getPrescriptionStatus(item._id)
              : null;

            return (
              <article
                key={item._id}
                onClick={() => handleCardClick(item)}
                className="flex h-full cursor-pointer flex-col rounded-2xl border border-slate-100 bg-white p-3 sm:p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex items-center justify-center rounded-3xl bg-sky-50 p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 sm:h-28 lg:h-32 w-full object-contain"
                    loading="lazy"
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <h3 className="text-xs sm:text-sm sm:text-base font-semibold text-slate-900 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2">
                    {item.composition || item.genericName || item.manufacturer}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-base sm:text-lg font-bold text-slate-900">
                      ₹{item.price}
                    </p>
                    {item.stock > 0 ? (
                      <span className="text-xs font-medium text-emerald-600">
                        In stock
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-red-600">
                        Out of stock
                      </span>
                    )}
                  </div>

                  {item.stock === 0 ? (
                    <button
                      disabled
                      className="mt-4 min-h-[44px] w-full rounded-2xl bg-red-100 px-3 py-2 text-xs sm:text-sm font-semibold text-red-700"
                    >
                      Out of Stock
                    </button>
                  ) : !item.prescriptionRequired ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item._id);
                      }}
                      className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-3 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-sky-700"
                    >
                      <ShoppingCart size={16} />
                      {adding === item._id ? "Adding..." : "Add to Cart"}
                    </button>
                  ) : !status ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/upload-prescription?medicineId=${item._id}`);
                      }}
                      className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-3 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      <FileText size={16} />
                      Upload Prescription
                    </button>
                  ) : status === "pending" ? (
                    <button
                      disabled
                      className="mt-4 min-h-[44px] w-full rounded-2xl bg-amber-100 px-3 py-2 text-xs sm:text-sm font-semibold text-amber-800"
                    >
                      Pending Approval
                    </button>
                  ) : status === "rejected" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/upload-prescription?medicineId=${item._id}`);
                      }}
                      className="mt-4 min-h-[44px] w-full rounded-2xl bg-red-600 px-3 py-2 text-xs sm:text-xs sm:text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Upload Again
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/my-prescriptions");
                      }}
                      className="mt-4 min-h-[44px] w-full rounded-2xl bg-emerald-100 px-3 py-2 text-xs sm:text-xs sm:text-sm font-semibold text-emerald-700"
                    >
                      Approved · View
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMedicines;
