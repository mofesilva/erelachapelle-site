"use server";

import { eventRegistrationSchema, type RegistrationResult } from "./model";

export async function registerForEvent(
    _prevState: RegistrationResult | null,
    formData: FormData
): Promise<RegistrationResult> {
    const raw = {
        eventId: formData.get("eventId") as string,
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || undefined,
        attendees: Number(formData.get("attendees") ?? 1),
        honeypot: (formData.get("honeypot") as string) || undefined,
    };

    if (raw.honeypot) {
        return { success: false, message: "Spam detected." };
    }

    const parsed = eventRegistrationSchema.safeParse(raw);
    if (!parsed.success) {
        return { success: false, message: parsed.error.issues[0].message };
    }

    // TODO: Cappuccino insert to event_registrations collection
    return { success: true, message: "registrationSuccess" };
}
