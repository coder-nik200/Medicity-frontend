import React, { useEffect, useState } from "react";
import { Plus, MapPin, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const MAX_ADDRESSES = 3;

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* 🔹 Fetch addresses */
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/addresses");
      setAddresses(res.data.data || []);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  /* 🔹 Auto close form if limit reached */
  useEffect(() => {
    if (addresses.length >= MAX_ADDRESSES) {
      setShowForm(false);
    }
  }, [addresses]);

  /* 🔹 Add address */
  const handleAddAddress = async () => {
    const { fullName, addressLine, city, state, pincode } = form;

    if (!fullName || !addressLine || !city || !state || !pincode) {
      return toast.error("Please fill all required fields");
    }

    try {
      await api.post("/addresses", form);
      toast.success("Address added successfully");
      setForm({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
      });
      setShowForm(false);
      fetchAddresses();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add address"
      );
    }
  };

  /* 🔹 Delete address */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await api.delete(`/addresses/${id}`);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      toast.success("Address deleted");
    } catch {
      toast.error("Failed to delete address");
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-sky-900">
            Delivery Addresses
          </h1>

          <button
            onClick={() => setShowForm(true)}
            disabled={addresses.length >= MAX_ADDRESSES}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition
              ${
                addresses.length >= MAX_ADDRESSES
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-sky-600 text-white hover:bg-sky-700"
              }`}
          >
            <Plus size={18} />
            Add Address
          </button>
        </div>

        {/* Limit Warning */}
        {addresses.length >= MAX_ADDRESSES && (
          <p className="text-sm text-red-500 mb-6">
            You can add a maximum of {MAX_ADDRESSES} addresses only.
          </p>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-center text-sky-700">
            Loading addresses...
          </p>
        )}

        {/* Empty State */}
        {!loading && addresses.length === 0 && (
          <p className="text-center text-sky-700">
            No addresses added yet.
          </p>
        )}

        {/* Address Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="bg-white rounded-2xl p-6 shadow-md border border-sky-100 relative"
            >
              <button
                onClick={() => handleDelete(addr._id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <MapPin className="text-sky-600" />
                <p className="font-semibold text-sky-900">
                  {addr.fullName}
                </p>
              </div>

              <p className="text-sm text-gray-600">
                {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
              </p>

              {addr.phone && (
                <p className="text-sm text-gray-500 mt-1">
                  Phone: {addr.phone}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Add Address Form */}
        {showForm && (
          <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-100">
            <h2 className="text-lg font-semibold text-sky-900 mb-6">
              Add New Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "Full Name", key: "fullName", placeholder: "John Doe" },
                { label: "Phone", key: "phone", placeholder: "9876543210" },
                { label: "City", key: "city", placeholder: "Mumbai" },
                { label: "State", key: "state", placeholder: "Maharashtra" },
                { label: "Pincode", key: "pincode", placeholder: "400001" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) =>
                      setForm({ ...form, [field.key]: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                  />
                </div>
              ))}

              {/* Address Line */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  rows={3}
                  placeholder="House no, Street, Area"
                  value={form.addressLine}
                  onChange={(e) =>
                    setForm({ ...form, addressLine: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm
                  focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 resize-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={handleAddAddress}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white
                py-3 rounded-xl font-semibold shadow-md transition"
              >
                Save Address
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-300 text-gray-700
                py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressPage;
