"use server";

import { contactSchema, type ContactResult } from "./model";

export async function submitContactForm(
    _prevState: ContactResult | null,
    formData: FormData
): Promise<ContactResult> {
    const raw = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
        honeypot: (formData.get("honeypot") as string) || undefined,
    };

    if (raw.honeypot) {
        return { success: false, message: "Spam detected." };
    }

    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
        return { success: false, message: parsed.error.issues[0].message };
    }

    // TODO: Cappuccino insert to contact_messages collection
    return { success: true, message: "success" };
}
