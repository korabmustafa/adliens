import pg from "pg";
let pool;
export function getDb() {
  if (!process.env.DATABASE_URL) throw new Error("Database is not configured");
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("sslmode", "verify-full");
  return (pool ||= new pg.Pool({
    connectionString: url.toString(),
    max: 5,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 10000,
    allowExitOnIdle: true,
  }));
}
export const query = (text, values = []) => getDb().query(text, values);
