import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const FullMenu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);

  const navigate = useNavigate();
  const { incrementCart } = useCart();

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch medicines");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to Product Page
  const handleNavigate = (id) => {
    navigate(`/products/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add to Cart
  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    try {
      setAddingId(productId);

      await api.post("/cart/add", {
        productId,
        quantity: 1, // default 1
      });

      toast.success("Added to cart!");
      incrementCart(1);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-sky-700 font-medium py-10">
        Loading medicines...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-sky-900 mb-8 text-center">
          Full Menu
        </h1>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-5 lg:gap-6">
          {products.length === 0 ? (
            <p className="text-center col-span-full text-sky-700">
              No medicines found.
            </p>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                onClick={() => handleNavigate(product._id)}
                className="flex h-full cursor-pointer flex-col rounded-2xl border border-sky-100 bg-white p-3 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5"
              >
                {/* Badge */}
                <span className="mb-3 inline-block rounded-full bg-linear-to-r from-emerald-400 to-sky-500 px-2 py-1 text-[10px] font-semibold text-white shadow-sm sm:px-3 sm:py-1.5 sm:text-xs">
                  {product.category || "General"}
                </span>

                {/* Image */}
                <div className="mb-3 flex h-28 sm:h-36 lg:h-44 items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain p-2 transition duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                </div>

                {/* Name */}
                <h2 className="line-clamp-2 text-sm font-semibold text-sky-900 sm:text-base">
                  {product.name}
                </h2>

                {/* Price + Rating */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-base font-bold text-sky-900 sm:text-lg">
                    ₹{product.price?.toFixed(2) || "0.00"}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star size={16} fill="#f59e0b" stroke="none" />
                    <span className="font-medium text-sky-900">
                      {product.rating || 4.5}
                    </span>
                  </div>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={(e) => handleAddToCart(e, product._id)}
                  disabled={addingId === product._id}
                  className={`mt-auto flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-semibold shadow-md transition-all duration-300 sm:text-sm ${
                    addingId === product._id
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-linear-to-r from-sky-600 to-sky-500 text-white hover:from-sky-700 hover:to-sky-600"
                  }`}
                >
                  <ShoppingCart size={16} />
                  {addingId === product._id ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FullMenu;
