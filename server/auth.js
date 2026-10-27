import { betterAuth } from "better-auth";
import { getDb } from "./db.js";
let auth;
export function getAuth() {
  if (!process.env.BETTER_AUTH_SECRET)
    throw new Error("Authentication is not configured");
  return (auth ||= betterAuth({
    database: getDb(),
    secret: process.env.BETTER_AUTH_SECRET,
    ...(process.env.APP_ORIGIN ? { baseURL: process.env.APP_ORIGIN } : {}),
    trustedOrigins: [
      process.env.APP_ORIGIN,
      process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
      process.env.VERCEL_PROJECT_PRODUCTION_URL &&
        `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    ].filter(Boolean),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
    session: { expiresIn: 60 * 60 * 12, updateAge: 60 * 60 },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 40,
      customRules: { "/sign-in/email": { window: 60, max: 5 } },
    },
  }));
}
