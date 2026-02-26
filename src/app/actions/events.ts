"use server";

import { eventRegistrationSchema } from "@/lib/validations/event.schema";

export type RegistrationResult = {
  success: boolean;
  message: string;
};

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

  // Honeypot spam check
  if (raw.honeypot) {
    return { success: false, message: "Spam detected." };
  }

  const parsed = eventRegistrationSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  // Phase 1: Static — just simulate success
  // Phase 2: Cappuccino insert to event_registrations collection
  return { success: true, message: "registrationSuccess" };
}
