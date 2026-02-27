import { z } from "zod";

export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  attendees: z.number().int().min(1).max(20),
  honeypot: z.string().max(0).optional(),
});
