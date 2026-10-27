import { randomUUID, createHmac } from "node:crypto";
import { z } from "zod";
import { head, issueSignedToken, presignUrl } from "@vercel/blob";
import { handleUpload } from "@vercel/blob/client";
import { query } from "../server/db.js";
import { getAuth } from "../server/auth.js";
import {
  companySchema,
  caseSchema,
  leadSchema,
  settingsSchema,
} from "../server/validation.js";
const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
];
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const fail = (status, message) => {
  throw new HttpError(status, message);
};
function requestHeaders(req) {
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers))
    if (v) headers.set(k, Array.isArray(v) ? v.join(",") : v);
  return headers;
}
function origin(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${req.headers["x-forwarded-proto"] || "http"}://${host}`;
}
async function session(req) {
  const s = await getAuth().api.getSession({ headers: requestHeaders(req) });
  if (
    !s ||
    !(await query("SELECT 1 FROM adliens_admins WHERE user_id=$1", [s.user.id]))
      .rowCount
  )
    fail(401, "Please sign in");
  return s;
}
async function rateLimit(req, bucket, max) {
  const ip = String(
    req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown",
  ).split(",")[0];
  const key =
    bucket +
    ":" +
    createHmac("sha256", process.env.BETTER_AUTH_SECRET)
      .update(ip)
      .digest("hex");
  const r = await query(
    `INSERT INTO adliens_limits(key,attempts,reset_at) VALUES($1,1,now()+interval '1 minute') ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN adliens_limits.reset_at<now() THEN 1 ELSE adliens_limits.attempts+1 END, reset_at=CASE WHEN adliens_limits.reset_at<now() THEN now()+interval '1 minute' ELSE adliens_limits.reset_at END RETURNING attempts`,
    [key],
  );
  if (r.rows[0].attempts > max)
    fail(429, "Too many requests. Please try again shortly.");
}
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  const url = new URL(req.url, origin(req));
  const path =
    "/" +
    (url.searchParams.get("route") || url.pathname.replace(/^\/api\/?/, ""));
  const method = req.method;
  const send = (body, status = 200) => res.status(status).json(body);
  try {
    let body = req.body || {};
    if (typeof body === "string") body = JSON.parse(body);
    const callback =
      path === "/admin/uploads" && body.type === "blob.upload-completed";
    if (!["GET", "HEAD"].includes(method) && path !== "/setup" && !callback) {
      const requestOrigin = req.headers.origin;
      if (requestOrigin && requestOrigin !== origin(req))
        fail(403, "Invalid request origin");
      if (
        !String(req.headers["content-type"] || "").includes("application/json")
      )
        fail(415, "Expected JSON");
    }
    if (path === "/health" && method === "GET") {
      await query("SELECT 1");
      return send({ status: "ok", database: true });
    }
    if (path.startsWith("/auth/")) {
      const endpoint = path.slice(6);
      const methods = {
        "sign-in/email": "POST",
        "sign-out": "POST",
        "get-session": "GET",
        "change-password": "POST",
        ok: "GET",
      };
      if (methods[endpoint] !== method) fail(404, "Not found");
      const response = await getAuth().handler(
        new Request(origin(req) + "/api/auth/" + endpoint, {
          method,
          headers: requestHeaders(req),
          ...(!["GET", "HEAD"].includes(method)
            ? { body: JSON.stringify(body) }
            : {}),
        }),
      );
      const cookies = response.headers.getSetCookie();
      if (cookies.length) res.setHeader("Set-Cookie", cookies);
      res.setHeader("Content-Type", "application/json");
      return res.status(response.status).send(await response.text());
    }
    if (path === "/settings" && method === "GET") {
      const r = await query(
        "SELECT data FROM adliens_settings WHERE id='site'",
      );
      return send(r.rows[0]?.data || { filmUrl: "" });
    }
    if (path === "/case-studies" && method === "GET") {
      const r = await query(
        `SELECT p.id,p.data,c.data AS company FROM adliens_cases p JOIN adliens_companies c ON c.id=p.company_id WHERE p.data->>'status'='published' AND COALESCE((c.data->>'isActive')::boolean,true) ORDER BY p.created_at,p.id`,
      );
      return send(
        r.rows.map((p) => ({
          ...p.data,
          id: p.id,
          companyName: p.company.name,
          logoUrl: p.company.logoUrl,
        })),
      );
    }
    if (path === "/leads" && method === "POST") {
      await rateLimit(req, "lead", 5);
      const data = leadSchema.parse(body);
      if (data.website) return send({ success: true }, 201);
      const id = randomUUID();
      await query("INSERT INTO adliens_leads(id,data) VALUES($1,$2)", [
        id,
        JSON.stringify(data),
      ]);
      return send({ success: true }, 201);
    }
    if (path.startsWith("/media/") && ["GET", "HEAD"].includes(method)) {
      const id = path.slice(7),
        media = (await query("SELECT * FROM adliens_media WHERE id=$1", [id]))
          .rows[0];
      if (!media) fail(404, "Media not found");
      const ref = "/api/media/" + id;
      const published = (
        await query(
          `SELECT 1 FROM adliens_cases p JOIN adliens_companies c ON c.id=p.company_id WHERE p.data->>'status'='published' AND COALESCE((c.data->>'isActive')::boolean,true) AND (p.data->>'imageUrl'=$1 OR p.data->>'videoUrl'=$1 OR c.data->>'logoUrl'=$1) UNION ALL SELECT 1 FROM adliens_settings WHERE id='site' AND data->>'filmUrl'=$1 LIMIT 1`,
          [ref],
        )
      ).rowCount;
      if (!published) await session(req);
      const token = await issueSignedToken({
        pathname: media.pathname,
        operations: ["get"],
        validUntil: Date.now() + 120000,
      });
      const signed = await presignUrl(token, {
        operation: "get",
        pathname: media.pathname,
        access: "private",
      });
      res.setHeader("Location", signed.presignedUrl);
      return res.status(302).end();
    }
    if (!path.startsWith("/admin/")) fail(404, "Not found");
    if (callback) {
      return send(
        await handleUpload({
          request: req,
          body,
          onBeforeGenerateToken: async () => {
            fail(401, "Unauthorized");
          },
        }),
      );
    }
    const user = await session(req);
    if (path === "/admin/session" && method === "GET")
      return send({ user: { ...user.user, role: "admin" } });
    if (path === "/admin/uploads" && method === "POST")
      return send(
        await handleUpload({
          request: req,
          body,
          onBeforeGenerateToken: async (pathname) => {
            if (!pathname.startsWith("adliens/"))
              fail(400, "Invalid upload path");
            return {
              allowedContentTypes: allowedTypes,
              maximumSizeInBytes: 500 * 1024 * 1024,
              addRandomSuffix: true,
              allowOverwrite: false,
              tokenPayload: JSON.stringify({ userId: user.user.id }),
            };
          },
        }),
      );
    if (path === "/admin/media" && method === "POST") {
      const data = z
        .object({ pathname: z.string().startsWith("adliens/").max(500) })
        .parse(body);
      const meta = await head(data.pathname);
      if (!allowedTypes.includes(meta.contentType))
        fail(400, "Unsupported media type");
      const id = randomUUID();
      const result = await query(
        "INSERT INTO adliens_media(id,pathname,content_type) VALUES($1,$2,$3) ON CONFLICT(pathname) DO UPDATE SET pathname=EXCLUDED.pathname RETURNING id",
        [id, meta.pathname, meta.contentType],
      );
      return send({ url: "/api/media/" + result.rows[0].id }, 201);
    }
    if (path === "/admin/settings" && method === "PATCH") {
      const data = settingsSchema.parse(body);
      await query(
        "INSERT INTO adliens_settings(id,data) VALUES('site',$1) ON CONFLICT(id) DO UPDATE SET data=EXCLUDED.data",
        [JSON.stringify(data)],
      );
      return send(data);
    }
    if (path === "/admin/leads" && method === "GET") {
      const r = await query(
        'SELECT id,data,status,created_at AS "createdAt" FROM adliens_leads ORDER BY created_at DESC LIMIT 500',
      );
      return send(
        r.rows.map((r) => ({
          ...r.data,
          id: r.id,
          status: r.status,
          createdAt: r.createdAt,
        })),
      );
    }
    if (path.startsWith("/admin/leads/") && method === "PATCH") {
      const data = z
        .object({ status: z.enum(["new", "read", "archived"]) })
        .parse(body);
      const r = await query(
        "UPDATE adliens_leads SET status=$1 WHERE id=$2 RETURNING id,status",
        [data.status, path.slice(13)],
      );
      if (!r.rowCount) fail(404, "Inquiry not found");
      return send(r.rows[0]);
    }
    const match = path.match(
      /^\/admin\/(companies|case-studies)(?:\/([^/]+))?$/,
    );
    if (!match) fail(404, "Not found");
    const kind = match[1],
      id = match[2],
      table = kind === "companies" ? "adliens_companies" : "adliens_cases",
      schema = kind === "companies" ? companySchema : caseSchema;
    if (method === "GET" && !id) {
      const r = await query(
        `SELECT id,data FROM ${table} ORDER BY created_at DESC`,
      );
      return send(r.rows.map((r) => ({ ...r.data, id: r.id })));
    }
    if (method === "DELETE" && id) {
      const r = await query(`DELETE FROM ${table} WHERE id=$1`, [id]);
      if (!r.rowCount) fail(404, "Entry not found");
      return res.status(204).end();
    }
    if ((method === "POST" && !id) || (method === "PATCH" && id)) {
      let existing = {};
      if (id) {
        const r = await query(`SELECT data FROM ${table} WHERE id=$1`, [id]);
        if (!r.rowCount) fail(404, "Entry not found");
        existing = r.rows[0].data;
      }
      const data = schema.parse({ ...existing, ...body });
      const rowId = id || randomUUID();
      if (kind === "case-studies") {
        const c = (
          await query("SELECT data FROM adliens_companies WHERE id=$1", [
            data.companyId,
          ])
        ).rows[0];
        if (!c) fail(400, "Select an existing company");
        data.companyName = c.data.name;
        data.logoUrl = c.data.logoUrl;
      }
      if (id) {
        await query(
          `UPDATE ${table} SET data=$1${kind === "case-studies" ? ",company_id=$3" : ""} WHERE id=$2`,
          kind === "case-studies"
            ? [JSON.stringify(data), id, data.companyId]
            : [JSON.stringify(data), id],
        );
      } else if (kind === "companies")
        await query("INSERT INTO adliens_companies(id,data) VALUES($1,$2)", [
          rowId,
          JSON.stringify(data),
        ]);
      else
        await query(
          "INSERT INTO adliens_cases(id,company_id,data) VALUES($1,$2,$3)",
          [rowId, data.companyId, JSON.stringify(data)],
        );
      return send({ ...data, id: rowId }, id ? 200 : 201);
    }
    fail(405, "Method not allowed");
  } catch (error) {
    if (res.headersSent) return res.end();
    if (error instanceof z.ZodError)
      return send({ error: error.issues[0]?.message || "Invalid input" }, 400);
    if (error instanceof SyntaxError)
      return send({ error: "Invalid JSON" }, 400);
    if (!error.status)
      console.error("API request failed", {
        path,
        code: error.code || error.name,
      });
    return send(
      {
        error: error.status
          ? error.message
          : "The request could not be completed",
      },
      error.status || 500,
    );
  }
}
