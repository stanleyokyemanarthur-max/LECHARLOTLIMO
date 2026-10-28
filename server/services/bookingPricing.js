import { calculateTripEstimate } from "./pricingEngine.js";

const invalidTrip = (message) =>
  Object.assign(new Error(message), { statusCode: 400 });

export const calculateBookingPricing = async ({
  pickup,
  dropoff,
  tripType = "oneWay",
  returnTrip,
  carData,
  estimateTrip = calculateTripEstimate,
}) => {
  if (!["oneWay", "roundTrip"].includes(tripType)) {
    throw invalidTrip("Invalid trip type");
  }

  if (
    typeof pickup !== "string" ||
    !pickup.trim() ||
    typeof dropoff !== "string" ||
    !dropoff.trim()
  ) {
    throw invalidTrip("Pickup and dropoff locations are required");
  }

  if (
    tripType === "roundTrip" &&
    (typeof returnTrip?.pickupLocation !== "string" ||
      !returnTrip.pickupLocation.trim() ||
      typeof returnTrip?.dropoffLocation !== "string" ||
      !returnTrip.dropoffLocation.trim())
  ) {
    throw invalidTrip("Return pickup and dropoff locations are required");
  }

  const outboundEstimate = await estimateTrip({
    pickup,
    dropoff,
    carRatePerMile: carData.perMileRate,
    car: carData,
  });
  const returnEstimate =
    tripType === "roundTrip"
      ? await estimateTrip({
          pickup: returnTrip.pickupLocation,
          dropoff: returnTrip.dropoffLocation,
          carRatePerMile: carData.perMileRate,
          car: carData,
        })
      : null;

  const outboundFare = Number(outboundEstimate.estimatedPrice);
  const returnFare = Number(returnEstimate?.estimatedPrice || 0);
  const outboundDistance = Number(outboundEstimate.distanceMiles);
  const returnDistance = Number(returnEstimate?.distanceMiles || 0);

  if (
    !Number.isFinite(outboundFare) ||
    outboundFare <= 0 ||
    !Number.isFinite(returnFare) ||
    (tripType === "roundTrip" && returnFare <= 0) ||
    !Number.isFinite(outboundDistance) ||
    outboundDistance < 0 ||
    !Number.isFinite(returnDistance) ||
    returnDistance < 0
  ) {
    throw new Error("Unable to calculate a valid booking quote");
  }

  const totalPrice = Number((outboundFare + returnFare).toFixed(2));
  if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
    throw new Error("Unable to calculate a valid booking quote");
  }

  return {
    tripType,
    outboundEstimate,
    returnEstimate,
    outboundFare,
    returnFare,
    outboundDistance,
    returnDistance,
    totalDistance: Number((outboundDistance + returnDistance).toFixed(2)),
    totalPrice,
  };
};
