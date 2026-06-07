export function resolveBookingFinancialState({ reward, totalPrice }) {
  const hasPrice =
    typeof totalPrice === "number" &&
    totalPrice > 0;

  const rewardValid =
    reward &&
    reward.status === "AVAILABLE" &&
    (!reward.expiresAt ||
      new Date(reward.expiresAt) > new Date());

  const fullCover =
    rewardValid &&
    reward.discountType === "FULL_COVER";

  if (fullCover) {
    return {
      isFree: true,
      freeReason: "reward",
    };
  }

  if (hasPrice) {
    return {
      isFree: false,
      freeReason: null,
    };
  }

  return {
    isFree: false,
    freeReason: null,
  };
}