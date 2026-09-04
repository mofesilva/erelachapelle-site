import { z } from "zod";

// Só o francês por ora, como em categories: `tasks.md:54` define que o conteúdo é FR-only
// e pt/en ficam vazios usando fallback (`displayTitle`).
export const mediaAssetTitleFormSchema = z.object({
  title: z.object({
    fr: z.string().trim().min(1),
  }),
});

export type MediaAssetTitleFormValues = z.infer<typeof mediaAssetTitleFormSchema>;
