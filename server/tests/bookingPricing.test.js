import assert from "node:assert/strict";
import test from "node:test";
import axios from "axios";
import { calculateBookingPricing } from "../services/bookingPricing.js";
import { calculateTripEstimate } from "../services/pricingEngine.js";

const carData = {
  perMileRate: 3,
  rateMultiplier: 1.5,
};

test("prices a one-way booking from server-estimated route details", async () => {
  const estimateCalls = [];
  const quote = await calculateBookingPricing({
    pickup: "Pickup",
    dropoff: "Dropoff",
    carData,
    estimateTrip: async (route) => {
      estimateCalls.push(route);
      return {
        distanceMiles: 10,
        estimatedPrice: 45,
      };
    },
  });

  assert.equal(quote.totalPrice, 45);
  assert.equal(quote.outboundFare, 45);
  assert.equal(quote.outboundDistance, 10);
  assert.equal(quote.returnFare, 0);
  assert.equal(quote.returnDistance, 0);
  assert.equal(estimateCalls.length, 1);
  assert.deepEqual(estimateCalls[0], {
    pickup: "Pickup",
    dropoff: "Dropoff",
    carRatePerMile: 3,
    car: carData,
  });
});

test("ignores client-provided fares and distances for a round-trip quote", async () => {
  const estimateCalls = [];
  const clientPayload = {
    pickup: "Pickup",
    dropoff: "Dropoff",
    tripType: "roundTrip",
    returnTrip: {
      pickupLocation: "Return pickup",
      dropoffLocation: "Return dropoff",
    },
    pricing: {
      outboundFare: 0.01,
      returnFare: 0.01,
      outboundDistance: 0.01,
      returnDistance: 0.01,
    },
    distance: 0.01,
    returnDistance: 0.01,
  };

  const quote = await calculateBookingPricing({
    ...clientPayload,
    carData,
    estimateTrip: async (route) => {
      estimateCalls.push(route);
      return estimateCalls.length === 1
        ? { distanceMiles: 10, estimatedPrice: 45 }
        : { distanceMiles: 20, estimatedPrice: 90 };
    },
  });

  assert.deepEqual(
    estimateCalls.map(({ pickup, dropoff }) => [pickup, dropoff]),
    [
      ["Pickup", "Dropoff"],
      ["Return pickup", "Return dropoff"],
    ]
  );
  assert.equal(quote.outboundDistance, 10);
  assert.equal(quote.returnDistance, 20);
  assert.equal(quote.totalDistance, 30);
  assert.equal(quote.outboundFare, 45);
  assert.equal(quote.returnFare, 90);
  assert.equal(quote.totalPrice, 135);
});

test("rejects incomplete return routes instead of silently pricing one leg", async () => {
  await assert.rejects(
    calculateBookingPricing({
      pickup: "Pickup",
      dropoff: "Dropoff",
      tripType: "roundTrip",
      returnTrip: { pickupLocation: "Return pickup" },
      carData,
      estimateTrip: async () => {
        throw new Error("estimate should not run");
      },
    }),
    {
      statusCode: 400,
      message: "Return pickup and dropoff locations are required",
    }
  );
});

test("rejects missing or invalid server route pricing", async () => {
  await assert.rejects(
    calculateBookingPricing({
      pickup: "Pickup",
      dropoff: "Dropoff",
      carData,
      estimateTrip: async () => {
        throw new Error("route service unavailable");
      },
    }),
    /route service unavailable/
  );

  await assert.rejects(
    calculateBookingPricing({
      pickup: "Pickup",
      dropoff: "Dropoff",
      carData,
      estimateTrip: async () => ({
        distanceMiles: Number.NaN,
        estimatedPrice: Number.NaN,
      }),
    }),
    /Unable to calculate a valid booking quote/
  );
});

test("pricing engine ignores supplied distances and applies stored car rates", async () => {
  const previousGet = axios.get;
  axios.get = async () => ({
    data: {
      rows: [
        {
          elements: [
            {
              status: "OK",
              distance: { text: "10 mi" },
              duration: { value: 1200, text: "20 mins" },
              duration_in_traffic: { value: 1200, text: "20 mins" },
            },
          ],
        },
      ],
    },
  });

  try {
    const estimate = await calculateTripEstimate({
      pickup: "Pickup",
      dropoff: "Dropoff",
      carRatePerMile: 3,
      car: carData,
      fixedDistance: 0.01,
    });

    assert.equal(estimate.distanceMiles, 10);
    assert.equal(estimate.basePrice, 45);
    assert.equal(estimate.estimatedPrice, 45);
  } finally {
    axios.get = previousGet;
  }
});

test("a valid zero-mile route retains the existing minimum fare", async () => {
  const previousGet = axios.get;
  axios.get = async () => ({
    data: {
      rows: [
        {
          elements: [
            {
              status: "OK",
              distance: { text: "0 mi" },
              duration: { value: 0, text: "0 mins" },
              duration_in_traffic: { value: 0, text: "0 mins" },
            },
          ],
        },
      ],
    },
  });

  try {
    const estimate = await calculateTripEstimate({
      pickup: "Pickup",
      dropoff: "Dropoff",
      carRatePerMile: 3,
      car: carData,
    });

    assert.equal(estimate.distanceMiles, 0);
    assert.equal(estimate.estimatedPrice, 20);
  } finally {
    axios.get = previousGet;
  }
});
