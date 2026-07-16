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
       if(!formData)
       {
        return toast.error("Update Details Not Be Empty");
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
    <div className="min-h-screen bg-sky-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-6 sm:p-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center text-sky-700">
            <User size={36} />
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
                  className="w-full mt-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-sky-400 outline-none"
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
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
              >
                <Edit size={18} />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                  text-white font-semibold transition ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  <Save size={18} />
                  {loading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                  bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
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
