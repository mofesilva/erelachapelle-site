import Link from "next/link";
import { ArrowRightBold } from "solar-icon-set";

interface SplitButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: "gold" | "burgundy" | "white";
  external?: boolean;
  type?: never;
  disabled?: never;
}

interface SplitButtonSubmitProps {
  href?: never;
  children: React.ReactNode;
  variant?: "gold" | "burgundy" | "white";
  external?: never;
  type: "submit";
  disabled?: boolean;
}

type SplitButtonProps = SplitButtonLinkProps | SplitButtonSubmitProps;

const variants = {
  gold: {
    main: "bg-toffee-brown group-hover/btn:bg-olive-wood text-white",
    arrow: "bg-olive-wood group-hover/btn:bg-olive-wood",
    iconColor: "#fff",
  },
  burgundy: {
    main: "bg-night-bordeaux-2 group-hover/btn:bg-night-bordeaux text-white",
    arrow: "bg-night-bordeaux group-hover/btn:bg-rich-mahogany",
    iconColor: "#fff",
  },
  white: {
    main: "bg-white group-hover/btn:bg-white/90 text-rich-mahogany",
    arrow: "bg-white/80 group-hover/btn:bg-white/70",
    iconColor: "var(--toffee-brown)",
  },
};

const sharedClassName =
  "group/btn inline-flex items-stretch shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5";

function SplitButtonInner({
  children,
  variant = "gold",
}: {
  children: React.ReactNode;
  variant?: "gold" | "burgundy" | "white";
}) {
  const v = variants[variant];
  return (
    <>
      <span
        className={`flex items-center px-8 py-3.5 text-sm font-semibold uppercase tracking-wider transition-colors duration-300 ${v.main}`}
      >
        {children}
      </span>
      <span
        className={`flex items-center justify-center px-4 transition-colors duration-300 ${v.arrow}`}
      >
        <ArrowRightBold
          size={16}
          color={v.iconColor}
          className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
        />
      </span>
    </>
  );
}

export function SplitButton(props: SplitButtonProps) {
  const { children, variant = "gold" } = props;

  if (props.type === "submit") {
    const isDisabled = props.disabled;
    return (
      <div
        role="button"
        tabIndex={0}
        aria-disabled={isDisabled}
        onClick={(e) => {
          if (isDisabled) return;
          const form = (e.currentTarget as HTMLElement).closest("form");
          form?.requestSubmit();
        }}
        onKeyDown={(e) => {
          if (isDisabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const form = (e.currentTarget as HTMLElement).closest("form");
            form?.requestSubmit();
          }
        }}
        className={`${sharedClassName} ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <SplitButtonInner variant={variant}>{children}</SplitButtonInner>
      </div>
    );
  }

  const linkProps = props.external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={props.href}
      className={sharedClassName}
      {...linkProps}
    >
      <SplitButtonInner variant={variant}>{children}</SplitButtonInner>
    </Link>
  );
}
