import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function RewardsDrawer({
  isOpen,
  onClose,
  rewards,
  onSelectReward,
  selectedRewardId,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen && selectedRewardId && containerRef.current) {
      const el = containerRef.current.querySelector(
        `[data-id='${selectedRewardId}']`
      );
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isOpen, selectedRewardId]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100000] bg-black/70 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-[100001] flex items-center justify-center px-4">
        <div className="relative w-full max-w-lg max-h-[85vh]
          rounded-3xl overflow-hidden
          bg-gradient-to-br from-[#181818] via-[#0f0f0f] to-black
          border border-white/10
          shadow-[0_30px_80px_rgba(0,0,0,0.8)]
          animate-scaleIn
          flex flex-col"
        >
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none
            bg-[radial-gradient(circle_at_top,#B8860B22,transparent_60%)]"
          />

          {/* Header */}
          <div className="sticky top-0 z-10 px-6 py-5
            bg-black/60 backdrop-blur-xl
            border-b border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white tracking-wide">
                  🎁 Your Rewards
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Choose one reward per booking
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full
                  flex items-center justify-center
                  text-gray-400 hover:text-[#B8860B]
                  hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Rewards */}
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
          >
            {rewards.length === 0 ? (
              <div className="text-center text-gray-400 mt-24">
                No rewards yet 🎉
              </div>
            ) : (
              rewards.map((reward) => {
                const isQueued =
                  reward.type === "freeRide" && reward.isSlotFull;
                const isSelected = reward._id === selectedRewardId;

                return (
                  <div
                    key={reward._id}
                    data-id={reward._id}
                    onClick={() => !isQueued && onSelectReward(reward)}
                    className={`
                      relative rounded-2xl p-5 cursor-pointer transition-all
                      border backdrop-blur
                      ${
                        isQueued
                          ? "border-red-700/60 bg-red-900/20 cursor-not-allowed"
                          : isSelected
                          ? "border-[#B8860B] bg-[#B8860B]/15 shadow-[0_0_30px_#B8860B33]"
                          : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#B8860B]/60"
                      }
                    `}
                  >
                    {/* Badge */}
                    <span
                      className={`absolute top-4 right-4 px-3 py-1
                        rounded-full text-[10px] font-bold tracking-wider
                        ${
                          isQueued
                            ? "bg-red-600 text-white"
                            : isSelected
                            ? "bg-[#B8860B] text-black"
                            : "bg-white/10 text-gray-200"
                        }
                      `}
                    >
                      {isQueued
                        ? "QUEUED"
                        : isSelected
                        ? "SELECTED"
                        : "AVAILABLE"}
                    </span>

                    <h3 className="text-white font-semibold mb-1">
                      {reward.title}
                    </h3>

                    <p className="text-gray-400 text-sm leading-relaxed">
                      {reward.description}
                    </p>

                    {!isQueued && !isSelected && (
                      <p className="mt-3 text-xs text-[#B8860B]">
                        Tap to apply →
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 px-6 py-4
            bg-black/60 backdrop-blur-xl
            border-t border-white/10 flex justify-end"
          >
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full
                text-sm font-semibold
                bg-[#B8860B] text-black
                hover:bg-[#D4AF37] transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn .25s ease-out }
          .animate-scaleIn { animation: scaleIn .3s ease-out }
        `}
      </style>
    </>,
    document.getElementById("modal-root")
  );
}

export default RewardsDrawer;
