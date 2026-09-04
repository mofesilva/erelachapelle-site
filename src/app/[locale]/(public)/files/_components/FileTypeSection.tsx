import Link from "next/link";
import { useTranslations } from "next-intl";
import { FileTextBold, DocumentTextBold, NotebookBoldDuotone, BookBold } from "solar-icon-set";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { MediaAsset, DOCUMENT_TYPES } from "@/types/media-asset";
import type { Locale } from "@/types/common";
import { FileCard } from "./FileCard";

type DocumentType = (typeof DOCUMENT_TYPES)[number];

// Mesma ideia do ZONE_ICON/ZONE_COLOR de /blog — identidade própria por zona do hub.
export const ZONE_ICON: Record<DocumentType, typeof FileTextBold> = {
  bulletin: FileTextBold,
  notes: DocumentTextBold,
  study_guide: NotebookBoldDuotone,
  book: BookBold,
};

export const ZONE_COLOR: Record<DocumentType, string> = {
  bulletin: "var(--night-bordeaux-2)",
  notes: "var(--toffee-brown)",
  study_guide: "var(--olive-wood)",
  book: "var(--coffee-bean)",
};

interface FileTypeSectionProps {
  documentType: DocumentType;
  files: MediaAsset[];
  locale: Locale;
}

/** Uma zona do hub — carrossel, não lista estática; todas as zonas convivem na mesma
 * página. `files` já vem limitado (ver `page.tsx`); "ver tudo" leva pra listagem
 * completa do mesmo tipo, ainda dentro de `/files` (query `?documentType=`). */
export function FileTypeSection({ documentType, files, locale }: FileTypeSectionProps) {
  const t = useTranslations("files");
  const Icon = ZONE_ICON[documentType];

  if (files.length === 0) return null;

  return (
    <div className="mt-16 first:mt-0">
      <div className="flex items-center gap-3">
        <Icon size={18} color={ZONE_COLOR[documentType]} />
        <p
          className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.25em]"
          style={{ color: ZONE_COLOR[documentType] }}
        >
          {t(`documentTypes.${documentType}`)}
        </p>
        <span className="h-px flex-1 bg-night-bordeaux-2/15" />
        <Link
          href={`/${locale}/files?documentType=${documentType}`}
          className="shrink-0 text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-toffee-brown hover:text-night-bordeaux-2"
        >
          {t("seeAllInType")}
        </Link>
      </div>

      <Carousel opts={{ align: "start", dragFree: true }} className="mt-8">
        <CarouselContent>
          {files.map((file) => (
            <CarouselItem key={file._id} className="basis-[85%] sm:basis-1/2 lg:basis-1/3">
              <FileCard file={file} locale={locale} documentTypeLabel={t(`documentTypes.${documentType}`)} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}
