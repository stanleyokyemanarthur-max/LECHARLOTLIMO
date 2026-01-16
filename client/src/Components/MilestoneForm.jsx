import { useState } from "react";
import axios from "axios";

export default function MilestoneForm({ onClose, onCreated }) {
    const token = localStorage.getItem("token");

    // Form state
    const [name, setName] = useState("");
    const [triggerType, setTriggerType] = useState("RIDES");
    const [threshold, setThreshold] = useState(1);
    const [rewardTitle, setRewardTitle] = useState("");
    const [rewardType, setRewardType] = useState("freeRide");
    const [rewardDescription, setRewardDescription] = useState("");
    const [rewardValue, setRewardValue] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axios.post(
                "/api/admin/milestones",
                {
                    name,
                    triggerType,
                    threshold,
                    rewardTemplate: {
                        title: rewardTitle,
                        type: rewardType,
                        description: rewardDescription,
                        value: rewardValue,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            onCreated(); // refresh milestones
            onClose(); // close modal
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to create milestone");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 mt-50 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#111111] p-8 rounded-2xl w-96 shadow-lg border border-gray-800">
                <h2 className="text-2xl font-bold mb-4 text-[#D4AF37]">Create New Milestone</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Milestone Details */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Milestone Name</label>
                        <input
                            type="text"
                            placeholder="E.g., First 5 Rides"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 rounded-lg bg-[#222222] border border-gray-700 focus:outline-none focus:border-[#D4AF37] text-white"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">The name of the milestone to display to users.</p>
                    </div>

                    {/* Trigger Section */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Milestone Trigger</label>
                        <select
                            value={triggerType}
                            onChange={(e) => setTriggerType(e.target.value)}
                            className="w-full p-3 rounded-lg bg-[#222222] border border-gray-700 focus:outline-none focus:border-[#D4AF37] text-white"
                        >
                            <option value="RIDES">Rides – after X rides</option>
                            <option value="SPEND">Spend – after spending X amount</option>
                            <option value="BIRTHDAY">Birthday – special birthday reward</option>
                        </select>
                        <p className="text-xs text-gray-400 mt-1">Select what action triggers this milestone.</p>

                        <label className="block text-sm font-semibold mb-1 mt-3">Threshold</label>
                        <input
                            type="number"
                            placeholder="E.g., 5"
                            value={threshold}
                            onChange={(e) => setThreshold(Number(e.target.value))}
                            className="w-full p-3 rounded-lg bg-[#222222] border border-gray-700 focus:outline-none focus:border-[#D4AF37] text-white"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            The number or amount required for the milestone to be achieved.
                        </p>
                    </div>

                    {/* Reward Section */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Reward Details</h3>

                        <label className="block text-sm mb-1">Reward Title</label>
                        <input
                            type="text"
                            placeholder="E.g., Free Ride, Discount Coupon"
                            value={rewardTitle}
                            onChange={(e) => setRewardTitle(e.target.value)}
                            className="w-full p-3 rounded-lg bg-[#222222] border border-gray-700 focus:outline-none focus:border-[#D4AF37] text-white"
                            required
                        />

                        <label className="block text-sm mb-1 mt-3">Reward Description</label>
                        <input
                            type="text"
                            placeholder="Optional description for users"
                            value={rewardDescription}
                            onChange={(e) => setRewardDescription(e.target.value)}
                            className="w-full p-3 rounded-lg bg-[#222222] border border-gray-700 focus:outline-none focus:border-[#D4AF37] text-white"
                        />

                        <label className="block text-sm mb-1 mt-3">Reward Value</label>
                        <input
                            type="number"
                            placeholder="E.g., 1"
                            value={rewardValue}
                            onChange={(e) => setRewardValue(Number(e.target.value))}
                            className="w-full p-3 rounded-lg bg-[#222222] border border-gray-700 focus:outline-none focus:border-[#D4AF37] text-white"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black hover:bg-[#b5a004]"
                        >
                            {loading ? "Saving…" : "Create Milestone"}
                        </button>
                        <button
                            onClick={() => {
                                setSelectedMilestone(m);
                                setShowForm(true);
                            }}
                            className="text-sm text-[#D4AF37] hover:underline"
                        >
                            Edit
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}
