import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { userInfo } = useSelector((state) => state.auth);

  const fetchRewards = async () => {
    try {
      const res = await axios.get("/api/admin/rewards", {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });

      setRewards(res.data.rewards || []);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      setRewards([]); // prevent crashes
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (userInfo?.token) fetchRewards();

    // Auto-refresh every 15s
    const interval = setInterval(() => {
      if (userInfo?.token) fetchRewards();
    }, 15000);

    return () => clearInterval(interval);
  }, [userInfo]);

  const updateRewardStatus = async (rewardId, status) => {
    if (!window.confirm(`Change reward status to ${status}?`)) return;

    try {
      await axios.patch(
        `/api/admin/rewards/${rewardId}`,
        { status },
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      fetchRewards();
    } catch (err) {
      alert("Failed to update reward");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-[#B8860B]">
        Loading rewards...
      </div>
    );

  const filteredRewards = Array.isArray(rewards)
    ? rewards.filter((r) => {
      const matchesStatus =
        filterStatus === "all" || r.status === filterStatus;

      const name = r.user?.name?.toLowerCase() || "";
      const email = r.user?.email?.toLowerCase() || "";

      const matchesSearch =
        name.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    })
    : [];


  return (
    <div>
      <h1 className="text-2xl font-bold text-[#B8860B] mb-6">User Rewards</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div className="flex gap-2">
          {["all", "AVAILABLE", "LOCKED", "QUEUED", "USED", "CANCELLED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${filterStatus === status
                    ? "bg-[#B8860B] text-black"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
              >
                {status}
              </button>
            )
          )}
        </div>

        <input
          type="text"
          placeholder="Search user name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 text-gray-200 border border-gray-600 rounded-md px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#B8860B]"
        />
      </div>

      {/* Rewards Table */}
      <table className="min-w-full border border-gray-700 text-sm table-fixed">
        <thead className="bg-[#B8860B] text-black">
          <tr>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Reward</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRewards.length > 0 ? (
            filteredRewards.map((r) => (
              <tr
                key={r._id}
                className="border-t border-gray-700 hover:bg-gray-800"
              >
                <td className="px-4 py-2">{r.user.name}</td>
                <td className="px-4 py-2">{r.user.email}</td>
                <td className="px-4 py-2">{r.title}</td>
                <td className="px-4 py-2">{r.type}</td>
                <td className="px-4 py-2 capitalize">{r.status}</td>
                <td className="px-4 py-2 space-x-2">
                  {r.status === "QUEUED" && (
                    <button
                      onClick={() =>
                        updateRewardStatus(r._id, "AVAILABLE")
                      }
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Unlock
                    </button>
                  )}

                  {r.status === "LOCKED" && (
                    <button
                      onClick={() => updateRewardStatus(r._id, "USED")}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Mark Used
                    </button>
                  )}

                  {r.status !== "USED" && r.status !== "QUEUED" && (
                    <button
                      onClick={() =>
                        updateRewardStatus(r._id, "CANCELLED")
                      }
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="text-center py-6 text-gray-400 italic"
              >
                No rewards found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
