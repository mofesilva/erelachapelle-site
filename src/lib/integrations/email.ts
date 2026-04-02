import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL || "erelachapelle@orange.fr";

const FROM_ADDRESS =
  process.env.EMAIL_FROM || "Église La Chapelle <onboarding@resend.dev>";

interface ContactEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
}: ContactEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: [
        `Nouveau message de contact`,
        ``,
        `Nom: ${name}`,
        `Email: ${email}`,
        `Sujet: ${subject}`,
        ``,
        `Message:`,
        message,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Email send failed:", err);
    return { success: false, error: "Failed to send email" };
  }
}
