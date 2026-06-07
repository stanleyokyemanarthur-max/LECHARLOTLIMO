import axios from "axios";
import { getDistanceInMiles } from "../utils/getDistance.js";

const BASE_MIN_FARE = 20;

/**
 * PREMIUM ESTIMATE ENGINE
 */
export const calculateTripEstimate = async ({
  pickup,
  dropoff,
  carRatePerMile,
  car,
  fixedDistance, // optional pre-calculated distance (for better performance)
}) => {
  let distanceMiles = 0;
  let durationText = "";
  let trafficDurationText = "";
  let durationMinutes = 0;
  let trafficMinutes = 0;

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/distancematrix/json",
      {
        params: {
          origins: pickup,
          destinations: dropoff,
          key: process.env.GOOGLE_MAPS_API_KEY,
          units: "imperial",
          mode: "driving",
          departure_time: "now", // 🚨 required for traffic data
          traffic_model: "best_guess",
        },
        timeout: 5000,
      }
    );
    console.log("Google Distance Matrix Response:");
    console.log(JSON.stringify(response.data, null, 2));
    const element = response.data?.rows?.[0]?.elements?.[0];
    console.log(JSON.stringify(element, null, 2));

    if (element?.status === "OK") {
      // ======================
      // Distance
      // ======================
      if (fixedDistance) {
        distanceMiles = Number(fixedDistance);
      } else {
        const distanceText = element.distance?.text || "0 mi";
        distanceMiles =
          parseFloat(distanceText.replace(/[^0-9.]/g, "")) || 0;
      }

      // ======================
      // Duration (normal)
      // ======================
      durationText = element.duration?.text || "";
      durationMinutes = element.duration?.value
        ? Math.round(element.duration.value / 60)
        : 0;

      // ======================
      // Duration (traffic)
      // ======================
      trafficDurationText =
        element.duration_in_traffic?.text || durationText;


      trafficMinutes = element.duration_in_traffic?.value
        ? Math.round(element.duration_in_traffic.value / 60)
        : durationMinutes;
    } else {
      throw new Error("GOOGLE_DISTANCE_FAILED");
    }
  } catch (err) {
    // ======================
    // FALLBACK (no Google reliance)
    // ======================
    distanceMiles = await getDistanceInMiles(pickup, dropoff);

    // rough fallback assumption: 35 mph average
    durationMinutes = Math.round((distanceMiles / 35) * 60);
    trafficMinutes = durationMinutes;

    durationText = `${durationMinutes} mins`;
    trafficDurationText = `${trafficMinutes} mins`;
  }

  // ======================
  // PRICING ENGINE (BASE SAFE VERSION)
  // ======================

  const multiplier = Number(car?.rateMultiplier);

  const safeMultiplier = Number.isFinite(multiplier) && multiplier > 0
    ? multiplier
    : 1;

  const distance = Number(distanceMiles);
  const rate = Number(carRatePerMile);

  if (distance < 0) {
    throw new Error("Invalid distance calculated");
  }

  if (!Number.isFinite(distance) || !Number.isFinite(rate)) {
    throw new Error("Invalid pricing inputs");
  }

  // BASE PRICE
  const basePrice = Math.max(
    distance * rate * safeMultiplier,
    BASE_MIN_FARE
  );

  // TRAFFIC MULTIPLIER
  const trafficMultiplier =
    durationMinutes > 0 &&
      trafficMinutes > durationMinutes
      ? 1 +
      ((trafficMinutes - durationMinutes) / durationMinutes) * 0.25
      : 1;

  // FINAL PRICE
  const estimatedPrice = Number(
    (basePrice * trafficMultiplier).toFixed(2)
  );

  // TRAFFIC %
  const trafficDelayPercent =
    durationMinutes > 0
      ? Math.round(
        ((trafficMinutes - durationMinutes) / durationMinutes) * 100
      )
      : 0;

  // FINAL RETURN (ONLY ONCE)
  return {
    distanceMiles: Number(distance.toFixed(2)),

    durationText,
    trafficDurationText,
    trafficDelayPercent,

    durationMinutes,
    trafficMinutes,

    basePrice: Number(basePrice.toFixed(2)),
    estimatedPrice,
  };
};