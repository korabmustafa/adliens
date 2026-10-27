import { randomBytes } from "node:crypto";
import { setup } from "../server/setup.js";
const email = process.env.ADLIENS_ADMIN_EMAIL,
  password = process.env.ADLIENS_ADMIN_PASSWORD;
if (!email || !password)
  throw new Error(
    "Set ADLIENS_ADMIN_EMAIL and ADLIENS_ADMIN_PASSWORD in your private environment file.",
  );
process.env.ADLIENS_SETUP_TOKEN = randomBytes(40).toString("base64url");
const result = await setup(
  { headers: { "x-adliens-setup": process.env.ADLIENS_SETUP_TOKEN } },
  { email, password, seedDemo: process.env.SEED_DEMO === "true" },
);
console.log(result.status, result.body);
if (result.status >= 400) process.exitCode = 1;
