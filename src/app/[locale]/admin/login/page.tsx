import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "./LoginForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("admin.login");
  return { title: t("title") };
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src="/images/inside-church.jpg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-night-bordeaux/80" />

      <Image
        src="/logos/logo_white_h.png"
        alt="Église Réformée Évangélique La Chapelle"
        width={200}
        height={112}
        className="absolute right-6 bottom-6 z-10 h-10 w-auto opacity-90 md:h-12"
      />

      <div className="relative z-10 flex w-full justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
