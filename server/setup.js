import { getMigrations } from "better-auth/db/migration";
import { timingSafeEqual } from "node:crypto";
import { getAuth } from "./auth.js";
import { getDb, query } from "./db.js";
import { initialCompanies, initialCaseStudies } from "../src/mock/data.js";
export async function setup(req, body) {
  const expected = process.env.ADLIENS_SETUP_TOKEN;
  const value = req.headers["x-adliens-setup"] || "";
  if (
    !expected ||
    typeof value !== "string" ||
    Buffer.byteLength(value) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(value), Buffer.from(expected))
  )
    return { status: 401, body: { error: "Unauthorized" } };
  if (!body.email || !body.password || body.password.length < 12)
    return {
      status: 400,
      body: { error: "A valid admin email and password are required" },
    };
  const lock = await getDb().connect();
  try {
    await lock.query("SELECT pg_advisory_lock(739157)");
    await query(
      "CREATE TABLE IF NOT EXISTS adliens_admins (user_id text PRIMARY KEY)",
    );
    if ((await query("SELECT 1 FROM adliens_admins LIMIT 1")).rowCount)
      return {
        status: 409,
        body: { error: "Setup has already been completed" },
      };
    await (await getMigrations(getAuth().options)).runMigrations();
    await query(`CREATE TABLE IF NOT EXISTS adliens_companies (id text PRIMARY KEY,data jsonb NOT NULL,created_at timestamptz DEFAULT now());
      CREATE TABLE IF NOT EXISTS adliens_cases (id text PRIMARY KEY,company_id text NOT NULL REFERENCES adliens_companies(id) ON DELETE CASCADE,data jsonb NOT NULL,created_at timestamptz DEFAULT now());
      CREATE TABLE IF NOT EXISTS adliens_leads (id text PRIMARY KEY,data jsonb NOT NULL,status text NOT NULL DEFAULT 'new',created_at timestamptz DEFAULT now());
      CREATE TABLE IF NOT EXISTS adliens_settings (id text PRIMARY KEY,data jsonb NOT NULL);
      CREATE TABLE IF NOT EXISTS adliens_media (id text PRIMARY KEY,pathname text UNIQUE NOT NULL,content_type text NOT NULL,created_at timestamptz DEFAULT now());
      CREATE TABLE IF NOT EXISTS adliens_limits (key text PRIMARY KEY,attempts integer NOT NULL,reset_at timestamptz NOT NULL);`);
    // Public registration is never routed; this is an authenticated, one-time server operation.
    const account = await getAuth().api.signUpEmail({
      body: {
        email: body.email,
        password: body.password,
        name: "Adliens Admin",
      },
    });
    if (body.seedDemo !== false) {
      for (const c of initialCompanies)
        await query(
          "INSERT INTO adliens_companies(id,data) VALUES($1,$2) ON CONFLICT DO NOTHING",
          [c.id, JSON.stringify({ ...c, isDemo: true })],
        );
      for (const p of initialCaseStudies)
        await query(
          "INSERT INTO adliens_cases(id,company_id,data) VALUES($1,$2,$3) ON CONFLICT DO NOTHING",
          [p.id, p.companyId, JSON.stringify({ ...p, isDemo: true })],
        );
    }
    await query(
      "INSERT INTO adliens_settings(id,data) VALUES('site',$1) ON CONFLICT DO NOTHING",
      [JSON.stringify({ filmUrl: "" })],
    );
    await query("INSERT INTO adliens_admins(user_id) VALUES($1)", [
      account.user.id,
    ]);
    return { status: 201, body: { ready: true, email: account.user.email } };
  } finally {
    await lock.query("SELECT pg_advisory_unlock(739157)");
    lock.release();
  }
}
