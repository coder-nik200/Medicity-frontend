import React, { useState } from "react";
import { User, Mail, Shield, Edit, X, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../api/axios";
// import api from "../api/axios"; // use later when backend ready

const ProfilePage = () => {
  const { user, setUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!formData.name.trim() || !formData.email.trim()) {
        toast.error("Name and email are required");
        return;
      }
      // 🔗 BACKEND (enable later)
      const res = await api.put("/users/profile", formData);
      setUser(res.data.data);
      console.log(user);
      //   // 🧪 TEMP: update locally
      //   setUser({ ...user, ...formData });

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-sky-100 bg-white p-6 shadow-xl sm:p-10">
        {/* Header */}
        <div className="mb-8 rounded-2xl bg-sky-50 p-5">
          <h2 className="font-semibold text-sky-900">
            Welcome back, {user?.name}
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Keep your personal information updated for faster checkout and order
            tracking.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-600 to-emerald-500 text-white shadow-lg">
            <User size={42} />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-sky-900">
              My Profile
            </h1>
            <p className="text-sky-600 text-sm">
              Manage your personal information
            </p>
          </div>
        </div>

        {/* Profile Content */}
        <div className="space-y-6">
          {/* Name */}
          <div className="flex items-start gap-4">
            <User className="text-sky-600 mt-1" />
            <div className="w-full">
              <p className="text-xs text-gray-500">Full Name</p>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              ) : (
                <p className="font-semibold text-sky-900">
                  {user?.name || "Not available"}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <Mail className="text-sky-600 mt-1" />
            <div className="w-full">
              <p className="text-xs text-gray-500">Email Address</p>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-sky-400 outline-none"
                />
              ) : (
                <p className="font-semibold text-sky-900">
                  {user?.email || "Not available"}
                </p>
              )}
            </div>
          </div>

          {/* Role (Read-only) */}
          <div className="flex items-center gap-4">
            <Shield className="text-sky-600" />
            <div>
              <p className="text-xs text-gray-500">Account Type</p>
              <p className="font-semibold text-sky-900 capitalize">
                {user?.role || "User"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-500 px-6 font-semibold text-white shadow-md transition hover:from-sky-700 hover:to-sky-600"
              >
                <Edit size={18} />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 font-semibold text-white shadow-md transition hover:from-emerald-700 hover:to-emerald-600"
                >
                  <Save size={18} />
                  {loading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={handleCancel}
                  className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <X size={18} />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
