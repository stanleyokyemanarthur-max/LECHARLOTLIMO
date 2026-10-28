import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";
import express from "express";
import Stripe from "stripe";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Reward from "../models/Reward.js";

process.env.NODE_ENV = "test";
process.env.RESEND_API_KEY = "re_test_phase1";
process.env.STRIPE_SECRET_KEY = "sk_test_phase1";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_phase1_tests";
process.env.PAYPAL_CLIENT_ID = "paypal_test_client";
process.env.PAYPAL_CLIENT_SECRET = "paypal_test_secret";
process.env.ADMIN_EMAIL = "";
process.env.CLIENT_URL = "http://localhost:5173";

const [
  { confirmPayment, finalizeBookingQuote },
  { createCheckoutSession },
  { default: stripeWebhook },
  { default: paypalClient },
  { capturePayPalOrder },
] = await Promise.all([
  import("../controllers/bookingController.js"),
  import("../controllers/paymentController.js"),
  import("../routes/paymentWebhook.js"),
  import("../config/paypal.js"),
  import("../controllers/paypalController.js"),
]);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function makeBooking(overrides = {}) {
  return {
    _id: "booking-phase1",
    totalPrice: 125,
    paymentStatus: "awaiting_payment",
    status: "pending",
    isPaid: false,
    stripeSessionId: "cs_evt_phase1_success",
    paypalOrderId: "paypal-test-order",
    reward: null,
    user: "customer-phase1",
    save: async function save() {},
    ...overrides,
  };
}

async function sendStripeEvent(event, signingSecret = process.env.STRIPE_WEBHOOK_SECRET) {
  const app = express();
  app.use(express.raw({ type: "application/json" }), stripeWebhook);
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");

  try {
    const payload = JSON.stringify(event);
    const signature = stripe.webhooks.generateTestHeaderString({
      payload,
      secret: signingSecret,
    });
    return await fetch(`http://127.0.0.1:${server.address().port}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Stripe-Signature": signature,
      },
      body: payload,
    });
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

function makeStripeEvent(type, id, overrides = {}) {
  const sessionId = `cs_${id}`;
  return {
    id,
    object: "event",
    api_version: "2025-09-30.clover",
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    pending_webhooks: 1,
    request: null,
    type,
    data: {
      object: {
        id: sessionId,
        object: "checkout.session",
        metadata: { bookingId: "booking-phase1" },
        client_reference_id: "booking-phase1",
        mode: "payment",
        payment_status: "paid",
        currency: "usd",
        amount_total: 12500,
        ...overrides,
      },
    },
  };
}

async function withBookingLookup(booking, callback) {
  const previousFindById = Booking.findById;
  const previousFindOneAndUpdate = Booking.findOneAndUpdate;
  Booking.findById = () => {
    const query = {
      populate() {
        return this;
      },
      then(resolve, reject) {
        return Promise.resolve(booking).then(resolve, reject);
      },
    };
    return query;
  };
  Booking.findOneAndUpdate = (filter, update) => {
    if (booking.paymentUpdateCalls !== undefined) {
      booking.paymentUpdateCalls += 1;
    }
    const sessionMatches = filter.stripeSessionId === booking.stripeSessionId;
    const paymentStatusMatches =
      filter.paymentStatus?.$ne === "paid"
        ? booking.paymentStatus !== "paid"
        : filter.paymentStatus?.$nin
          ? !filter.paymentStatus.$nin.includes(booking.paymentStatus)
          : true;
    const bookingStatusMatches = filter.status?.$ne !== "expired" ||
      booking.status !== "expired";
    const updated =
      sessionMatches && paymentStatusMatches && bookingStatusMatches;

    if (updated) {
      Object.assign(booking, update.$set);
    }

    const query = {
      populate() {
        return this;
      },
      then(resolve, reject) {
        return Promise.resolve(updated ? booking : null).then(resolve, reject);
      },
    };
    return query;
  };

  try {
    return await callback();
  } finally {
    Booking.findById = previousFindById;
    Booking.findOneAndUpdate = previousFindOneAndUpdate;
  }
}

async function withPayPalMocks(booking, execute, callback) {
  const previousFindById = Booking.findById;
  const previousFindOneAndUpdate = Booking.findOneAndUpdate;
  const previousUpdateOne = Booking.updateOne;
  const previousStartSession = mongoose.startSession;
  const previousExecute = paypalClient.execute;
  let executeCalls = 0;
  const session = {
    withTransaction: async (operation) => operation(),
    endSession() {},
  };
  Booking.findById = () => {
    const query = {
      populate() {
        return this;
      },
      session() {
        return this;
      },
      then(resolve, reject) {
        return Promise.resolve(booking).then(resolve, reject);
      },
    };
    return query;
  };
  Booking.findOneAndUpdate = async (filter, update) => {
    const matchesBooking =
      filter._id === booking._id &&
      filter.paypalOrderId === booking.paypalOrderId &&
      (filter.paymentStatus?.$ne !== "paid" ||
        booking.paymentStatus !== "paid") &&
      (filter.paypalCaptureAttemptId !== null ||
        booking.paypalCaptureAttemptId == null);
    if (!filter.$or) {
      if (!matchesBooking) {
        return null;
      }
      Object.assign(booking, update.$set);
      return booking;
    }

    const staleBefore = filter.$or?.[2]?.paypalCaptureStartedAt?.$lte;
    const lockIsAvailable =
      booking.paypalCaptureAttemptId == null ||
      (staleBefore &&
        booking.paypalCaptureStartedAt &&
        booking.paypalCaptureStartedAt <= staleBefore);

    if (!matchesBooking || !lockIsAvailable) {
      return null;
    }

    Object.assign(booking, update.$set);
    return booking;
  };
  Booking.updateOne = async (filter, update) => {
    if (
      filter._id === booking._id &&
      filter.paypalCaptureAttemptId === booking.paypalCaptureAttemptId
    ) {
      Object.assign(booking, update.$set);
    }
    return { acknowledged: true };
  };
  mongoose.startSession = async () => session;
  paypalClient.execute = async (request) => {
    executeCalls += 1;
    return execute(request);
  };

  try {
    return await callback(() => executeCalls);
  } finally {
    Booking.findById = previousFindById;
    Booking.findOneAndUpdate = previousFindOneAndUpdate;
    Booking.updateOne = previousUpdateOne;
    mongoose.startSession = previousStartSession;
    paypalClient.execute = previousExecute;
  }
}

function makePayPalCapture(overrides = {}) {
  return {
    result: {
      id: "paypal-test-order",
      status: "COMPLETED",
      purchase_units: [
        {
          reference_id: "booking-phase1",
          amount: { currency_code: "USD", value: "125.00" },
          payments: {
            captures: [
              {
                status: "COMPLETED",
                amount: { currency_code: "USD", value: "125.00" },
              },
            ],
          },
        },
      ],
      ...overrides,
    },
  };
}

function makePayPalOrder(overrides = {}) {
  return {
    result: {
      id: "paypal-test-order",
      status: "APPROVED",
      purchase_units: [
        {
          reference_id: "booking-phase1",
          amount: { currency_code: "USD", value: "125.00" },
        },
      ],
      ...overrides,
    },
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

const authenticatedRequest = (booking, body) => ({
  body,
  user: { _id: booking.user },
});

test("legacy payment confirmation rejects requests without provider evidence", async () => {
  const previousFindById = Booking.findById;
  Booking.findById = () => {
    throw new Error("legacy confirmation must not fetch or mutate a booking");
  };

  try {
    const response = makeResponse();
    await confirmPayment({ params: { id: "booking-phase1" } }, response);

    assert.equal(response.statusCode, 410);
    assert.match(response.body.error, /verified payment-provider evidence/);
  } finally {
    Booking.findById = previousFindById;
  }
});

test("finalizing a quote is restricted to the booking owner", async () => {
  const booking = makeBooking({ user: "booking-owner" });
  const previousFindById = Booking.findById;
  let saved = false;
  booking.save = async () => { saved = true; };
  Booking.findById = async () => booking;

  try {
    const response = makeResponse();
    await finalizeBookingQuote(
      { body: { bookingId: booking._id }, user: { _id: "another-customer" } },
      response,
    );
    assert.equal(response.statusCode, 403);
    assert.equal(saved, false);
  } finally {
    Booking.findById = previousFindById;
  }
});

test("Stripe Checkout charges the trusted booking total in USD and stores its session ID", async () => {
  const booking = makeBooking({ stripeSessionId: null });
  const previousFindById = Booking.findById;
  const previousStartSession = mongoose.startSession;
  const sessionsPrototype = Object.getPrototypeOf(stripe.checkout.sessions);
  const previousCreate = sessionsPrototype.create;
  let checkoutParameters;
  let checkoutOptions;
  const mongoSession = {
    withTransaction: async (operation) => operation(),
    endSession() {},
  };
  Booking.findById = () => ({
    populate() {
      return this;
    },
    session() {
      return Promise.resolve(booking);
    },
  });
  mongoose.startSession = async () => mongoSession;
  sessionsPrototype.create = async function create(parameters, options) {
    checkoutParameters = parameters;
    checkoutOptions = options;
    return { id: "cs_created_for_booking", url: "https://checkout.test" };
  };

  try {
    const response = makeResponse();
    await createCheckoutSession(
      authenticatedRequest(booking, { bookingId: booking._id, amount: 0.01 }),
      response
    );
    assert.equal(response.statusCode, 200);
    assert.equal(checkoutParameters.line_items[0].price_data.currency, "usd");
    assert.equal(checkoutParameters.line_items[0].price_data.unit_amount, 12500);
    assert.equal(checkoutParameters.metadata.bookingId, booking._id);
    assert.equal(checkoutParameters.client_reference_id, booking._id);
    assert.equal(
      checkoutOptions.idempotencyKey,
      `booking-${booking._id}-session-initial`
    );
    assert.equal(booking.stripeSessionId, "cs_created_for_booking");
  } finally {
    Booking.findById = previousFindById;
    mongoose.startSession = previousStartSession;
    sessionsPrototype.create = previousCreate;
  }
});

test("Stripe Checkout rejects a booking owned by another customer", async () => {
  const booking = makeBooking({ user: "booking-owner", stripeSessionId: null });
  const previousFindById = Booking.findById;
  const previousStartSession = mongoose.startSession;
  const mongoSession = {
    withTransaction: async (operation) => operation(),
    endSession() {},
  };
  Booking.findById = () => ({
    populate() {
      return this;
    },
    session() {
      return Promise.resolve(booking);
    },
  });
  mongoose.startSession = async () => mongoSession;

  try {
    const response = makeResponse();
    await createCheckoutSession(
      {
        body: { bookingId: booking._id },
        user: { _id: "another-customer" },
      },
      response,
    );
    assert.equal(response.statusCode, 403);
    assert.equal(booking.paymentStatus, "awaiting_payment");
    assert.equal(booking.stripeSessionId, null);
  } finally {
    Booking.findById = previousFindById;
    mongoose.startSession = previousStartSession;
  }
});

test("concurrent Stripe Checkout requests share an idempotent session attempt", async () => {
  const booking = makeBooking({ stripeSessionId: null });
  const previousFindById = Booking.findById;
  const previousStartSession = mongoose.startSession;
  const sessionsPrototype = Object.getPrototypeOf(stripe.checkout.sessions);
  const previousCreate = sessionsPrototype.create;
  const mongoSession = {
    withTransaction: async (operation) => operation(),
    endSession() {},
  };
  const checkoutCalls = [];
  let resolveCheckout;
  const checkoutResult = new Promise((resolve) => {
    resolveCheckout = resolve;
  });
  Booking.findById = () => ({
    populate() {
      return this;
    },
    session() {
      return Promise.resolve(booking);
    },
  });
  mongoose.startSession = async () => mongoSession;
  sessionsPrototype.create = async function create(parameters, options) {
    checkoutCalls.push({ parameters, options });
    if (checkoutCalls.length === 2) {
      resolveCheckout({
        id: "cs_shared_for_booking",
        url: "https://checkout.test/shared",
      });
    }
    return checkoutResult;
  };

  try {
    const responses = [makeResponse(), makeResponse()];
    await Promise.all(
      responses.map((response) =>
        createCheckoutSession(
          authenticatedRequest(booking, { bookingId: booking._id }),
          response
        )
      )
    );

    assert.equal(checkoutCalls.length, 2);
    assert.equal(
      checkoutCalls[0].options.idempotencyKey,
      checkoutCalls[1].options.idempotencyKey
    );
    assert.equal(responses[0].body.sessionId, "cs_shared_for_booking");
    assert.equal(responses[1].body.sessionId, "cs_shared_for_booking");
    assert.equal(booking.stripeSessionId, "cs_shared_for_booking");
  } finally {
    Booking.findById = previousFindById;
    mongoose.startSession = previousStartSession;
    sessionsPrototype.create = previousCreate;
  }
});

test("a valid signed Stripe completion still records a paid booking", async () => {
  const booking = makeBooking();
  await withBookingLookup(booking, async () => {
    const response = await sendStripeEvent(
      makeStripeEvent("checkout.session.completed", "evt_phase1_success")
    );
    assert.equal(response.status, 200);
    assert.equal(booking.paymentStatus, "paid");
    assert.equal(booking.isPaid, true);
  });
});

test("a Stripe session-expired event leaves the booking unpaid", async () => {
  const booking = makeBooking({ stripeSessionId: "cs_evt_phase1_expired" });
  await withBookingLookup(booking, async () => {
    const response = await sendStripeEvent(
      makeStripeEvent("checkout.session.expired", "evt_phase1_expired")
    );
    assert.equal(response.status, 200);
    assert.equal(booking.paymentStatus, "expired");
    assert.equal(booking.isPaid, false);
  });
});

test("Stripe rejects invalid signatures without loading a booking", async () => {
  const previousFindById = Booking.findById;
  Booking.findById = () => {
    throw new Error("invalid signature must be rejected before lookup");
  };

  try {
    const response = await sendStripeEvent(
      makeStripeEvent("checkout.session.completed", "evt_bad_signature"),
      "whsec_wrong_test_secret"
    );
    assert.equal(response.status, 400);
  } finally {
    Booking.findById = previousFindById;
  }
});

test("Stripe rejects sessions associated with a different booking", async () => {
  const booking = makeBooking();
  await withBookingLookup(booking, async () => {
    const response = await sendStripeEvent(
      makeStripeEvent("checkout.session.completed", "evt_wrong_booking", {
        client_reference_id: "another-booking",
      })
    );
    assert.equal(response.status, 400);
    assert.notEqual(booking.paymentStatus, "paid");
  });
});

test("Stripe rejects incorrect amounts, currencies, and pending payments", async (t) => {
  const cases = [
    ["incorrect amount", { amount_total: 12499 }],
    ["incorrect currency", { currency: "eur" }],
    ["pending payment", { payment_status: "unpaid" }],
  ];

  for (const [name, eventOverrides] of cases) {
    await t.test(name, async () => {
      const eventId = `evt_${name.replaceAll(" ", "_")}`;
      const booking = makeBooking({
        stripeSessionId: `cs_${eventId}`,
      });
      await withBookingLookup(booking, async () => {
        const response = await sendStripeEvent(
          makeStripeEvent(
            "checkout.session.completed",
            eventId,
            eventOverrides
          )
        );
        assert.equal(response.status, 400);
        assert.notEqual(booking.paymentStatus, "paid");
        assert.equal(booking.isPaid, false);
      });
    });
  }
});

test("duplicate Stripe events are idempotent and can safely be retried", async () => {
  const booking = makeBooking({
    stripeSessionId: "cs_evt_phase1_duplicate",
    paymentUpdateCalls: 0,
  });
  await withBookingLookup(booking, async () => {
    const event = makeStripeEvent(
      "checkout.session.completed",
      "evt_phase1_duplicate"
    );
    const firstResponse = await sendStripeEvent(event);
    const duplicateResponse = await sendStripeEvent(event);
    assert.equal(firstResponse.status, 200);
    assert.equal(duplicateResponse.status, 200);
    assert.equal(booking.paymentStatus, "paid");
    assert.equal(booking.paymentUpdateCalls, 1);
  });
});

test("a Stripe webhook retry recovers reward finalization after a failure", async () => {
  const booking = makeBooking({
    stripeSessionId: "cs_evt_reward_retry",
    reward: { _id: "reward_phase1_retry" },
  });
  const previousRewardUpdate = Reward.findOneAndUpdate;
  let rewardUpdateCalls = 0;
  Reward.findOneAndUpdate = async () => {
    rewardUpdateCalls += 1;
    if (rewardUpdateCalls === 1) {
      throw new Error("simulated reward update failure");
    }
  };

  try {
    await withBookingLookup(booking, async () => {
      const event = makeStripeEvent(
        "checkout.session.completed",
        "evt_reward_retry"
      );
      const firstResponse = await sendStripeEvent(event);
      assert.equal(firstResponse.status, 500);
      assert.equal(booking.paymentStatus, "paid");

      const retryResponse = await sendStripeEvent(event);
      assert.equal(retryResponse.status, 200);
      assert.equal(rewardUpdateCalls, 2);
    });
  } finally {
    Reward.findOneAndUpdate = previousRewardUpdate;
  }
});

test("PayPal order creation binds the provider order to the booking", async () => {
  const { createPayPalOrder } = await import("../controllers/paypalController.js");
  const booking = makeBooking({ paypalOrderId: null });
  let providerOrderRequest;
  await withPayPalMocks(
    booking,
    async (request) => {
      providerOrderRequest = request;
      return {
        result: {
          id: "paypal-created-order",
          status: "CREATED",
          purchase_units: [
            {
              reference_id: booking._id,
              amount: { currency_code: "USD", value: "125.00" },
            },
          ],
        },
      };
    },
    async () => {
      const response = makeResponse();
      await createPayPalOrder(
        authenticatedRequest(booking, { bookingId: booking._id, amount: 0.01 }),
        response
      );
      assert.equal(response.statusCode, 200);
      assert.equal(booking.paypalOrderId, "paypal-created-order");
      assert.equal(response.body.id, "paypal-created-order");
      assert.ok(booking.paypalCaptureRequestId);
      const purchaseUnit = providerOrderRequest.body.purchase_units[0];
      assert.equal(purchaseUnit.reference_id, booking._id);
      assert.equal(purchaseUnit.amount.currency_code, "USD");
      assert.equal(purchaseUnit.amount.value, "125.00");
    }
  );
});

test("PayPal order creation rejects another customer's booking", async () => {
  const { createPayPalOrder } = await import("../controllers/paypalController.js");
  const booking = makeBooking({
    user: "booking-owner",
    paypalOrderId: null,
  });
  await withPayPalMocks(
    booking,
    async () => {
      throw new Error("provider must not be called for another customer");
    },
    async (getExecuteCalls) => {
      const response = makeResponse();
      await createPayPalOrder(
        { body: { bookingId: booking._id }, user: { _id: "another-customer" } },
        response,
      );
      assert.equal(response.statusCode, 403);
      assert.equal(getExecuteCalls(), 0);
      assert.equal(booking.paypalOrderId, null);
    },
  );
});

test("PayPal order creation does not bind a mismatched provider order", async () => {
  const { createPayPalOrder } = await import("../controllers/paypalController.js");
  const booking = makeBooking({ paypalOrderId: null });
  await withPayPalMocks(
    booking,
    async () => ({
      result: {
        id: "paypal-mismatched-order",
        status: "CREATED",
        purchase_units: [
          {
            reference_id: "another-booking",
            amount: { currency_code: "USD", value: "125.00" },
          },
        ],
      },
    }),
    async () => {
      const response = makeResponse();
      await createPayPalOrder(
        authenticatedRequest(booking, { bookingId: booking._id }),
        response
      );
      assert.equal(response.statusCode, 500);
      assert.equal(booking.paypalOrderId, null);
      assert.notEqual(booking.paymentStatus, "paid");
    }
  );
});

test("PayPal order creation does not replace an order during capture", async () => {
  const { createPayPalOrder } = await import("../controllers/paypalController.js");
  const booking = makeBooking({
    paypalCaptureAttemptId: "active-capture-attempt",
    paypalCaptureStartedAt: new Date(),
  });
  await withPayPalMocks(
    booking,
    async () => {
      throw new Error("provider must not be called while capture is active");
    },
    async (getExecuteCalls) => {
      const response = makeResponse();
      await createPayPalOrder(
        authenticatedRequest(booking, { bookingId: booking._id }),
        response
      );
      assert.equal(response.statusCode, 409);
      assert.equal(getExecuteCalls(), 0);
      assert.equal(booking.paypalOrderId, "paypal-test-order");
    }
  );
});

test("PayPal capture rejects an order ID bound to another booking before capture", async () => {
  const booking = makeBooking({ paypalOrderId: "paypal-booking-a-order" });
  await withPayPalMocks(booking, async () => makePayPalCapture(), async (getCalls) => {
    const response = makeResponse();
    await capturePayPalOrder(
      authenticatedRequest(booking, {
        orderID: "paypal-booking-b-order",
        bookingId: booking._id,
      }),
      response
    );

    assert.equal(response.statusCode, 500);
    assert.equal(getCalls(), 0);
    assert.notEqual(booking.paymentStatus, "paid");
  });
});

test("PayPal capture rejects another customer's booking before provider access", async () => {
  const booking = makeBooking({ user: "booking-owner" });
  await withPayPalMocks(
    booking,
    async () => {
      throw new Error("provider must not be called for another customer");
    },
    async (getCalls) => {
      const response = makeResponse();
      await capturePayPalOrder(
        {
          body: { orderID: booking.paypalOrderId, bookingId: booking._id },
          user: { _id: "another-customer" },
        },
        response,
      );
      assert.equal(response.statusCode, 403);
      assert.equal(getCalls(), 0);
      assert.notEqual(booking.paymentStatus, "paid");
    },
  );
});

test("a completed PayPal capture records payment only when amount and currency match", async () => {
  const booking = makeBooking();
  await withPayPalMocks(
    booking,
    async (request) =>
      request.path.includes("/capture?")
        ? makePayPalCapture()
        : makePayPalOrder(),
    async () => {
      const response = makeResponse();
      await capturePayPalOrder(
        authenticatedRequest(booking, {
          orderID: booking.paypalOrderId,
          bookingId: booking._id,
        }),
        response
      );
      assert.equal(response.statusCode, 200);
      assert.equal(booking.paymentStatus, "paid");
      assert.equal(booking.isPaid, true);
    }
  );
});

test("simultaneous PayPal capture requests only invoke one provider capture", async () => {
  const booking = makeBooking();
  let signalCaptureStarted;
  let releaseCapture;
  const captureStarted = new Promise((resolve) => {
    signalCaptureStarted = resolve;
  });
  const captureGate = new Promise((resolve) => {
    releaseCapture = resolve;
  });

  await withPayPalMocks(
    booking,
    async (request) => {
      if (request.path.includes("/capture?")) {
        signalCaptureStarted();
        await captureGate;
        return makePayPalCapture();
      }
      return makePayPalOrder();
    },
    async (getExecuteCalls) => {
      const firstResponse = makeResponse();
      const secondResponse = makeResponse();
      const firstCapture = capturePayPalOrder(
        authenticatedRequest(booking, {
          orderID: booking.paypalOrderId,
          bookingId: booking._id,
        }),
        firstResponse
      );
      await captureStarted;

      await capturePayPalOrder(
        authenticatedRequest(booking, {
          orderID: booking.paypalOrderId,
          bookingId: booking._id,
        }),
        secondResponse
      );
      assert.equal(secondResponse.statusCode, 409);
      assert.equal(getExecuteCalls(), 2);

      releaseCapture();
      await firstCapture;
      assert.equal(firstResponse.statusCode, 200);
      assert.equal(booking.paymentStatus, "paid");
      assert.equal(booking.paypalCaptureAttemptId, null);
    }
  );
});

test("PayPal reconciles an interrupted capture from the completed provider order", async () => {
  const booking = makeBooking({
    paypalCaptureAttemptId: "interrupted-attempt",
    paypalCaptureStartedAt: new Date(Date.now() - 6 * 60 * 1000),
  });

  await withPayPalMocks(
    booking,
    async () => makePayPalCapture(),
    async (getExecuteCalls) => {
      const response = makeResponse();
      await capturePayPalOrder(
        authenticatedRequest(booking, {
          orderID: booking.paypalOrderId,
          bookingId: booking._id,
        }),
        response
      );
      assert.equal(response.statusCode, 200);
      assert.equal(getExecuteCalls(), 1);
      assert.equal(booking.paymentStatus, "paid");
      assert.equal(booking.paypalCaptureAttemptId, null);
      assert.equal(booking.paypalCaptureStartedAt, null);
    }
  );
});

test("a PayPal provider failure releases the capture lease for recovery", async () => {
  const booking = makeBooking();
  await withPayPalMocks(
    booking,
    async (request) => {
      if (request.path.includes("/capture?")) {
        throw new Error("mock provider unavailable");
      }
      return makePayPalOrder();
    },
    async () => {
      const response = makeResponse();
      await capturePayPalOrder(
        authenticatedRequest(booking, {
          orderID: booking.paypalOrderId,
          bookingId: booking._id,
        }),
        response
      );
      assert.equal(response.statusCode, 500);
      assert.equal(booking.paymentStatus, "awaiting_payment");
      assert.equal(booking.isPaid, false);
      assert.equal(booking.paypalCaptureAttemptId, null);
      assert.equal(booking.paypalCaptureStartedAt, null);
    }
  );
});

test("PayPal retries reuse the capture idempotency key and reconcile provider success", async () => {
  const booking = makeBooking();
  let providerCompleted = false;
  const captureRequestIds = [];

  await withPayPalMocks(
    booking,
    async (request) => {
      if (!request.path.includes("/capture?")) {
        return providerCompleted
          ? makePayPalCapture()
          : makePayPalOrder();
      }

      captureRequestIds.push(request.headers["PayPal-Request-Id"]);
      providerCompleted = true;
      throw new Error("mock connection lost after provider completed capture");
    },
    async (getExecuteCalls) => {
      const firstResponse = makeResponse();
      await capturePayPalOrder(
        authenticatedRequest(booking, {
          orderID: booking.paypalOrderId,
          bookingId: booking._id,
        }),
        firstResponse
      );
      assert.equal(firstResponse.statusCode, 500);
      assert.equal(booking.paypalCaptureAttemptId, null);

      const retryResponse = makeResponse();
      await capturePayPalOrder(
        authenticatedRequest(booking, {
          orderID: booking.paypalOrderId,
          bookingId: booking._id,
        }),
        retryResponse
      );

      assert.equal(retryResponse.statusCode, 200);
      assert.equal(booking.paymentStatus, "paid");
      assert.equal(captureRequestIds.length, 1);
      assert.equal(captureRequestIds[0], booking.paypalCaptureRequestId);
      assert.equal(getExecuteCalls(), 3);
    }
  );
});

test("PayPal rejects incorrect amounts, currencies, references, and pending captures", async (t) => {
  const cases = [
    ["incorrect amount", makePayPalCapture({
      purchase_units: [{
        reference_id: "booking-phase1",
        amount: { currency_code: "USD", value: "125.00" },
        payments: { captures: [{
          status: "COMPLETED",
          amount: { currency_code: "USD", value: "124.99" },
        }] },
      }],
    })],
    ["incorrect currency", makePayPalCapture({
      purchase_units: [{
        reference_id: "booking-phase1",
        amount: { currency_code: "USD", value: "125.00" },
        payments: { captures: [{
          status: "COMPLETED",
          amount: { currency_code: "EUR", value: "125.00" },
        }] },
      }],
    })],
    ["incorrect booking reference", makePayPalCapture({
      purchase_units: [{
        reference_id: "another-booking",
        amount: { currency_code: "USD", value: "125.00" },
        payments: { captures: [{
          status: "COMPLETED",
          amount: { currency_code: "USD", value: "125.00" },
        }] },
      }],
    })],
    ["pending payment", makePayPalCapture({
      status: "APPROVED",
      purchase_units: [{
        reference_id: "booking-phase1",
        amount: { currency_code: "USD", value: "125.00" },
        payments: { captures: [{
          status: "PENDING",
          amount: { currency_code: "USD", value: "125.00" },
        }] },
      }],
    })],
    ["failed capture", makePayPalCapture({
      purchase_units: [{
        reference_id: "booking-phase1",
        amount: { currency_code: "USD", value: "125.00" },
        payments: { captures: [{
          status: "DECLINED",
          amount: { currency_code: "USD", value: "125.00" },
        }] },
      }],
    })],
  ];

  for (const [name, providerResponse] of cases) {
    await t.test(name, async () => {
      const booking = makeBooking();
      await withPayPalMocks(
        booking,
        async () => providerResponse,
        async () => {
          const response = makeResponse();
          await capturePayPalOrder(
            authenticatedRequest(booking, {
              orderID: booking.paypalOrderId,
              bookingId: booking._id,
            }),
            response
          );
          assert.equal(response.statusCode, 500);
          assert.notEqual(booking.paymentStatus, "paid");
          assert.equal(booking.isPaid, false);
        }
      );
    });
  }
});

test("duplicate PayPal captures are idempotent without a second provider call", async () => {
  const booking = makeBooking({ paymentStatus: "paid", isPaid: true });
  await withPayPalMocks(
    booking,
    async () => {
      throw new Error("already-paid booking must not recapture");
    },
    async (getCalls) => {
      const response = makeResponse();
      await capturePayPalOrder(
        authenticatedRequest(booking, {
          orderID: booking.paypalOrderId,
          bookingId: booking._id,
        }),
        response
      );
      assert.equal(response.statusCode, 200);
      assert.equal(getCalls(), 0);
      assert.equal(booking.paymentStatus, "paid");
    }
  );
});
