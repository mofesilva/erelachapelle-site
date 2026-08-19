import type { Locale } from "@/types/common";

/**
 * pt/en são opcionais aqui — diferente de `MultilingualText` em `@/types/common`, que exige
 * os três. Quem manda é a API: `multilingualTextSchema` só obriga `fr`, e o `ignoreUndefined`
 * do driver faz os idiomas não preenchidos virem ausentes do documento, não vazios.
 */
export type LocalizedText = {
  fr: string;
  pt?: string;
  en?: string;
};

export type UserRef = {
  id: string;
  name: string;
};

export function localizedText(text: LocalizedText, locale: Locale): string {
  return text[locale] || text.fr;
}
