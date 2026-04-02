import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Église Réformée Évangélique La Chapelle",
  description: "Église Réformée Évangélique La Chapelle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
