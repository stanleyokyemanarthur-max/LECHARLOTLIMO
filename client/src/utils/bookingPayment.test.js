import test from "node:test";
import assert from "node:assert/strict";
import { findPaidBooking } from "./bookingPayment.js";

test("finds the requested booking only when the server reports it paid", () => {
  const paidBooking = { _id: "booking-1", paymentStatus: "paid" };
  assert.equal(
    findPaidBooking(
      [
        { _id: "booking-2", paymentStatus: "paid" },
        { _id: "booking-1", paymentStatus: "awaiting_payment" },
        paidBooking,
      ],
      "booking-1",
    ),
    paidBooking,
  );
});

test("does not verify missing, unrelated, or invalid booking data", () => {
  assert.equal(findPaidBooking([], "booking-1"), null);
  assert.equal(
    findPaidBooking([{ _id: "booking-2", paymentStatus: "paid" }], "booking-1"),
    null,
  );
  assert.equal(findPaidBooking(null, "booking-1"), null);
  assert.equal(findPaidBooking([{ _id: "booking-1", paymentStatus: "paid" }], ""), null);
});
