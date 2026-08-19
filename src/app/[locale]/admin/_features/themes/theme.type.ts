import type { LocalizedText, UserRef } from "../../_lib/localized-text";

/** O documento como `GET /themes` devolve (datas chegam como string ISO no JSON). */
export type Theme = {
  _id: string;
  name: LocalizedText;
  slug: string;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: UserRef;
  updatedBy: UserRef;
};
