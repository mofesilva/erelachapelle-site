import { FileTextBold, DownloadBold } from "solar-icon-set";
import { formatDate } from "@/lib/utils";
import { displayTitle, resolveMediaAssetUrl, type MediaAsset } from "@/types/media-asset";
import type { Locale } from "@/types/common";

interface FileCardProps {
  file: MediaAsset;
  locale: Locale;
  documentTypeLabel?: string;
}

export function FileCard({ file, locale, documentTypeLabel }: FileCardProps) {
  return (
    <a
      href={resolveMediaAssetUrl(file.url)}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden border border-dust-grey bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
    >
      {/* Preview — sem thumbnail real (é um PDF), só o ícone num fundo neutro. */}
      <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-dust-grey">
        <FileTextBold size={40} color="var(--night-bordeaux-2)" />
        <div className="absolute inset-0 flex items-center justify-center bg-night-bordeaux-2/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center bg-white/90 shadow-md">
            <DownloadBold size={20} color="var(--night-bordeaux-2)" />
          </div>
        </div>
      </div>

      <div className="p-5 md:p-6">
        <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.18em] text-toffee-brown">
          {formatDate(file.createdAt, locale)}
        </p>

        <h6 className="mt-2.5 line-clamp-2 font-serif text-[1.25rem] font-bold leading-[1.3] text-night-bordeaux-2 transition-colors duration-200 group-hover:text-toffee-brown">
          {displayTitle(file, locale)}
        </h6>

        {documentTypeLabel && (
          <div className="mt-4">
            <p className="inline-block border border-toffee-brown/30 px-2.5 py-1 text-[0.6875rem] uppercase tracking-[0.1em] text-coffee-bean/70">
              {documentTypeLabel}
            </p>
          </div>
        )}
      </div>
    </a>
  );
}
