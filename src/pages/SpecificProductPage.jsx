import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ShoppingCart, FileText } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import FullMenu from "../pages/FullMenu.jsx";
import { useCart } from "../context/CartContext";

const SpecificProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { incrementCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const data = res.data.data || res.data;

        if (!data?.isActive) {
          setProduct(null);
          return;
        }

        setProduct(data);
        setRelated(res.data.related || []);
        setSelectedImage(data.image || data.images?.[0] || "");
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const increaseQty = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = async () => {
    if (product.prescriptionRequired) {
      navigate(`/upload-prescription?medicineId=${product._id}`);
      return;
    }

    try {
      setAdding(true);
      await api.post("/cart/add", {
        productId: product._id,
        quantity,
      });
      toast.success("Added to cart 🛒");
      incrementCart(1);
      navigate("/cart");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-lg font-semibold text-sky-700">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-lg font-semibold text-red-500">
        Product not found or unavailable
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-linear-to-br from-sky-50 via-white to-sky-100 px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-1 text-sm font-medium text-slate-600 transition hover:text-sky-700"
        >
          <ChevronLeft size={18} />
          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
            {product.specialCategory && (
              <span className="mb-4 inline-flex rounded-full bg-linear-to-r from-emerald-500 to-sky-600 px-3 py-1 text-xs font-semibold text-white">
                {product.specialCategory}
              </span>
            )}

            <div className="flex justify-center rounded-3xl bg-sky-50 p-4 sm:p-6">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="h-[280px] w-full max-w-[360px] object-contain sm:h-[340px]"
              />
            </div>

            {product.images?.length > 0 && (
              <div className="mt-4 flex justify-center gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                {[product.image, ...product.images]
                  .filter(Boolean)
                  .map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      onClick={() => setSelectedImage(image)}
                      className={`h-12 w-12 flex-shrink-0 rounded-xl border bg-white p-1 ${selectedImage === image ? "border-sky-600" : "border-slate-200"}`}
                    >
                      <img
                        src={image}
                        alt="Medicine view"
                        className="h-full w-full object-contain"
                      />
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
              <h1 className="text-2xl font-bold leading-tight text-sky-900 break-words sm:text-3xl">
                {product.name}
              </h1>
              <p className="mt-4 text-2xl font-bold text-sky-800">
                ₹{product.price}
              </p>
              <p className="mt-4 break-words text-sm leading-relaxed text-slate-600 sm:text-base">
                {product.description || "Always consult a doctor before use."}
              </p>

              {product.stock > 0 ? (
                <p className="mt-4 font-semibold text-emerald-600">
                  ✔ {product.stock} In Stock
                </p>
              ) : (
                <p className="mt-4 font-semibold text-red-500">
                  ✖ Out of Stock
                </p>
              )}

              {product.stock > 0 && !product.prescriptionRequired && (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    Quantity:
                  </span>
                  <div className="flex overflow-hidden rounded-2xl border border-slate-200">
                    <button
                      onClick={decreaseQty}
                      disabled={quantity === 1}
                      className="min-h-11 px-4 text-lg font-semibold text-slate-700 disabled:opacity-50"
                    >
                      −
                    </button>
                    <span className="flex min-w-12 items-center justify-center bg-slate-50 px-4 font-semibold text-slate-800">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQty}
                      disabled={quantity === product.stock}
                      className="min-h-11 px-4 text-lg font-semibold text-slate-700 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                {product.stock === 0 ? (
                  <button
                    disabled
                    className="min-h-11 rounded-2xl bg-gray-400 px-6 py-3 font-semibold text-white"
                  >
                    Out of Stock
                  </button>
                ) : product.prescriptionRequired ? (
                  <button
                    onClick={() =>
                      navigate(`/upload-prescription?medicineId=${product._id}`)
                    }
                    className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-amber-100 px-6 py-3 font-semibold text-amber-800 transition hover:bg-amber-200"
                  >
                    <FileText size={18} />
                    Upload Prescription
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:bg-slate-300"
                  >
                    <ShoppingCart size={18} />
                    {adding ? "Adding..." : "Add to Cart"}
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Product information
              </h2>
              <dl className="mt-4 space-y-3 text-sm text-slate-700">
                <Info label="Manufacturer" value={product.manufacturer} />
                <Info label="Dosage form" value={product.dosageForm} />
                <Info label="Strength" value={product.strength} />
                <Info label="SKU" value={product.sku} />
                <Info
                  label="Rating"
                  value={
                    product.rating
                      ? `${product.rating.toFixed(1)} / 5 (${product.reviewCount || 0} reviews)`
                      : "Not rated"
                  }
                />
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-4">
            <MedicineSection
              title="About this medicine"
              content={product.description}
            />
            <MedicineSection
              title="Composition"
              content={product.composition || product.genericName}
            />
            <MedicineSection title="Uses" items={product.uses} />
            <MedicineSection title="Side effects" items={product.sideEffects} />
            <MedicineSection
              title="Warnings & precautions"
              items={[
                ...(product.warnings || []),
                ...(product.precautions || []),
              ]}
            />
            <MedicineSection
              title="Dosage & storage"
              content={[product.dosage, product.storageInstructions]
                .filter(Boolean)
                .join(" ")}
            />
          </section>
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Need help choosing?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Our pharmacists can help you compare options and review
                prescription requirements before you order.
              </p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Similar medicines
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((item) => (
                <button
                  key={item._id}
                  onClick={() => navigate(`/products/${item._id}`)}
                  className="rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-sm transition hover:shadow-md"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-full object-contain"
                  />
                  <b className="mt-2 block text-sm text-slate-900 line-clamp-2">
                    {item.name}
                  </b>
                  <span className="mt-1 block text-sm text-sky-800">
                    ₹{item.discountPrice || item.price}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <FullMenu />
    </section>
  );
};

function MedicineSection({ title, content, items }) {
  if (!content && !items?.length) return null;
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      {items?.length ? (
        <ul className="mt-3 list-disc space-y-1 break-words pl-5 text-sm leading-relaxed text-slate-600">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 break-words text-sm leading-relaxed text-slate-600">
          {content}
        </p>
      )}
    </section>
  );
}

function Info({ label, value }) {
  return value ? (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="break-words font-medium text-slate-800">{value}</dd>
    </div>
  ) : null;
}

export default SpecificProductPage;
