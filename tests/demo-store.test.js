import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { initialCompanies, initialCaseStudies } from "../src/mock/data.js";
import {
  listCaseStudies,
  listCompanies,
  deleteCaseStudy,
} from "../src/mock/adminStore.js";
const key = "adliens-admin-db-v1";
let values;
beforeEach(() => {
  values = new Map();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (k) => values.get(k) || null,
      setItem: (k, v) => values.set(k, v),
      removeItem: (k) => values.delete(k),
    },
  });
});
test("fresh demo has 12 worlds and 24 published campaigns", async () => {
  assert.equal((await listCompanies()).length, 12);
  assert.equal((await listCaseStudies({ publishedOnly: true })).length, 24);
});
test("migration preserves edits and adds new concepts only once", async () => {
  values.set(
    key,
    JSON.stringify({
      companies: [{ ...initialCompanies[0], name: "My edited client" }],
      caseStudies: [{ ...initialCaseStudies[0], summary: "My actual work" }],
    }),
  );
  const rows = await listCaseStudies();
  assert.equal(rows.find((p) => p.id === "cs-1").summary, "My actual work");
  assert.equal(
    (await listCompanies()).find((c) => c.id === "cmp-1").name,
    "My edited client",
  );
  assert.ok(
    !rows.some((p) => p.companyId === "cmp-2"),
    "deleted legacy company is not restored",
  );
  assert.equal(
    rows.find((p) => p.id === "demo-skincare-2").companyName,
    "My edited client",
  );
  await deleteCaseStudy("demo-nocturne-1");
  assert.ok(
    !(await listCaseStudies()).some((p) => p.id === "demo-nocturne-1"),
    "deleting a new concept remains effective",
  );
});
