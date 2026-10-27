import { z } from "zod";
const text = (max) => z.string().trim().max(max);
const media = z
  .string()
  .max(2048)
  .refine(
    (v) =>
      !v ||
      /^https:\/\/[^\s]+$/.test(v) ||
      /^\/api\/media\/[a-zA-Z0-9-]+$/.test(v),
    "Use an HTTPS URL or an uploaded media file",
  );
export const companySchema = z.object({
  name: text(160).min(1),
  industry: text(160).default(""),
  website: z
    .string()
    .max(2048)
    .refine((v) => !v || /^https?:\/\/[^\s]+$/.test(v))
    .default(""),
  logoUrl: media.default(""),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
});
export const caseSchema = z.object({
  companyId: text(120).min(1),
  name: text(200).min(1),
  result: text(500).default(""),
  summary: text(5000).min(1),
  challenge: text(5000).default(""),
  approach: text(5000).default(""),
  imageUrl: media.default(""),
  videoUrl: media.default(""),
  services: z.array(text(120).min(1)).max(20).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  isDemo: z.boolean().default(false),
  artTitle: text(200).optional(),
  artTheme: z.number().int().min(0).max(7).optional(),
});
export const leadSchema = z.object({
  name: text(120).min(1),
  email: z.string().email().max(254),
  company: text(160).min(1),
  message: text(5000).min(5),
  website: text(200).optional(),
});
export const settingsSchema = z.object({ filmUrl: media.default("") });
