import Link from "next/link";
import type { ReactNode } from "react";
import { PeekRectangle, type PeekColor, type PeekPosition } from "@/_components/PeekRectangle";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  /** Área 16:9 no topo — thumbnail, player ou capa. */
  media: ReactNode;
  /** Linha de contexto acima do título (data, autor, pregador). */
  eyebrow: string;
  title: string;
  excerpt?: string;
  /** Selos abaixo do texto (série, categoria, referência bíblica, contagem). */
  badges?: string[];
  href?: string;
  peekColor?: PeekColor;
  peekPosition?: PeekPosition;
}

/**
 * Card único de conteúdo, usado por prédications, podcast, blog e galerie — mesma
 * anatomia e mesma hierarquia em todas as listagens do site.
 *
 * Os tamanhos de fonte são fixados aqui, e não herdados das tags: a escala global
 * (`globals.css`) é dimensionada para títulos de página — nela um `h6` sai a 22px e um
 * `p` a 18px, ou seja, título e corpo quase empatados dentro de um card. Fixando
 * 20px / 14px o contraste volta a existir e a leitura tem ordem.
 */
export function ContentCard({
  media,
  eyebrow,
  title,
  excerpt,
  badges = [],
  href,
  peekColor = "gold",
  peekPosition = "top-right",
}: ContentCardProps) {
  const body = (
    <>
      <div className="relative aspect-video overflow-hidden bg-dust-grey">{media}</div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.18em] text-toffee-brown">
          {eyebrow}
        </p>

        <h3
          className={cn(
            "mt-3 font-serif text-[1.25rem] font-bold leading-[1.3] text-night-bordeaux-2",
            href && "transition-colors duration-200 group-hover:text-toffee-brown"
          )}
        >
          {title}
        </h3>

        {excerpt && (
          <p className="mt-2 line-clamp-2 text-[0.875rem] leading-[1.6] text-coffee-bean/75">
            {excerpt}
          </p>
        )}

        {badges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 pt-1">
            {badges.map((badge) => (
              <span
                key={badge}
                className="border border-dust-grey px-2.5 py-1 text-[0.6875rem] uppercase tracking-[0.1em] text-coffee-bean/70"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const shell =
    "flex h-full flex-col overflow-hidden border border-dust-grey bg-white shadow-[0_1px_3px_rgba(23,23,23,0.04)]";

  return (
    <PeekRectangle color={peekColor} position={peekPosition} className="h-full">
      {href ? (
        <Link
          href={href}
          className={cn(
            shell,
            "group transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(61,0,8,0.10)]"
          )}
        >
          {body}
        </Link>
      ) : (
        <div className={shell}>{body}</div>
      )}
    </PeekRectangle>
  );
}
