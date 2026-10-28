import assert from "node:assert/strict";
import { once } from "node:events";
import { after, before, test } from "node:test";
import express from "express";
import mongoose from "mongoose";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "dummy-route-test-jwt-secret";
process.env.RESEND_API_KEY = "re_test_dummy_route_authorization";
process.env.STRIPE_SECRET_KEY = "sk_test_dummy_route_authorization";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_dummy_route_authorization";
process.env.PAYPAL_ENV = "sandbox";
process.env.PAYPAL_CLIENT_ID = "dummy_paypal_client";
process.env.PAYPAL_CLIENT_SECRET = "dummy_paypal_secret";

const [
  { default: bookingRoutes },
  { default: paymentRoutes },
  { default: paypalRoutes },
  { default: Booking },
  { default: User },
  { default: paypalClient },
] = await Promise.all([
  import("../routes/bookingRoutes.js"),
  import("../routes/paymentRoutes.js"),
  import("../routes/paypalRoutes.js"),
  import("../models/Booking.js"),
  import("../models/User.js"),
  import("../config/paypal.js"),
]);

let server;
let baseUrl;
let databaseOperations = 0;
let paypalOperations = 0;

const originalStartSession = mongoose.startSession;
const originalBookingFindOne = Booking.findOne;
const originalUserFindById = User.findById;
const originalPayPalExecute = paypalClient.execute;

mongoose.startSession = async () => {
  databaseOperations += 1;
  throw new Error("Database operation must not run for unauthenticated requests");
};
Booking.findOne = () => {
  databaseOperations += 1;
  throw new Error("Booking lookup must not run for a public cancellation return");
};
User.findById = () => {
  databaseOperations += 1;
  throw new Error("Database operation must not run for unauthenticated requests");
};
paypalClient.execute = async () => {
  paypalOperations += 1;
  throw new Error("PayPal operation must not run for unauthenticated requests");
};

before(async () => {
  const app = express();
  app.use(express.json());
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/paypal", paypalRoutes);

  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  mongoose.startSession = originalStartSession;
  Booking.findOne = originalBookingFindOne;
  User.findById = originalUserFindById;
  paypalClient.execute = originalPayPalExecute;
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

const assertUnauthenticatedRequestIsRejected = async (path) => {
  const databaseCallsBefore = databaseOperations;
  const paypalCallsBefore = paypalOperations;
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });

  assert.equal(response.status, 401, `${path} should require authentication`);
  assert.equal(databaseOperations, databaseCallsBefore);
  assert.equal(paypalOperations, paypalCallsBefore);
};

test("unauthenticated booking creation is rejected before database access", async () => {
  await assertUnauthenticatedRequestIsRejected("/api/bookings");
});

test("unauthenticated quote finalization is rejected before database access", async () => {
  await assertUnauthenticatedRequestIsRejected("/api/bookings/finalize-quote");
});

test("unauthenticated Stripe checkout is rejected before database access", async () => {
  await assertUnauthenticatedRequestIsRejected(
    "/api/payments/create-checkout-session",
  );
});

test("unauthenticated PayPal order creation is rejected before provider access", async () => {
  await assertUnauthenticatedRequestIsRejected("/api/paypal/create-order");
});

test("unauthenticated PayPal capture is rejected before provider access", async () => {
  await assertUnauthenticatedRequestIsRejected("/api/paypal/capture-order");
});

test("public Stripe cancellation returns do not mutate bookings for missing or arbitrary session IDs", async () => {
  const sessionIds = [null, "not-a-stripe-session", "cs_arbitrary_visitor_value"];

  for (const sessionId of sessionIds) {
    const databaseCallsBefore = databaseOperations;
    const paypalCallsBefore = paypalOperations;
    const path = sessionId
      ? `/api/payments/cancel?session_id=${encodeURIComponent(sessionId)}`
      : "/api/payments/cancel";
    const response = await fetch(`${baseUrl}${path}`);
    const data = await response.json();

    assert.equal(response.status, 200);
    assert.match(data.message, /verified payment events/);
    assert.equal(databaseOperations, databaseCallsBefore);
    assert.equal(paypalOperations, paypalCallsBefore);
  }
});
