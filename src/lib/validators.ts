import { z } from "zod";

export const createMonitorSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  url: z.string().url("Must be a valid URL").max(500),
  interval_minutes: z.coerce.number().int().min(1).max(1440).default(5),
  alert_email: z.string().email().optional().or(z.literal("")),
});

export const updateMonitorSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  url: z.string().url().max(500).optional(),
  interval_minutes: z.coerce.number().int().min(1).max(1440).optional(),
  is_active: z.boolean().optional(),
  alert_email: z.string().email().optional().or(z.literal("")),
});

export const createStatusPageSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  description: z.string().max(500).optional(),
  monitor_ids: z.array(z.string().uuid()).default([]),
});

export const updateStatusPageSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  is_public: z.boolean().optional(),
  monitor_ids: z.array(z.string().uuid()).optional(),
});

export const profileUpdateSchema = z.object({
  full_name: z.string().max(100).optional(),
});
