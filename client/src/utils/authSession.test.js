import assert from "node:assert/strict";
import test from "node:test";
import {
  isCustomerSession,
  isRestoringAuthSession,
  normalizeAuthUser,
} from "./authSession.js";

test("recognizes a customer session restored from a wrapped auth response", () => {
  const userInfo = {
    user: { _id: "customer-1", role: "customer" },
    token: "session-token",
  };

  assert.equal(isCustomerSession({ token: "session-token", userInfo }), true);
  assert.deepEqual(normalizeAuthUser(userInfo), {
    _id: "customer-1",
    role: "customer",
  });
});

test("recognizes a customer session with the normalized login response", () => {
  assert.equal(
    isCustomerSession({
      token: "session-token",
      userInfo: { _id: "customer-1", role: "customer" },
    }),
    true,
  );
});

test("requires a token and a customer role to continue booking", () => {
  assert.equal(
    isCustomerSession({ token: null, userInfo: { role: "customer" } }),
    false,
  );
  assert.equal(
    isCustomerSession({ token: "session-token", userInfo: null }),
    false,
  );
  assert.equal(
    isCustomerSession({
      token: "session-token",
      userInfo: { user: { role: "admin" } },
    }),
    false,
  );
});

test("waits for a stored-token session to restore instead of prompting for login", () => {
  assert.equal(
    isRestoringAuthSession({
      token: "session-token",
      userInfo: null,
      status: "idle",
    }),
    true,
  );
  assert.equal(
    isRestoringAuthSession({
      token: "session-token",
      userInfo: null,
      status: "loading",
    }),
    true,
  );
  assert.equal(
    isRestoringAuthSession({
      token: "session-token",
      userInfo: null,
      status: "failed",
    }),
    false,
  );
  assert.equal(
    isRestoringAuthSession({
      token: null,
      userInfo: null,
      status: "idle",
    }),
    false,
  );
});
