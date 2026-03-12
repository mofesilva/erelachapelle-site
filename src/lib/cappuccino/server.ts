import { cookies } from "next/headers";
import { createCappuccinoServerClient } from "@cappuccino/web-sdk";

export async function getServerClient() {
    if (!process.env.CAPPUCCINO_API_URL || !process.env.CAPPUCCINO_API_KEY) {
        throw new Error("Missing CAPPUCCINO_API_URL or CAPPUCCINO_API_KEY");
    }

    const cookieStore = await cookies();

    return createCappuccinoServerClient({
        baseUrl: process.env.CAPPUCCINO_API_URL,
        apiKey: process.env.CAPPUCCINO_API_KEY,
        cookies: {
            get: (name: string) => cookieStore.get(name),
            set: (name: string, value: string, options?: Record<string, unknown>) =>
                cookieStore.set(name, value, options),
            delete: (name: string) => cookieStore.delete(name),
        },
        cookieOptions: { httpOnly: true, secure: true, sameSite: "lax" },
    });
}
