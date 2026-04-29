import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Église Réformée Évangélique La Chapelle",
  description: "Rassemblés autour de la Parole de Dieu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
