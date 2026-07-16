import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/admin/users?search=${search}&page=${page}`,
      );
      setUsers(data.users || []);
      setPages(data.pages || 1);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  /* ================= ACTIONS ================= */
  const updateRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}`, { role });
      toast.success("Role updated");
      fetchUsers();
    } catch {
      toast.error("Error updating role");
    }
  };

  const toggleBlock = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/block`);
      toast.success("Status updated");
      fetchUsers();
    } catch {
      toast.error("Error updating status");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Error deleting user");
    }
  };

  return (
    <div className="p-4 sm:p-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            👥 User Management
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Manage customers & admins
          </p>
        </div>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="block lg:hidden space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500">No users found</p>
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              className="bg-white rounded-xl shadow p-4 space-y-3"
            >
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Role</span>
                <select
                  value={u.role}
                  onChange={(e) => updateRole(u._id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  u.isBlocked
                    ? "bg-red-100 text-red-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                {u.isBlocked ? "Blocked" : "Active"}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleBlock(u._id)}
                  className={`flex-1 py-2 rounded text-xs text-white ${
                    u.isBlocked ? "bg-emerald-600" : "bg-yellow-500"
                  }`}
                >
                  {u.isBlocked ? "Unblock" : "Block"}
                </button>

                <button
                  onClick={() => deleteUser(u._id)}
                  className="flex-1 py-2 rounded text-xs bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Joined</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4">{u.email}</td>

                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u._id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.isBlocked
                          ? "bg-red-100 text-red-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td className="p-4 text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => toggleBlock(u._id)}
                      className={`px-3 py-1 rounded text-xs text-white ${
                        u.isBlocked ? "bg-emerald-600" : "bg-yellow-500"
                      }`}
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>

                    <button
                      onClick={() => deleteUser(u._id)}
                      className="px-3 py-1 rounded text-xs bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center mt-6 gap-2 flex-wrap">
        {[...Array(pages).keys()].map((x) => (
          <button
            key={x + 1}
            onClick={() => setPage(x + 1)}
            className={`w-9 h-9 rounded text-sm font-semibold ${
              page === x + 1
                ? "bg-blue-600 text-white"
                : "bg-white border hover:bg-gray-100"
            }`}
          >
            {x + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
