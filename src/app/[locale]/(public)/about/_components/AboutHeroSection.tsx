import { getTranslations } from "next-intl/server";
import { CrossDivider } from "@/_components/CrossDivider";

export async function AboutHeroSection() {
  const t = await getTranslations("about");

  return (
    <section className="relative bg-night-bordeaux-2 pb-20 pt-40 md:pb-28 md:pt-48">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0JyBoZWlnaHQ9JzQnPjxyZWN0IHdpZHRoPScxJyBoZWlnaHQ9JzEnIGZpbGw9JyNmZmYnLz48L3N2Zz4=\")",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <CrossDivider variant="gold" className="justify-center" />

        <h1 className="mt-8 font-serif font-bold text-parchment md:mt-10">
          {t("title")}
        </h1>

        <p className="mx-auto mt-5 max-w-2xl font-serif italic leading-relaxed text-powder-petal/60">
          &ldquo;{t("heroQuote")}&rdquo;
          <span className="mt-1 block text-sm font-medium not-italic tracking-wide text-toffee-brown/80">
            — {t("heroQuoteRef")}
          </span>
        </p>

        <div className="mx-auto mt-8 flex items-center justify-center gap-2">
          <div className="h-0.5 w-12 bg-toffee-brown/40" />
          <div className="h-1 w-1 rotate-45 bg-toffee-brown/60" />
          <div className="h-0.5 w-12 bg-toffee-brown/40" />
        </div>
      </div>
    </section>
  );
}
