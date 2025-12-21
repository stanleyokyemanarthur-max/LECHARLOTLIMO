import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RewardsDrawer from "../components/RewardsDrawer";
import { lockUserReward, fetchRewards } from "../features/rewards/rewardsSlice";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const rewards = useSelector(state => state.rewards.items);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);

  // Initial load of rewards
  useEffect(() => {
    dispatch(fetchRewards());
  }, [dispatch]);

  // Auto-refresh rewards while drawer is open (poll every 10s)
  useEffect(() => {
    if (!isRewardsOpen) return;

    const interval = setInterval(() => {
      dispatch(fetchRewards());
    }, 10000);

    return () => clearInterval(interval);
  }, [isRewardsOpen, dispatch]);

  const handleRewardSelect = async (reward) => {
    try {
      await dispatch(lockUserReward(reward._id)).unwrap();
      setSelectedReward(reward);
      setIsRewardsOpen(false);
    } catch {
      alert("Reward unavailable");
    }
  };

  // ✅ Call this after booking is completed (Stripe webhook or client confirmation)
  const handleBookingCompleted = () => {
    // Refresh rewards immediately
    dispatch(fetchRewards());
  };

  return (
    <>
      <button onClick={() => setIsRewardsOpen(true)}>Select Reward</button>

      <RewardsDrawer
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
        rewards={rewards}
        onSelectReward={handleRewardSelect}
        selectedRewardId={selectedReward?._id}
      />

      {/* Example usage: after booking is confirmed */}
      <button onClick={handleBookingCompleted}>Simulate Booking Completion</button>
    </>
  );
};

export default CheckoutPage;
 