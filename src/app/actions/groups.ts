"use server";

import { groupInterestSchema } from "@/lib/validations/group.schema";

export type GroupInterestResult = {
  success: boolean;
  message: string;
};

export async function submitGroupInterest(
  _prevState: GroupInterestResult | null,
  formData: FormData
): Promise<GroupInterestResult> {
  const raw = {
    groupId: formData.get("groupId") as string,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    message: (formData.get("message") as string) || undefined,
    honeypot: (formData.get("honeypot") as string) || undefined,
  };

  if (raw.honeypot) {
    return { success: false, message: "Spam detected." };
  }

  const parsed = groupInterestSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  // Phase 1: Static — just simulate success
  return { success: true, message: "interestSuccess" };
}
