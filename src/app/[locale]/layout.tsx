import type { Metadata, Viewport } from "next";
import { Outfit, Libre_Baskerville } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
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
  description: "Rassemblés autour de la Parole de Dieu",
  metadataBase: new URL("https://erelachapelle.fr"),
  openGraph: {
    type: "website",
    siteName: "Église Réformée Évangélique La Chapelle",
    locale: "fr_FR",
    alternateLocale: ["pt_BR", "en_US"],
    images: [
      {
        url: "/images/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Église Réformée Évangélique La Chapelle",
      },
    ],
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

  return (
    <html lang={locale}>
      <body
        className={`${outfit.variable} ${libreBaskerville.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
