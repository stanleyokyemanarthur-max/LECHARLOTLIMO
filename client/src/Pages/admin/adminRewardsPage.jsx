import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminRewards, adminUpdateReward } from "../../slices/adminRewardsSlice";

export default function AdminRewardsPage() {
  const dispatch = useDispatch();

  const items = useSelector((state) => state.adminRewards.items || []);
  const status = useSelector((state) => state.adminRewards.status || "idle");
  const updatingId = useSelector((state) => state.adminRewards.updatingId || null);

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch rewards once on mount
  useEffect(() => {
    dispatch(fetchAdminRewards());
  }, [dispatch]);

  // Memoized filtered rewards
  const filtered = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return items.filter((r) => {
      const matchStatus = filterStatus === "all" || r.status === filterStatus;
      const matchSearch =
        r.user?.name?.toLowerCase().includes(s) ||
        r.user?.email?.toLowerCase().includes(s);
      return matchStatus && matchSearch;
    });
  }, [items, filterStatus, searchTerm]);

  // Helper to handle reward actions
  const handleUpdate = async (id, action) => {
    await dispatch(adminUpdateReward({ id, action }));
    // Refetch rewards after an update to get latest data (new rewards included)
    dispatch(fetchAdminRewards());
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#B8860B]">
        Loading…
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[#B8860B] mb-6">User Rewards</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {["all", "AVAILABLE", "LOCKED", "QUEUED", "USED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1 rounded font-medium ${
              filterStatus === s
                ? "bg-[#B8860B] text-black"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {s}
          </button>
        ))}
        <input
          className="bg-gray-800 px-3 py-1 rounded ml-auto text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B8860B]"
          placeholder="Search user…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 text-sm">
          <thead className="bg-[#B8860B] text-black">
            <tr>
              <th className="px-3 py-2 text-left">User</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Reward</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No rewards
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const isUpdating = updatingId === r._id;
                return (
                  <tr key={r._id} className="border-t border-gray-700">
                    <td className="px-3 py-2">{r.user?.name || "N/A"}</td>
                    <td className="px-3 py-2">{r.user?.email || "N/A"}</td>
                    <td className="px-3 py-2">{r.title || "—"}</td>
                    <td className="px-3 py-2">{r.status || "—"}</td>
                    <td className="px-3 py-2 space-x-2">
                      {r.status === "QUEUED" && (
                        <button
                          disabled={isUpdating}
                          onClick={() => handleUpdate(r._id, "unlock")}
                          className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Unlock
                        </button>
                      )}
                      {r.status === "LOCKED" && (
                        <button
                          disabled={isUpdating}
                          onClick={() => handleUpdate(r._id, "used")}
                          className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Used
                        </button>
                      )}
                      {r.status !== "USED" && (
                        <button
                          disabled={isUpdating}
                          onClick={() => handleUpdate(r._id, "cancel")}
                          className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
