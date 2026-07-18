import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Star, FileText } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const CategoryProductsPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  /* =======================
     FETCH CATEGORY PRODUCTS
  ======================= */
  const fetchCategoryProducts = async () => {
    const res = await api.get(
      `/products/category/${encodeURIComponent(category)}`,
    );

    return res.data.products || [];
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
          fetchCategoryProducts(),
          fetchMyPrescriptions(),
        ]);

        // 🔥 SHOW ONLY ACTIVE PRODUCTS
        setProducts(productsData.filter((p) => p.isActive === true));
        setMyPrescriptions(prescriptionsData);
      } catch {
        toast.error("Failed to load category products");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [category]);
  /* =======================
     PRESCRIPTION STATUS
  ======================= */
  const getPrescriptionStatus = (productId) => {
    const prescription = myPrescriptions.find(
      (p) => p.medicine?._id === productId,
    );
    return prescription ? prescription.status : null;
  };

  /* =======================
     CARD CLICK HANDLER
     (NEW FEATURE)
  ======================= */
  const handleCardClick = (product) => {
    if (product.prescriptionRequired) {
      const status = getPrescriptionStatus(product._id);

      // 🔥 Pending or Approved → My Prescriptions
      if (status === "pending" || status === "approved") {
        navigate("/my-prescriptions");
        return;
      }
    }

    navigate(`/products/${product._id}`);
  };

  /* =======================
     ADD TO CART
  ======================= */
  const handleAddToCart = async (product, e) => {
    e.stopPropagation();

    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    try {
      setAddingId(product._id);
      await api.post("/cart/add", {
        productId: product._id,
        quantity: 1,
      });
      toast.success("Added to cart 🛒");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  const formattedTitle = category
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="min-h-screen bg-sky-50 px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold text-sky-900 sm:mb-8 sm:text-3xl">
          {formattedTitle} Medicines
        </h1>

        {loading ? (
          <p className="text-center text-sky-700">Loading medicines...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-sky-700">
            No medicines found for this category.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
            {products.map((product) => {
              const status = product.prescriptionRequired
                ? getPrescriptionStatus(product._id)
                : null;

              return (
                <div
                  key={product._id}
                  onClick={() => handleCardClick(product)}
                  className="flex h-full cursor-pointer flex-col rounded-2xl border border-sky-100 bg-white p-3 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5"
                >
                  {/* Image */}
                  <div className="mb-3 flex h-28 sm:h-36 lg:h-44 w-full items-center justify-center rounded-2xl bg-slate-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain p-2 transition duration-300 hover:scale-105"
                      loading="lazy"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/400x300?text=No+Image")
                      }
                    />
                  </div>

                  {/* Name */}
                  <h2 className="mb-2 line-clamp-2 text-sm font-semibold text-sky-900 sm:text-base">
                    {product.name}
                  </h2>

                  {/* Price & Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-base font-bold text-sky-900 sm:text-lg">
                      ₹{product.price}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star size={16} fill="#f59e0b" stroke="none" />
                      <span className="text-sm font-medium text-slate-700">
                        {product.rating || 4.5}
                      </span>
                    </div>
                  </div>

                  {/* CTA LOGIC */}
                  {product.stock === 0 ? (
                    <button
                      disabled
                      className="mt-auto flex h-11 w-full items-center justify-center rounded-xl bg-red-100 px-3 text-xs font-semibold text-red-700 sm:text-sm"
                    >
                      ❌ Out of Stock
                    </button>
                  ) : !product.prescriptionRequired ? (
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={addingId === product._id}
                      className={`mt-auto flex h-11 w-full items-center justify-center gap-2 rounded-xl px-3 text-xs font-semibold transition sm:text-sm ${
                        addingId === product._id
                          ? "cursor-not-allowed bg-gray-400 text-white"
                          : "bg-sky-600 text-white hover:bg-sky-700"
                      }`}
                    >
                      <ShoppingCart size={16} />
                      {addingId === product._id ? "Adding..." : "Add to Cart"}
                    </button>
                  ) : !status ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/upload-prescription?medicineId=${product._id}`,
                        );
                      }}
                      className="mt-auto flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-xs font-semibold text-white transition hover:bg-emerald-700 sm:text-sm"
                    >
                      <FileText size={16} />
                      Upload Prescription
                    </button>
                  ) : status === "pending" ? (
                    <button
                      disabled
                      className="mt-auto flex h-11 w-full items-center justify-center rounded-xl bg-amber-100 px-3 text-xs font-semibold text-amber-700 sm:text-sm"
                    >
                      ⏳ Pending Approval
                    </button>
                  ) : status === "rejected" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/upload-prescription?medicineId=${product._id}`,
                        );
                      }}
                      className="mt-auto flex h-11 w-full items-center justify-center rounded-xl bg-red-600 px-3 text-xs font-semibold text-white transition hover:bg-red-700 sm:text-sm"
                    >
                      ❌ Upload Again
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/my-prescriptions");
                      }}
                      className="mt-auto flex h-11 w-full items-center justify-center rounded-xl bg-emerald-100 px-3 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-200 sm:text-sm"
                    >
                      ✅ Approved · View
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProductsPage;
