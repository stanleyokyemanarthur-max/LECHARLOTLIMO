// utils/getDistance.js
import axios from "axios";

export const getDistanceInMiles = async (pickup, dropoff) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${encodeURIComponent(
      pickup
    )}&destinations=${encodeURIComponent(dropoff)}&key=${apiKey}`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== "OK") {
      throw new Error("Google Maps API Error: " + data.status);
    }

    const element = data.rows[0].elements[0];
    if (element.status !== "OK") {
      throw new Error("No route found between locations");
    }

    // Distance in meters → convert to miles
    const distanceValue = element.distance.value; // meters
    const miles = distanceValue / 1609.34;

    return Math.round(miles * 100) / 100; // round to 2 decimals
  } catch (error) {
    console.error("Error fetching distance:", error.message);
    throw error;
  }
};
