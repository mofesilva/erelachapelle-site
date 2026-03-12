"use client";

import { type ReactNode, useMemo } from "react";
import {
    ApiClient,
    AuthManager,
    BrowserTokenStorage,
    CappuccinoProvider,
    deserializeAuthState,
    type HydratedAuthState,
} from "@cappuccino/web-sdk";

interface CappuccinoClientProviderProps {
    initialAuthState: string | null;
    children: ReactNode;
}

export function CappuccinoClientProvider({
    initialAuthState,
    children,
}: CappuccinoClientProviderProps) {
    const storage = useMemo(
        () => new BrowserTokenStorage({ prefix: "cappuccino" }),
        []
    );

    const apiClient = useMemo(
        () =>
            new ApiClient({
                baseUrl: process.env.NEXT_PUBLIC_CAPPUCCINO_API_URL!,
                apiKey: process.env.NEXT_PUBLIC_CAPPUCCINO_API_KEY!,
                storage,
            }),
        [storage]
    );

    const authManager = useMemo(
        () => new AuthManager({ apiClient, storage }),
        [apiClient, storage]
    );

    const hydratedState = useMemo<HydratedAuthState>(
        () => deserializeAuthState(initialAuthState),
        [initialAuthState]
    );

    return (
        <CappuccinoProvider
            apiClient={apiClient}
            authManager={authManager}
            initialAuthState={hydratedState}
        >
            {children}
        </CappuccinoProvider>
    );
}
