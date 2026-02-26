"use server";

import { newsletterSchema } from "@/lib/validations/newsletter.schema";

export type NewsletterResult = {
  success: boolean;
  message: string;
};

export async function subscribeNewsletter(
  _prevState: NewsletterResult | null,
  formData: FormData
): Promise<NewsletterResult> {
  const raw = {
    email: formData.get("email") as string,
    locale: formData.get("locale") as string,
    honeypot: (formData.get("honeypot") as string) || undefined,
  };

  if (raw.honeypot) {
    return { success: false, message: "Spam detected." };
  }

  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  // Phase 1: Static — just simulate success
  // Phase 2: Cappuccino insert to newsletter_subscribers
  return { success: true, message: "newsletterSuccess" };
}
