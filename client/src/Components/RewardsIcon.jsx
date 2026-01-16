import React, { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRewards } from "../slices/rewardsSlice";
import RewardsDrawer from "./RewardsDrawer";

function RewardsIcon() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const rewards = useSelector((state) => state.rewards.items) || [];

  // Only show rewards that are AVAILABLE and not full
  const availableRewards = rewards.filter(
    (r) => r.status === "AVAILABLE" && !r.isSlotFull
  );

  const rewardsCount = availableRewards.length;

  // Fetch rewards on mount and if user logs in
  useEffect(() => {
    dispatch(fetchRewards());
  }, [dispatch]);

  // DEBUG: log Redux rewards
  useEffect(() => {
    console.log("All rewards from Redux:", rewards);
    console.log("Available rewards for badge:", availableRewards);
  }, [rewards, availableRewards]);

  if (rewardsCount === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center justify-center w-10 h-10 ml-2"
        aria-label={`You have ${rewardsCount} rewards`}
      >
        <Gift size={28} className="text-[#D4AF37]" />
        <span
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full
            bg-[#D4AF37] text-black text-[17px] font-bold flex items-center justify-center"
        >
          {rewardsCount > 3 ? "3+" : rewardsCount}
        </span>
      </button>

      <RewardsDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        rewards={availableRewards}
      />
    </>
  );
}

export default RewardsIcon;
