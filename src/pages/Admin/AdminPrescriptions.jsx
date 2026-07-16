import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const AdminPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState({});
  const [actionId, setActionId] = useState(null);
  const [filter, setFilter] = useState("pending");

  /* ================= FETCH ================= */
  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/prescriptions");
      setPrescriptions(res.data.data || []);
    } catch {
      toast.error("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  /* ================= ACTIONS ================= */
  const approve = async (id) => {
    try {
      setActionId(id);
      await api.patch(`/admin/prescriptions/${id}/approve`, {
        comment: comments[id] || "",
      });
      toast.success("Prescription approved");
      setComments((p) => ({ ...p, [id]: "" }));
      fetchPrescriptions();
    } catch {
      toast.error("Approval failed");
    } finally {
      setActionId(null);
    }
  };

  const reject = async (id) => {
    if (!comments[id]) {
      toast.error("Rejection reason required");
      return;
    }

    try {
      setActionId(id);
      await api.patch(`/admin/prescriptions/${id}/reject`, {
        comment: comments[id],
      });
      toast.success("Prescription rejected");
      setComments((p) => ({ ...p, [id]: "" }));
      fetchPrescriptions();
    } catch {
      toast.error("Rejection failed");
    } finally {
      setActionId(null);
    }
  };

  /* ================= HELPERS ================= */
  const badge = (status) => {
    if (status === "approved") return "bg-emerald-100 text-emerald-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const filtered = prescriptions.filter((p) =>
    filter === "all" ? true : p.status === filter,
  );

  return (
    <div className="p-4 sm:p-8">
      {/* ================= HEADER ================= */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        🩺 Prescription Requests
      </h1>

      {/* ================= FILTER ================= */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["pending", "approved", "rejected", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              filter === f
                ? "bg-sky-600 text-white"
                : "bg-white border text-gray-600"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="block lg:hidden space-y-4">
        {filtered.map((p) => (
          <div key={p._id} className="bg-white rounded-xl shadow p-4 space-y-3">
            <div>
              <p className="font-semibold">{p.user?.name}</p>
              <p className="text-xs text-gray-500">{p.user?.email}</p>
            </div>

            <p className="text-sm font-medium">{p.medicine?.name}</p>

            {p.fileUrl && (
              <a
                href={`https://medicity-backend.vercel.app/${p.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 text-sm underline"
              >
                View Prescription
              </a>
            )}

            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badge(
                p.status,
              )}`}
            >
              {p.status.toUpperCase()}
            </span>

            {p.status === "pending" ? (
              <>
                <textarea
                  placeholder="Admin comment"
                  value={comments[p._id] || ""}
                  onChange={(e) =>
                    setComments({ ...comments, [p._id]: e.target.value })
                  }
                  className="w-full border rounded p-2 text-xs"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => approve(p._id)}
                    disabled={actionId === p._id}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(p._id)}
                    disabled={actionId === p._id}
                    className="flex-1 bg-red-600 text-white py-2 rounded text-sm"
                  >
                    Reject
                  </button>
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-400 italic">Already reviewed</p>
            )}
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-sky-600 text-white">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4">Medicine</th>
              <th className="p-4">File</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p._id} className="border-t align-top">
                <td className="p-4">
                  <div className="font-medium">{p.user?.name}</div>
                  <div className="text-xs text-gray-500">{p.user?.email}</div>
                </td>

                <td className="p-4">{p.medicine?.name}</td>

                <td className="p-4">
                  {p.fileUrl ? (
                    <a
                      href={p.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-600 underline"
                    >
                      View
                    </a>
                  ) : (
                    "—"
                  )}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${badge(
                      p.status,
                    )}`}
                  >
                    {p.status.toUpperCase()}
                  </span>
                </td>

                <td className="p-4">
                  {p.status === "pending" ? (
                    <div className="space-y-2">
                      <textarea
                        placeholder="Admin comment"
                        value={comments[p._id] || ""}
                        onChange={(e) =>
                          setComments({
                            ...comments,
                            [p._id]: e.target.value,
                          })
                        }
                        className="w-full border rounded p-2 text-xs"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => approve(p._id)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => reject(p._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filtered.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No prescription requests
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminPrescriptions;
