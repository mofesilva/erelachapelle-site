"use server";

import { contactSchema } from "@/lib/validations/contact.schema";
import { sendContactEmail } from "@/lib/integrations/email";

export type ContactResult = {
  success: boolean;
  message: string;
};

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

  const result = await sendContactEmail(parsed.data);

  if (!result.success) {
    return { success: false, message: "error" };
  }

  return { success: true, message: "success" };
}
