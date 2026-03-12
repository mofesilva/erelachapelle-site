import { z } from "zod";

export const contactSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    subject: z.string().min(3).max(200),
    message: z.string().min(10).max(2000),
    honeypot: z.string().max(0).optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;

export type ContactResult = {
    success: boolean;
    message: string;
};
