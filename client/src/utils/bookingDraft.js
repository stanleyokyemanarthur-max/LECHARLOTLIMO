const DRAFT_KEY = "lecharlotlimo.bookingDraft";
const DRAFT_VERSION = 1;
const DRAFT_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const TRIP_FIELDS = [
  "tripType",
  "pickupLocation",
  "dropoffLocation",
  "pickupIsAirport",
  "dropoffIsAirport",
  "flightNumber",
  "pickupDate",
  "returnDate",
  "returnFlightNumber",
  "passengers",
  "luggage",
  "distance",
  "durationMinutes",
  "durationText",
  "trafficMinutes",
  "trafficDurationText",
  "returnPickupLocation",
  "returnDropoffLocation",
  "returnPickupIsAirport",
  "returnDropoffIsAirport",
  "returnDistance",
  "returnDurationMinutes",
  "returnDurationText",
  "dropoffDate",
  "totalDistance",
  "trafficDelayPercent",
];

const validDate = (value) => {
  if (value == null || value === "") return null;
  const date =
    value instanceof Date
      ? value
      : typeof value?.toDate === "function"
        ? value.toDate()
        : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const finiteOrNull = (value) => {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const sanitizeTripData = (tripData) => {
  if (!tripData || typeof tripData !== "object" || Array.isArray(tripData)) {
    return null;
  }

  const sanitized = {};
  for (const field of TRIP_FIELDS) {
    if (!(field in tripData)) continue;
    const value = tripData[field];

    if (["pickupDate", "returnDate", "dropoffDate"].includes(field)) {
      const date = validDate(value);
      if (date === undefined) return null;
      sanitized[field] = date;
    } else if (
      [
        "distance",
        "durationMinutes",
        "trafficMinutes",
        "returnDistance",
        "returnDurationMinutes",
        "totalDistance",
        "trafficDelayPercent",
      ].includes(field)
    ) {
      const number = finiteOrNull(value);
      if (number === undefined) return null;
      sanitized[field] = number;
    } else if (
      [
        "pickupIsAirport",
        "dropoffIsAirport",
        "returnPickupIsAirport",
        "returnDropoffIsAirport",
      ].includes(field)
    ) {
      sanitized[field] = value === true;
    } else if (typeof value === "string") {
      sanitized[field] = value.slice(0, 500);
    } else if (typeof value === "number" && Number.isFinite(value)) {
      sanitized[field] = value;
    }
  }

  if (!["oneWay", "roundTrip"].includes(sanitized.tripType)) {
    sanitized.tripType = "oneWay";
  }
  return sanitized;
};

const sanitizeFarePreview = (estimate) => {
  if (!estimate || typeof estimate !== "object") return null;

  const numberOrNull = (value) => {
    if (value == null) return null;
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : null;
  };

  return {
    totalPrice: numberOrNull(estimate.totalPrice),
    outbound: {
      estimatedPrice: numberOrNull(estimate.outbound?.estimatedPrice),
      distanceMiles: numberOrNull(estimate.outbound?.distanceMiles),
      durationMinutes: numberOrNull(estimate.outbound?.durationMinutes),
    },
    return: {
      estimatedPrice: numberOrNull(estimate.return?.estimatedPrice),
      distanceMiles: numberOrNull(estimate.return?.distanceMiles),
      durationMinutes: numberOrNull(estimate.return?.durationMinutes),
    },
  };
};

export function saveBookingDraft({
  tripData,
  step = "reserve",
  selectedCarId = null,
  estimate = null,
}) {
  const sanitizedTrip = sanitizeTripData(tripData);
  if (!sanitizedTrip) {
    throw new Error("Booking details could not be saved.");
  }
  if (!["reserve", "select-car", "final-details"].includes(step)) {
    throw new Error("Invalid booking draft step.");
  }

  const draft = {
    version: DRAFT_VERSION,
    savedAt: Date.now(),
    step,
    tripData: sanitizedTrip,
    selectedCarId:
      typeof selectedCarId === "string" && selectedCarId.length <= 100
        ? selectedCarId
        : null,
    farePreview: sanitizeFarePreview(estimate),
  };

  globalThis.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  return draft;
}

export function clearBookingDraft() {
  globalThis.sessionStorage.removeItem(DRAFT_KEY);
}

export function loadBookingDraft() {
  const stored = globalThis.sessionStorage.getItem(DRAFT_KEY);
  if (!stored) return null;

  try {
    const draft = JSON.parse(stored);
    const age = Date.now() - draft?.savedAt;
    const tripData = sanitizeTripData(draft?.tripData);
    if (
      draft?.version !== DRAFT_VERSION ||
      !Number.isFinite(draft.savedAt) ||
      age < 0 ||
      age > DRAFT_MAX_AGE_MS ||
      !["reserve", "select-car", "final-details"].includes(draft.step) ||
      !tripData
    ) {
      clearBookingDraft();
      return null;
    }

    return {
      version: DRAFT_VERSION,
      savedAt: draft.savedAt,
      step: draft.step,
      tripData,
      selectedCarId:
        typeof draft.selectedCarId === "string" &&
        draft.selectedCarId.length <= 100
          ? draft.selectedCarId
          : null,
      farePreview: sanitizeFarePreview(draft.farePreview),
    };
  } catch {
    clearBookingDraft();
    return null;
  }
}

export function isBookingTripComplete(tripData) {
  if (
    !tripData ||
    typeof tripData.pickupLocation !== "string" ||
    !tripData.pickupLocation.trim() ||
    typeof tripData.dropoffLocation !== "string" ||
    !tripData.dropoffLocation.trim()
  ) {
    return false;
  }

  const pickupDate = new Date(tripData.pickupDate);
  const dropoffDate = new Date(tripData.dropoffDate);
  if (
    Number.isNaN(pickupDate.getTime()) ||
    Number.isNaN(dropoffDate.getTime()) ||
    pickupDate.getTime() < Date.now() + 60 * 60 * 1000 ||
    dropoffDate.getTime() <= pickupDate.getTime()
  ) {
    return false;
  }

  if (tripData.tripType === "roundTrip") {
    const returnDate = new Date(tripData.returnDate);
    if (
      Number.isNaN(returnDate.getTime()) ||
      returnDate.getTime() < pickupDate.getTime()
    ) {
      return false;
    }
  }
  return true;
}

export function findAvailableDraftVehicle(vehicles, selectedCarId) {
  if (!Array.isArray(vehicles) || typeof selectedCarId !== "string") {
    return null;
  }
  return (
    vehicles.find((vehicle) => String(vehicle?._id) === selectedCarId) || null
  );
}

export function getBookingResumePath(role) {
  if (role !== "customer") return null;
  const draft = loadBookingDraft();
  if (!draft) return "/";
  if (
    !isBookingTripComplete(draft.tripData) ||
    draft.step === "reserve"
  ) {
    return "/reserve";
  }
  return "/select-car";
}

export function getMapsLoadState(isLoaded, loadError) {
  if (loadError) return "error";
  return isLoaded ? "ready" : "loading";
}
