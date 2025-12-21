import React, { useEffect, useRef } from "react";

function RewardsDrawer({ isOpen, onClose, rewards, onSelectReward, selectedRewardId }) {
  const containerRef = useRef(null);

  // Scroll to selected reward when drawer opens
  useEffect(() => {
    if (isOpen && selectedRewardId && containerRef.current) {
      const el = containerRef.current.querySelector(`[data-id='${selectedRewardId}']`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isOpen, selectedRewardId]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#111111] z-50 transform transition-transform
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          shadow-lg overflow-y-auto`}
        ref={containerRef}
      >
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Your Rewards</h2>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:text-[#B8860B]"
          >
            &times;
          </button>
        </div>

        {/* Rewards List */}
        <div className="p-4 space-y-4">
          {rewards.length === 0 ? (
            <p className="text-gray-400">No rewards available.</p>
          ) : (
            rewards.map((reward) => {
              const isQueued = reward.type === "freeRide" && reward.isSlotFull;
              const isSelected = reward._id === selectedRewardId;

              return (
                <div
                  key={reward._id}
                  data-id={reward._id}
                  className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer
                    ${isQueued
                      ? "border-red-600 bg-[#2a1a1a] cursor-not-allowed"
                      : isSelected
                      ? "border-yellow-500 bg-[#3a2a1a]"
                      : "border-gray-700 bg-[#1a1a1a]"
                    }`}
                  onClick={() => !isQueued && onSelectReward(reward)}
                >
                  <div>
                    <p className="text-white font-semibold">{reward.title}</p>
                    <p className="text-gray-400 text-sm">{reward.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {reward.type === "freeRide" && (
                      <span
                        className={`px-2 py-1 rounded-full font-bold text-sm ${
                          isQueued
                            ? "bg-red-500 text-white"
                            : "bg-[#B8860B] text-black"
                        }`}
                      >
                        {isQueued ? "QUEUED" : isSelected ? "SELECTED" : "FREE"}
                      </span>
                    )}

                    {isQueued && (
                      <button
                        className="px-3 py-1 bg-[#B8860B] text-black rounded hover:bg-[#D4AF37] text-sm"
                        onClick={() => alert("Select another slot")}
                      >
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default RewardsDrawer;
