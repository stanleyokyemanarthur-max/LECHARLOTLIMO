export function resolveBookingFinancialState({ reward, totalPrice }) {
  const hasPrice = typeof totalPrice === "number" && totalPrice > 0;

  const rewardValid =
    reward &&
    reward.status === "AVAILABLE" &&
    (!reward.expiresAt || new Date(reward.expiresAt) > new Date());

  const fullCover = rewardValid && reward.discountType === "FULL_COVER";

  if (!hasPrice && fullCover) {
    return {
      isFree: true,
      freeReason: "reward",
    };
  }

  if (!hasPrice && !fullCover) {
    return {
      isFree: true,
      freeReason: "admin",
    };
  }

  return {
    isFree: false,
    freeReason: null,
  };
}