import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { addMonths, format, subMonths } from "date-fns";
import { fr, pt, enUS } from "date-fns/locale";
import { AltArrowLeftBold, AltArrowRightBold, CalendarBoldDuotone } from "solar-icon-set";
import { EventCard, eventTypeToCardType } from "@/_components/EventCard";
import { buttonVariants } from "@/_components/ui/button";
import { cn, getLocalizedContent } from "@/lib/utils";
import { getEventsByMonth } from "@/lib/data/events";
import type { Locale } from "@/types/common";

const dateLocales = { fr, pt, en: enUS } as const;

// Sem cache de rota nenhum: a navegação entre meses precisa bater na API a cada clique,
// nunca reaproveitar uma resposta de um mês anterior.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("events");
  return {
    title: t("title"),
    description: t("upcoming"),
  };
}

type PageProps = {
  searchParams: Promise<{ month?: string }>;
};

// `month` na URL é "YYYY-MM" (1-indexado, legível) — só por dentro vira o `Date` 0-indexado
// que `getEventsByMonth` e o resto do arquivo esperam.
function parseMonthParam(month: string | undefined): Date {
  if (month) {
    const [yearStr, monthStr] = month.split("-");
    const year = Number(yearStr);
    const monthIndex = Number(monthStr) - 1;
    if (Number.isInteger(year) && monthIndex >= 0 && monthIndex <= 11) {
      return new Date(year, monthIndex, 1);
    }
  }
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function formatMonthParam(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default async function EventsPage({ searchParams }: PageProps) {
  const t = await getTranslations("events");
  const tTypes = await getTranslations("events.types");
  const locale = (await getLocale()) as Locale;
  const dateLocale = dateLocales[locale] ?? fr;
  const params = await searchParams;

  const currentMonth = parseMonthParam(params.month);
  const events = await getEventsByMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  const arrowClassName = cn(
    buttonVariants({ variant: "outline", size: "icon" }),
    "border-dust-grey bg-white text-coffee-bean hover:border-toffee-brown/50 hover:bg-white hover:text-night-bordeaux-2"
  );

  return (
    <main className="flex flex-1 flex-col">
      {/* Bloco bordeaux do topo: título centralizado no tamanho padrão de h1, mesmo
          tratamento do hero de /events/[slug] — foto de fundo + overlay bordeaux. */}
      <section className="relative flex min-h-[50svh] flex-col justify-center bg-night-bordeaux-2 pb-16 pt-32 md:pb-20 md:pt-40">
        <Image
          src="/images/inside-church.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 bg-night-bordeaux-2/80" />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-serif font-bold text-parchment">{t("title")}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-parchment/75">
            {t("upcoming")}
          </p>
        </div>
      </section>

      <section className="flex flex-1 flex-col bg-parchment py-16 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-4">
          {/* Cabeçalho de seção idêntico ao de /sermons e /podcast: ícone + rótulo
              maiúsculo + régua, não o SectionLabel centralizado do blog. */}
          <div className="flex items-center gap-3">
            <CalendarBoldDuotone size={18} color="var(--night-bordeaux-2)" />
            <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.25em] text-night-bordeaux-2">
              {t("allEvents")}
            </p>
            <span className="h-px flex-1 bg-night-bordeaux-2/15" />
          </div>

          {/* Par colado, mesmo padrão do EventsCalendar do admin, só recolorido pra
              acompanhar a paleta das outras listagens públicas. */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href={`/${locale}/events?month=${formatMonthParam(subMonths(currentMonth, 1))}`}
              aria-label={t("previousMonth")}
              className={arrowClassName}
              scroll={false}
            >
              <AltArrowLeftBold size={16} />
            </Link>

            <p className="min-w-[9ch] text-center font-serif text-xl font-bold text-night-bordeaux-2 capitalize">
              {format(currentMonth, "LLLL yyyy", { locale: dateLocale })}
            </p>

            <Link
              href={`/${locale}/events?month=${formatMonthParam(addMonths(currentMonth, 1))}`}
              aria-label={t("nextMonth")}
              className={arrowClassName}
              scroll={false}
            >
              <AltArrowRightBold size={16} />
            </Link>
          </div>

          {events.length === 0 ? (
            <p className="mt-12 text-center font-serif italic text-coffee-bean/50">
              {t("noEvents")}
            </p>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {events.map((event) => (
                <EventCard
                  // `_id` sozinho não é único aqui: um evento recorrente (ex. culto semanal)
                  // devolve várias ocorrências com o mesmo `_id` e `startDate` diferente — sem
                  // isso, o React confunde as ocorrências ao trocar de mês (chaves duplicadas).
                  key={`${event._id}-${event.startDate}`}
                  date={new Date(event.startDate)}
                  type={eventTypeToCardType[event.eventType]}
                  title={getLocalizedContent(event.title, locale)}
                  location={event.location?.name || event.customAddress || ""}
                  description={getLocalizedContent(event.description, locale)}
                  href={`/${locale}/events/${event.slug}`}
                  locale={locale}
                  typeLabel={tTypes(event.eventType)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
