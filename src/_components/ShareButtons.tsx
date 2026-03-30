"use client";

import { useTranslations } from "next-intl";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const t = useTranslations("common");

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: "f",
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: "w",
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: "✉",
    },
  ];

  return (
    <div className="flex items-center gap-3">
      <p className="text-muted-foreground">{t("share")}:</p>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center bg-muted text-sm font-semibold text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          aria-label={`${t("share")} ${link.label}`}
          title={link.label}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
