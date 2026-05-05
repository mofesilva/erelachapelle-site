"use server";

import { contactSchema } from "@/lib/validations/contact.schema";
import { transporter } from "@/lib/integrations/email";

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

  const { name, email, subject, message } = parsed.data;

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: `"${name}" <${email}>`,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
        <body style="margin:0;padding:0;background-color:#f9f4f1;font-family:Georgia,serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f4f1;padding:40px 20px;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-top:4px solid #660019;">

                <!-- Header -->
                <tr>
                  <td style="background-color:#660019;padding:32px 40px;">
                    <p style="margin:0;font-family:Georgia,serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#e2d4cb;">Église Réformée Évangélique</p>
                    <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:22px;font-weight:normal;color:#f9f4f1;letter-spacing:1px;">La Chapelle</h1>
                  </td>
                </tr>

                <!-- Label -->
                <tr>
                  <td style="background-color:#936639;padding:10px 40px;">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#f9f4f1;">Nouvelle demande de contact</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px;">

                    <!-- Sender info -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #e9dfd8;">
                          <span style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#936639;">Nom</span><br/>
                          <span style="font-family:Georgia,serif;font-size:16px;color:#171717;">${name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #e9dfd8;">
                          <span style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#936639;">Email</span><br/>
                          <a href="mailto:${email}" style="font-family:Georgia,serif;font-size:16px;color:#660019;text-decoration:none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #e9dfd8;">
                          <span style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#936639;">Sujet</span><br/>
                          <span style="font-family:Georgia,serif;font-size:16px;color:#171717;">${subject}</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Message -->
                    <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#936639;">Message</p>
                    <div style="background-color:#f9f4f1;border-left:3px solid #936639;padding:20px 24px;">
                      <p style="margin:0;font-family:Georgia,serif;font-size:15px;line-height:1.7;color:#3d0008;white-space:pre-wrap;">${message}</p>
                    </div>

                    <!-- Reply CTA -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
                      <tr>
                        <td align="center">
                          <a href="mailto:${email}" style="display:inline-block;background-color:#660019;color:#f9f4f1;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 32px;">
                            Répondre à ${name}
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#e9dfd8;padding:20px 40px;text-align:center;">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#76522e;letter-spacing:0.5px;">
                      Message reçu via le formulaire de contact du site de l'Église Réformée Évangélique La Chapelle.
                    </p>
                  </td>
                </tr>

              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    });

    return { success: true, message: "success" };
  } catch {
    return { success: false, message: "error" };
  }
}
