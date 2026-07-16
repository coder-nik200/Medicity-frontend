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
      `/products/category/${encodeURIComponent(category)}`
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
      setProducts(productsData.filter(p => p.isActive === true));
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
      (p) => p.medicine?._id === productId
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
      toast.error(
        error.response?.data?.message || "Failed to add to cart"
      );
    } finally {
      setAddingId(null);
    }
  };

  const formattedTitle = category
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="min-h-screen bg-sky-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-sky-900 mb-8">
          {formattedTitle} Medicines
        </h1>

        {loading ? (
          <p className="text-center text-sky-700">
            Loading medicines...
          </p>
        ) : products.length === 0 ? (
          <p className="text-center text-sky-700">
            No medicines found for this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const status = product.prescriptionRequired
                ? getPrescriptionStatus(product._id)
                : null;

              return (
                <div
                  key={product._id}
                  onClick={() => handleCardClick(product)}
                  className="bg-white rounded-3xl shadow-md border border-sky-100 p-5
                  hover:shadow-xl hover:-translate-y-2 transition cursor-pointer"
                >
                  {/* Image */}
                  <div className="mb-4 w-full aspect-[4/3] bg-gray-100 rounded-2xl flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-3"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/400x300?text=No+Image")
                      }
                    />
                  </div>

                  {/* Name */}
                  <h2 className="font-semibold text-sky-900 mb-1">
                    {product.name}
                  </h2>

                  {/* Price & Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-lg font-bold text-sky-900">
                      ₹{product.price}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star size={16} fill="#f59e0b" stroke="none" />
                      <span>{product.rating || 4.5}</span>
                    </div>
                  </div>

                  {/* CTA LOGIC */}
                  {product.stock === 0 ? (
                    <button
                      disabled
                      className="w-full py-2 rounded-xl font-semibold bg-red-100 text-red-700"
                    >
                      ❌ Out of Stock
                    </button>
                  ) : !product.prescriptionRequired ? (
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={addingId === product._id}
                      className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl font-semibold transition ${
                        addingId === product._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-sky-600 text-white hover:bg-sky-700"
                      }`}
                    >
                      <ShoppingCart size={16} />
                      {addingId === product._id
                        ? "Adding..."
                        : "Add to Cart"}
                    </button>
                  ) : !status ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/upload-prescription?medicineId=${product._id}`
                        );
                      }}
                      className="w-full py-2 rounded-xl font-semibold bg-emerald-600 text-white flex items-center justify-center gap-2"
                    >
                      <FileText size={18} />
                      Upload Prescription
                    </button>
                  ) : status === "pending" ? (
                    <button
                      disabled
                      className="w-full py-2 rounded-xl font-semibold bg-amber-100 text-amber-700"
                    >
                      ⏳ Pending Approval
                    </button>
                  ) : status === "rejected" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/upload-prescription?medicineId=${product._id}`
                        );
                      }}
                      className="w-full py-2 rounded-xl font-semibold bg-red-600 text-white"
                    >
                      ❌ Upload Again
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/my-prescriptions");
                      }}
                      className="w-full py-2 rounded-xl font-semibold bg-emerald-100 text-emerald-700"
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