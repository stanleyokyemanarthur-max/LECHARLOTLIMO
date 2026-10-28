import assert from "node:assert/strict";
import test from "node:test";
import {
  clearBookingDraft,
  findAvailableDraftVehicle,
  getBookingResumePath,
  getMapsLoadState,
  isBookingTripComplete,
  loadBookingDraft,
  saveBookingDraft,
} from "./bookingDraft.js";

const storage = new Map();
globalThis.sessionStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
};

const validTrip = () => ({
  tripType: "oneWay",
  pickupLocation: "Airport",
  dropoffLocation: "Hotel",
  pickupDate: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
  dropoffDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
  distance: 18,
  passengers: "2",
});

test("booking drafts preserve trip and fare previews without storing extra fields", () => {
  clearBookingDraft();
  saveBookingDraft({
    tripData: { ...validTrip(), privateNote: "not allowlisted" },
    step: "final-details",
    selectedCarId: "car-123",
    estimate: {
      totalPrice: 125,
      outbound: { estimatedPrice: 125, distanceMiles: 18 },
    },
  });

  const draft = loadBookingDraft();
  assert.equal(draft.tripData.pickupLocation, "Airport");
  assert.equal(draft.selectedCarId, "car-123");
  assert.equal(draft.farePreview.totalPrice, 125);
  assert.equal("privateNote" in draft.tripData, false);
  clearBookingDraft();
});

test("invalid and stale drafts are rejected and cleared", () => {
  storage.set(
    "lecharlotlimo.bookingDraft",
    JSON.stringify({
      version: 1,
      savedAt: Date.now() - 25 * 60 * 60 * 1000,
      step: "reserve",
      tripData: validTrip(),
    }),
  );
  assert.equal(loadBookingDraft(), null);
  assert.equal(storage.has("lecharlotlimo.bookingDraft"), false);

  saveBookingDraft({ tripData: validTrip() });
  storage.set(
    "lecharlotlimo.bookingDraft",
    JSON.stringify({
      version: 1,
      savedAt: Date.now(),
      step: "final-details",
      tripData: { ...validTrip(), distance: "not-a-number" },
    }),
  );
  assert.equal(loadBookingDraft(), null);
});

test("resume destination respects authentication and incomplete or stale trips", () => {
  clearBookingDraft();
  assert.equal(getBookingResumePath("customer"), "/");
  assert.equal(getBookingResumePath("admin"), null);

  saveBookingDraft({ tripData: validTrip(), step: "final-details" });
  assert.equal(getBookingResumePath("customer"), "/select-car");

  saveBookingDraft({
    tripData: { ...validTrip(), pickupDate: new Date(Date.now() + 10_000) },
    step: "final-details",
  });
  assert.equal(getBookingResumePath("customer"), "/reserve");
  assert.equal(isBookingTripComplete(validTrip()), true);
});

test("booking drafts remain resumable until the customer explicitly discards them", () => {
  saveBookingDraft({ tripData: validTrip(), step: "select-car" });
  assert.equal(getBookingResumePath("customer"), "/select-car");
  assert.ok(loadBookingDraft());

  clearBookingDraft();
  assert.equal(loadBookingDraft(), null);
});

test("vehicle restoration only accepts a currently available matching vehicle", () => {
  const vehicles = [{ _id: "car-available" }];
  assert.equal(
    findAvailableDraftVehicle(vehicles, "car-available"),
    vehicles[0],
  );
  assert.equal(findAvailableDraftVehicle(vehicles, "car-stale"), null);
});

test("Maps loading, ready, and failure states are distinguishable", () => {
  assert.equal(getMapsLoadState(false, null), "loading");
  assert.equal(getMapsLoadState(true, null), "ready");
  assert.equal(getMapsLoadState(false, new Error("load failed")), "error");
});
