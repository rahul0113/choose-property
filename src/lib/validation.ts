// Shared zod schemas (TRD SEC-04): used by server actions and client forms.

import { z } from "zod";

const phoneSchema = z
  .string()
  .transform((v) => v.replace(/[\s-]/g, "").replace(/^\+?91/, ""))
  .refine((v) => /^[6-9]\d{9}$/.test(v), "Enter a valid 10-digit Indian mobile number");

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: phoneSchema,
  whatsapp: phoneSchema.optional().or(z.literal("")),
  property: z.string().trim().min(1, "Tell us which property you are interested in").max(120),
  contact_method: z.string().optional(),
  budget_range: z.string().optional(),
  preferred_location: z.string().optional(),
  plot_size: z.string().optional(),
  purpose: z.string().optional(),
  preferred_road_width: z.string().optional(),
  purchase_timeline: z.string().optional(),
  message: z.string().max(1000).optional(),
  // Honeypot — must stay empty (NFR-SEC-02).
  website: z.string().optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
