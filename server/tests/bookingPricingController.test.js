import assert from "node:assert/strict";
import test from "node:test";
import axios from "axios";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

process.env.RESEND_API_KEY = "re_test_phase1";

const { createBooking, estimateBooking } = await import(
  "../controllers/bookingController.js"
);

function mockMapDistance() {
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
  return () => {
    axios.get = previousGet;
  };
}

function mockCarLookup() {
  const previousFindById = Car.findById;
  Car.findById = async () => ({
    _id: "507f1f77bcf86cd799439011",
    name: "Test Vehicle",
    type: "Luxury",
    perMileRate: 3,
    rateMultiplier: 1.5,
    totalUnits: 1,
    fleetKey: "test-fleet",
  });
  return () => {
    Car.findById = previousFindById;
  };
}

function makeResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test("booking creation persists a server quote, not submitted fare or distance", async () => {
  const restoreMap = mockMapDistance();
  const restoreCar = mockCarLookup();
  const previousStartSession = mongoose.startSession;
  const previousFindOne = Booking.findOne;
  const previousCountDocuments = Booking.countDocuments;
  const previousCreate = Booking.create;
  const bookingData = [];
  const session = {
    withTransaction: async (callback) => callback(),
    endSession() {},
  };

  mongoose.startSession = async () => session;
  Booking.findOne = async () => null;
  Booking.countDocuments = () => ({
    session: async () => 0,
  });
  Booking.create = async ([booking]) => {
    bookingData.push(booking);
    return [booking];
  };

  try {
    const response = makeResponse();
    await createBooking(
      {
        user: { _id: "507f1f77bcf86cd799439012" },
        body: {
          car: "507f1f77bcf86cd799439011",
          pickupLocation: "Pickup",
          dropoffLocation: "Dropoff",
          pickupDate: "2027-01-01T10:00:00.000Z",
          dropoffDate: "2027-01-01T11:00:00.000Z",
          tripType: "oneWay",
          pricing: {
            outboundFare: 0.01,
            returnFare: 0,
            outboundDistance: 0.01,
          },
          distance: 0.01,
        },
      },
      response
    );

    assert.equal(response.statusCode, 201);
    assert.equal(bookingData.length, 1);
    assert.equal(bookingData[0].pricing.outboundFare, 45);
    assert.equal(bookingData[0].pricing.outboundDistance, 10);
    assert.equal(bookingData[0].totalPrice, 45);
    assert.equal(bookingData[0].paymentStatus, "awaiting_payment");
    assert.equal(bookingData[0].isPaid, false);
  } finally {
    restoreMap();
    restoreCar();
    mongoose.startSession = previousStartSession;
    Booking.findOne = previousFindOne;
    Booking.countDocuments = previousCountDocuments;
    Booking.create = previousCreate;
  }
});

test("estimate endpoint ignores a client-supplied distance", async () => {
  const restoreMap = mockMapDistance();
  const restoreCar = mockCarLookup();

  try {
    const response = makeResponse();
    await estimateBooking(
      {
        body: {
          pickup: "Pickup",
          dropoff: "Dropoff",
          carId: "507f1f77bcf86cd799439011",
          distance: 0.01,
          tripType: "oneWay",
        },
      },
      response
    );

    assert.equal(response.statusCode, 200);
    assert.equal(response.body.outbound.distanceMiles, 10);
    assert.equal(response.body.totalPrice, 45);
  } finally {
    restoreMap();
    restoreCar();
  }
});
