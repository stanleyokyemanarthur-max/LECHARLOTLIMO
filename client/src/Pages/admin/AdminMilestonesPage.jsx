import { useEffect, useState } from "react";
import axios from "axios";
import MilestoneForm from "../../Components/MilestoneForm";

export default function AdminMilestonesPage() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const token = localStorage.getItem("token");

  const fetchMilestones = async () => {
    try {
      const res = await axios.get("/api/admin/milestones", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMilestones(res.data);
    } catch (err) {
      console.error("Failed to load milestones", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const openCreateForm = () => {
    setSelectedMilestone(null);
    setShowForm(true);
  };

  const openEditForm = (milestone) => {
    setSelectedMilestone(milestone);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedMilestone(null);
  };

  if (loading) {
    return <p className="text-gray-400">Loading milestones…</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#B8860B]">
          Milestone Campaigns
        </h2>

        <button
          onClick={openCreateForm}
          className="bg-[#B8860B] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#b5a004]"
        >
          + New Milestone
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <MilestoneForm
          milestone={selectedMilestone}
          onClose={closeForm}
          onCreated={fetchMilestones}
        />
      )}

      {/* Milestones List */}
      <div className="grid gap-4">
        {milestones.map((m) => (
          <div
            key={m._id}
            className="bg-[#111111] border border-gray-800 rounded-xl p-5 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">{m.name}</h3>

              <p className="text-sm text-gray-400">
                Trigger: {m.triggerType} • Threshold: {m.threshold}
              </p>

              <p className="text-sm text-gray-500">
                Reward: {m.rewardTemplate?.title || "N/A"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  m.isActive
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {m.isActive ? "Active" : "Disabled"}
              </span>

              <button
                onClick={() => openEditForm(m)}
                className="text-sm text-[#B8860B] hover:underline"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
