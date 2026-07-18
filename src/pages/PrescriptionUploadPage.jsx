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
          (p) => p.medicine?._id === medicineId && p.status === "pending",
        );

        if (hasPending) {
          toast.error(
            "You already have a pending prescription for this medicine",
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
        "Prescription uploaded successfully. Waiting for approval.",
      );

      setFile(null);
      setNotes("");
      navigate("/my-prescriptions");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to upload prescription",
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-6 sm:py-10 px-4">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-3xl border border-sky-100 bg-white shadow-xl p-5 sm:p-8">
          {/* Medicine Info */}
          {medicine && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
                  <Pill className="text-emerald-700" size={22} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Prescription For
                  </p>

                  <h2 className="truncate text-base sm:text-lg font-bold text-sky-900">
                    {medicine.name}
                  </h2>

                  <p className="mt-1 text-sm text-sky-700">
                    Price: ₹{medicine.price}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-sky-100">
              <FileText className="text-sky-700" size={24} />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-sky-900">
                Upload Prescription
              </h1>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Upload a valid prescription. Our licensed pharmacists will
                verify it before approving your order.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload Area */}
            <div className="rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50 p-5 sm:p-8 transition hover:border-sky-400">
              <input
                id="prescription"
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              <label
                htmlFor="prescription"
                className="flex cursor-pointer flex-col items-center text-center"
              >
                <div className="mb-4 rounded-full bg-sky-100 p-4">
                  <UploadCloud className="text-sky-600" size={34} />
                </div>

                <p className="break-all text-sm sm:text-base font-semibold text-sky-900">
                  {file ? file.name : "Click to upload prescription"}
                </p>

                <p className="mt-2 text-xs sm:text-sm text-slate-500">
                  JPG, PNG or PDF
                  <br />
                  Maximum file size 5MB
                </p>
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Notes for Pharmacist (Optional)
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention preferred brand, dosage instructions or delivery notes..."
                className="min-h-[120px] w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || uploading}
              className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm sm:text-base font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {uploading && <Loader2 size={18} className="animate-spin" />}

              {uploading ? "Uploading..." : "Submit Prescription"}
            </button>

            {/* Footer */}
            <div className="rounded-xl bg-sky-50 p-3">
              <p className="text-center text-xs leading-5 text-slate-500">
                By uploading this prescription, you confirm that it has been
                issued by a registered medical practitioner and is valid under
                applicable regulations.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionUploadPage;
