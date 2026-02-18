import { z } from "zod";

export const groupInterestSchema = z.object({
  groupId: z.string().min(1),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().max(500).optional(),
  honeypot: z.string().max(0).optional(),
});

export type GroupInterestInput = z.infer<typeof groupInterestSchema>;
