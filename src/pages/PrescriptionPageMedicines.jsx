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
          (product) => product.prescriptionRequired === true
        ) || [];

      setProducts(prescriptionProducts);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch prescription medicines"
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
      (p) => p.medicine?._id === productId
    );
    return prescription ? prescription.status : null;
  };

  const handleUploadPrescription = (e, productId) => {
    e.stopPropagation();
    navigate(`/upload-prescription?medicineId=${productId}`);
  };

  return (
    <div className="min-h-screen bg-sky-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-sky-900">
            Prescription Medicines
          </h1>
          <p className="text-sky-700 mt-2 max-w-2xl">
            These medicines require a valid prescription. Upload once and reuse
            after approval.
          </p>
        </div>

        {/* Warning */}
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          ⚠️ Prescription medicines cannot be purchased without pharmacist
          approval.
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-sky-700 font-medium">
            Loading prescription medicines...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    className="bg-white rounded-3xl shadow-md border border-sky-100 p-5 hover:shadow-xl hover:-translate-y-2 transition"
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

                    {/* Badge */}
                    <p className="text-xs uppercase tracking-wide text-white font-semibold mb-2 inline-block px-3 py-1 rounded-full bg-gradient-to-r from-red-400 to-amber-500">
                      Prescription Required
                    </p>

                    {/* Price + Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-lg font-bold text-sky-900">
                        ₹{product.price?.toFixed(2) || "0.00"}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star size={16} fill="#f59e0b" stroke="none" />
                        <span className="font-medium text-sky-900">
                          {product.rating || 4.5}
                        </span>
                      </div>
                    </div>

                    {/* CTA PRIORITY */}
                    {product.stock === 0 ? (
                      <button
                        disabled
                        className="w-full bg-red-100 text-red-700 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed"
                      >
                        ❌ Out of Stock
                      </button>
                    ) : !status ? (
                      <button
                        onClick={(e) =>
                          handleUploadPrescription(e, product._id)
                        }
                        className="w-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-3 text-white py-2.5 rounded-xl text-sm font-semibold"
                      >
                        <FileText size={20} /> Upload Prescription
                      </button>
                    ) : status === "pending" ? (
                      <button
                        disabled
                        className="w-full bg-amber-100 text-amber-700 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed"
                      >
                        ⏳ Pending Approval
                      </button>
                    ) : status === "rejected" ? (
                      <button
                        onClick={(e) =>
                          handleUploadPrescription(e, product._id)
                        }
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-semibold"
                      >
                        ❌ Upload Again
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate("/my-prescriptions")}
                        className="w-full bg-emerald-100 text-emerald-700 py-2.5 rounded-xl text-sm font-semibold"
                      >
                        ✅ Approved · View in My Prescriptions
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