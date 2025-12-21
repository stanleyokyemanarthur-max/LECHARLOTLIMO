import React, { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRewards } from "../slices/rewardsSlice";
import RewardsDrawer from "./RewardsDrawer";

function RewardsIcon() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const rewards = useSelector((state) => state.rewards.items);
  const safeRewards = Array.isArray(rewards) ? rewards : [];


  // ONLY rewards that can be used now
  const availableRewards = safeRewards.filter(
    (r) => r.status === "AVAILABLE" && !r.isSlotFull
  );

  const rewardsCount = availableRewards.length;



  if (rewardsCount === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center justify-center w-10 h-10 ml-2"
      >
        <Gift size={28} className="text-[#B8860B]" />

        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full
          bg-[#B8860B] text-black text-[11px] font-bold flex items-center justify-center">
          {rewardsCount > 3 ? "3+" : rewardsCount}
        </span>
      </button>

      <RewardsDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        rewards={rewards}
      />
    </>
  );
}

export default RewardsIcon;
