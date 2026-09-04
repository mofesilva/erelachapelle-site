"use client";

import { useTranslations } from "next-intl";
import { LetterBold } from "solar-icon-set";
import { FacebookIcon, WhatsAppIcon } from "@/_components/icons";

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
      icon: <FacebookIcon width={16} height={16} />,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: <WhatsAppIcon width={16} height={16} />,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: <LetterBold size={16} color="currentColor" />,
    },
  ];

  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-[0.8125rem] uppercase tracking-[0.1em] text-coffee-bean/60">
        {t("share")}
      </p>
      <div className="flex items-center gap-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center border border-dust-grey bg-white text-coffee-bean transition-colors hover:border-toffee-brown hover:bg-toffee-brown hover:text-white"
            aria-label={`${t("share")} ${link.label}`}
            title={link.label}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
