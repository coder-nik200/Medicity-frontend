import React, { useEffect, useState } from "react";
import { UploadCloud, FileText, Pill, Loader2 } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const PrescriptionUploadPage = () => {
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const medicineId = searchParams.get("medicineId");

  /* ================= SAFETY CHECK ================= */
  useEffect(() => {
    if (!medicineId) {
      toast.error("Invalid prescription request");
      navigate("/prescription-medicines");
    }
  }, [medicineId, navigate]);

  /* ================= INIT ================= */
  useEffect(() => {
    const init = async () => {
      try {
        const medRes = await api.get(`/products/${medicineId}`);
        setMedicine(medRes.data.data);

        const presRes = await api.get("/prescriptions/my");

        const hasPending = presRes.data.data.some(
          (p) =>
            p.medicine?._id === medicineId &&
            p.status === "pending"
        );

        if (hasPending) {
          toast.error(
            "You already have a pending prescription for this medicine"
          );
          navigate("/my-prescriptions");
          return;
        }
      } catch {
        toast.error("Failed to initialize prescription upload");
        navigate("/prescription-medicines");
      } finally {
        setLoading(false);
      }
    };

    if (medicineId) init();
  }, [medicineId, navigate]);

  /* ================= FILE CHANGE ================= */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    // ✅ File size check (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setFile(selectedFile);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload a prescription file");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("prescription", file);
      formData.append("notes", notes);
      formData.append("medicineId", medicineId);

      await api.post("/prescriptions", formData);

      toast.success(
        "Prescription uploaded successfully. Waiting for approval."
      );

      setFile(null);
      setNotes("");
      navigate("/my-prescriptions");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to upload prescription"
      );
    } finally {
      setUploading(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sky-700">
        Loading prescription details...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-sky-100 max-w-xl w-full p-8">
        {/* Medicine Info */}
        {medicine && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-3">
              <Pill className="text-emerald-700" size={20} />
              <div>
                <p className="text-sm text-emerald-700 font-semibold">
                  Prescription for:
                </p>
                <p className="font-bold text-sky-900">
                  {medicine.name}
                </p>
                <p className="text-sm text-sky-700">
                  Price: ₹{medicine.price}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center">
            <FileText className="text-sky-700" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-sky-900">
              Upload Prescription
            </h1>
            <p className="text-sky-700 text-sm">
              Our pharmacists will verify your prescription before processing
              your order.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="border-2 border-dashed border-sky-200 rounded-2xl bg-sky-50/60 p-6 text-center cursor-pointer hover:border-sky-400 transition">
            <input
              id="prescription"
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="prescription" className="block">
              <UploadCloud className="mx-auto text-sky-600 mb-3" size={32} />
              <p className="text-sky-900 font-semibold">
                {file ? file.name : "Click to upload or drag & drop"}
              </p>
              <p className="text-xs text-sky-600 mt-1">
                Accepted formats: JPG, PNG, PDF (Max 5MB)
              </p>
            </label>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-sky-900">
              Notes for Pharmacist (optional)
            </label>
            <textarea
              className="w-full min-h-[90px] px-4 py-2 border rounded-xl focus:ring-2 focus:ring-sky-400 outline-none text-sm"
              placeholder="Mention preferred brand, dosage instructions or delivery notes."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-sm transition disabled:bg-gray-300"
          >
            {uploading && <Loader2 className="animate-spin" size={18} />}
            {uploading ? "Uploading..." : "Submit Prescription"}
          </button>

          <p className="text-[11px] text-sky-600 mt-2">
            By uploading, you confirm that this prescription is issued by a
            registered medical practitioner and is valid.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionUploadPage;