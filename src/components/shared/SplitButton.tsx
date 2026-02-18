import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SplitButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "gold" | "burgundy" | "white";
  external?: boolean;
}

const variants = {
  gold: {
    main: "bg-[#8C5E35] group-hover/btn:bg-[#A67342] text-white",
    arrow: "bg-[#A67342] group-hover/btn:bg-[#B8844F]",
    icon: "text-white",
  },
  burgundy: {
    main: "bg-[#643036] group-hover/btn:bg-[#7D1A2E] text-white",
    arrow: "bg-[#7D1A2E] group-hover/btn:bg-[#8C2A3D]",
    icon: "text-white",
  },
  white: {
    main: "bg-white group-hover/btn:bg-white/90 text-[#3D000A]",
    arrow: "bg-white/80 group-hover/btn:bg-white/70",
    icon: "text-[#8C5E35]",
  },
};

export function SplitButton({
  href,
  children,
  variant = "gold",
  external = false,
}: SplitButtonProps) {
  const v = variants[variant];
  const linkProps = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={href}
      className="group/btn inline-flex items-stretch shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
      {...linkProps}
    >
      <span
        className={`flex items-center px-8 py-3.5 text-sm font-semibold uppercase tracking-wider transition-colors duration-300 ${v.main}`}
      >
        {children}
      </span>
      <span
        className={`flex items-center justify-center px-4 transition-colors duration-300 ${v.arrow}`}
      >
        <ArrowRight
          className={`h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 ${v.icon}`}
        />
      </span>
    </Link>
  );
}
