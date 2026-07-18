import { Star, FileText } from "lucide-react";
import api from "../api/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PrescriptionPageMedicines = () => {
  const [products, setProducts] = useState([]);
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* =======================
     FETCH PRESCRIPTION MEDICINES
  ======================= */
  const fetchPrescriptionMedicines = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/prescription");

      const prescriptionProducts =
        res.data.data?.filter(
          (product) => product.prescriptionRequired === true,
        ) || [];

      setProducts(prescriptionProducts);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch prescription medicines",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     FETCH USER PRESCRIPTIONS
  ======================= */
  const fetchMyPrescriptions = async () => {
    try {
      const res = await api.get("/prescriptions/my");
      setMyPrescriptions(res.data.data || []);
    } catch {
      // silent (user might not be logged in)
    }
  };

  useEffect(() => {
    fetchPrescriptionMedicines();
    fetchMyPrescriptions();
  }, []);

  /* =======================
     PRESCRIPTION STATUS
  ======================= */
  const getPrescriptionStatus = (productId) => {
    const prescription = myPrescriptions.find(
      (p) => p.medicine?._id === productId,
    );
    return prescription ? prescription.status : null;
  };

  const handleUploadPrescription = (e, productId) => {
    e.stopPropagation();
    navigate(`/upload-prescription?medicineId=${productId}`);
  };

  return (
    <div className="min-h-screen bg-sky-50 px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-sky-900 sm:text-3xl">
            Prescription Medicines
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-sky-700 sm:text-base">
            These medicines require a valid prescription. Upload once and reuse
            after approval.
          </p>
        </div>

        {/* Warning */}
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          ⚠️ Prescription medicines cannot be purchased without pharmacist
          approval.
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-sky-700 font-medium">
            Loading prescription medicines...
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
            {products.length === 0 ? (
              <p className="text-sky-700 col-span-full text-center">
                No prescription medicines available.
              </p>
            ) : (
              products.map((product) => {
                const status = getPrescriptionStatus(product._id);

                return (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/products/${product._id}`)}
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

                    {/* Badge */}
                    <p className="mb-3 inline-block rounded-full bg-linear-to-r from-red-400 to-amber-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white sm:px-3 sm:text-xs">
                      Prescription Required
                    </p>

                    {/* Price + Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-base font-bold text-sky-900 sm:text-lg">
                        ₹{product.price?.toFixed(2) || "0.00"}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star size={16} fill="#f59e0b" stroke="none" />
                        <span className="text-sm font-medium text-slate-700">
                          {product.rating || 4.5}
                        </span>
                      </div>
                    </div>

                    {/* CTA PRIORITY */}
                    {product.stock === 0 ? (
                      <button
                        disabled
                        className="mt-auto flex h-11 w-full items-center justify-center rounded-xl bg-red-100 px-3 text-xs font-semibold text-red-700 sm:text-sm"
                      >
                        ❌ Out of Stock
                      </button>
                    ) : !status ? (
                      <button
                        onClick={(e) =>
                          handleUploadPrescription(e, product._id)
                        }
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
                        onClick={(e) =>
                          handleUploadPrescription(e, product._id)
                        }
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
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionPageMedicines;
