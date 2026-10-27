import { getMigrations } from "better-auth/db/migration";
import { getAuth } from "../server/auth.js";
const migration = await getMigrations(getAuth().options);
await migration.runMigrations();
console.log("Authentication schema is up to date.");
