"use server";

import { groupInterestSchema, type GroupInterestResult } from "./model";

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

    // TODO: Cappuccino insert to group_interests collection
    return { success: true, message: "success" };
}
