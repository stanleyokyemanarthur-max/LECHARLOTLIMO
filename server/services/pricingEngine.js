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
  fixedDistance,
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
          departure_time: "now",
          traffic_model: "best_guess",
        },
        timeout: 5000,
      }
    );

    const element = response.data?.rows?.[0]?.elements?.[0];

    if (element?.status === "OK") {
      distanceMiles = fixedDistance
        ? Number(fixedDistance)
        : parseFloat((element.distance?.text || "0").replace(/[^0-9.]/g, "")) || 0;

      durationMinutes = element.duration?.value
        ? Math.round(element.duration.value / 60)
        : 0;

      trafficMinutes = element.duration_in_traffic?.value
        ? Math.round(element.duration_in_traffic.value / 60)
        : durationMinutes;

      durationText = element.duration?.text || "";
      trafficDurationText = element.duration_in_traffic?.text || durationText;
    } else {
      throw new Error("GOOGLE_DISTANCE_FAILED");
    }

  } catch (err) {
    distanceMiles = await getDistanceInMiles(pickup, dropoff);

    durationMinutes = Math.round((distanceMiles / 35) * 60);
    trafficMinutes = durationMinutes;

    durationText = `${durationMinutes} mins`;
    trafficDurationText = `${trafficMinutes} mins`;
  }

  const multiplier = Number(car?.rateMultiplier || 1);
  const rate = Number(carRatePerMile);

  if (!Number.isFinite(distanceMiles) || !Number.isFinite(rate) || rate <= 0) {
    throw new Error("Invalid pricing inputs");
  }

  const basePrice = Math.max(distanceMiles * rate * multiplier, 20);

  const trafficMultiplier =
    trafficMinutes > durationMinutes
      ? 1 + ((trafficMinutes - durationMinutes) / durationMinutes) * 0.25
      : 1;

  const estimatedPrice = Number((basePrice * trafficMultiplier).toFixed(2));

  const trafficDelayPercent =
    durationMinutes > 0
      ? Math.round(((trafficMinutes - durationMinutes) / durationMinutes) * 100)
      : 0;

  return {
    distanceMiles: Number(distanceMiles.toFixed(2)),
    durationText,
    trafficDurationText,
    durationMinutes,
    trafficMinutes,
    trafficDelayPercent,
    basePrice: Number(basePrice.toFixed(2)),
    estimatedPrice,
  };
};