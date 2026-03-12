import type { Metadata, Viewport } from "next";
import { Outfit, Libre_Baskerville } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { serializeAuthState } from "@cappuccino/web-sdk";
import { routing } from "@/i18n/routing";
import { getServerClient } from "@/lib/cappuccino/server";
import { CappuccinoClientProvider } from "@/lib/cappuccino/client";
import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";
import { SmoothScroll } from "@/_components/SmoothScroll";


const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Église Réformée Évangélique La Chapelle",
    template: "%s | Église Réformée Évangélique La Chapelle",
  },
  description: "Communauté chrétienne dans les Cévennes",
  metadataBase: new URL("https://erelachapelle.fr"),
  openGraph: {
    type: "website",
    siteName: "Église Réformée Évangélique La Chapelle",
    locale: "fr_FR",
    alternateLocale: ["pt_BR", "en_US"],
  },
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "fr" | "pt" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  // Hydrate Cappuccino auth state from server cookies
  const { authManager, storage } = await getServerClient();
  await authManager.initialize();

  const [token, refreshToken] = await Promise.all([
    storage.getAccessToken(),
    storage.getRefreshToken(),
  ]);

  const initialAuthState = serializeAuthState({
    user: authManager.getUser(),
    token,
    refreshToken,
  });

  return (
    <html lang={locale}>
      <body
        className={`${outfit.variable} ${libreBaskerville.variable} font-sans antialiased`}
      >
        <CappuccinoClientProvider initialAuthState={initialAuthState}>
          <NextIntlClientProvider messages={messages}>
            <SmoothScroll />
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </CappuccinoClientProvider>
      </body>
    </html>
  );
}
