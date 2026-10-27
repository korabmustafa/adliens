import { test } from "node:test";
import assert from "node:assert/strict";
import handler from "../api/index.js";
import { setup } from "../server/setup.js";
import {
  companySchema,
  caseSchema,
  leadSchema,
  settingsSchema,
} from "../server/validation.js";
function response() {
  return {
    headers: {},
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(s) {
      this.code = s;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    end() {
      return this;
    },
  };
}
test("public account registration cannot reach the auth handler", async () => {
  const res = response();
  await handler(
    {
      url: "/api/auth/sign-up/email",
      headers: { host: "localhost", "content-type": "application/json" },
      method: "POST",
      body: {},
    },
    res,
  );
  assert.equal(res.code, 404);
});
test("bootstrap helper rejects missing owner-only secret before touching database", async () => {
  const result = await setup(
    { headers: {} },
    { email: "attacker@example.com" },
  );
  assert.equal(result.status, 401);
});
test("no public setup endpoint exists after provisioning", async () => {
  const res = response();
  await handler(
    {
      url: "/api/setup",
      headers: { host: "localhost", "content-type": "application/json" },
      method: "POST",
      body: {},
    },
    res,
  );
  assert.equal(res.code, 404);
});

test("unsafe cross-origin mutations are rejected", async () => {
  const res = response();
  await handler(
    {
      url: "/api/admin/companies",
      headers: {
        host: "localhost",
        origin: "https://untrusted.example",
        "content-type": "application/json",
      },
      method: "POST",
      body: {},
    },
    res,
  );
  assert.equal(res.code, 403);
});
test("schemas accept uploaded media, reject executable URLs and invalid publication states", () => {
  assert.ok(
    settingsSchema.safeParse({ filmUrl: "/api/media/abc-123" }).success,
  );
  assert.equal(
    settingsSchema.safeParse({ filmUrl: "javascript:alert(1)" }).success,
    false,
  );
  assert.equal(
    companySchema.safeParse({ name: " ", logoUrl: "data:text/html,malicious" })
      .success,
    false,
  );
  assert.equal(
    caseSchema.safeParse({
      companyId: "a",
      name: "Test",
      summary: "Test",
      status: "public",
    }).success,
    false,
  );
  assert.equal(
    leadSchema.safeParse({
      name: "Test",
      company: "Test",
      email: "invalid",
      message: "hello",
    }).success,
    false,
  );
});
