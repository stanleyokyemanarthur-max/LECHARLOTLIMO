import assert from "node:assert/strict";
import test from "node:test";
import { customerOnly } from "../middleware/authMiddleware.js";

const makeResponse = () => ({
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
});

test("customer-only authorization permits customers and rejects unauthenticated or other roles", () => {
  let nextCalled = false;
  const customerResponse = makeResponse();
  customerOnly(
    { user: { role: "customer" } },
    customerResponse,
    () => { nextCalled = true; },
  );
  assert.equal(nextCalled, true);
  assert.equal(customerResponse.statusCode, 200);

  for (const user of [null, { role: "admin" }, { role: "driver" }]) {
    const response = makeResponse();
    customerOnly({ user }, response, () => assert.fail("next must not be called"));
    assert.equal(response.statusCode, 403);
    assert.match(response.body.message, /Customer account required/);
  }
});
