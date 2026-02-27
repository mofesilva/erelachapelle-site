import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email(),
  locale: z.enum(["fr", "pt", "en"]),
  honeypot: z.string().max(0).optional(),
});
