import Link from "next/link";
import { ArrowLeftBold } from "solar-icon-set";
import type { ReactNode } from "react";

type BackLinkProps = {
  href: string;
  children: ReactNode;
};

// Link "voltar" usado no hero de todas as páginas de detalhe (artigo, evento,
// pregação, galeria, pastor). Sempre posicionar dentro de um wrapper
// `mx-auto max-w-7xl px-4` — mesma largura do Header — pra alinhar com o
// logo/menu em vez de colar na borda da viewport.
export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 bg-carbon-black/40 px-3 py-1.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-parchment backdrop-blur-sm transition-colors hover:bg-carbon-black/60"
    >
      <ArrowLeftBold size={12} color="currentColor" />
      {children}
    </Link>
  );
}
