import type { Metadata } from "next";
import { Noto_Sans, Libre_Baskerville } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const notoSans = Noto_Sans({
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

  return (
    <html lang={locale}>
      <body
        className={`${notoSans.variable} ${libreBaskerville.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
