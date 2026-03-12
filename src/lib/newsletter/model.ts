import { z } from "zod";

export const newsletterSchema = z.object({
    email: z.string().email(),
    locale: z.enum(["fr", "pt", "en"]),
    honeypot: z.string().max(0).optional(),
});

export type NewsletterPayload = z.infer<typeof newsletterSchema>;

export type NewsletterResult = {
    success: boolean;
    message: string;
};
