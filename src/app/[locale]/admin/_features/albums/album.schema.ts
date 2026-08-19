import { z } from "zod";

// Só o francês, mesmo motivo do form de Podcasts/Sermons/Categories: conteúdo por ora é FR-only.
// Cobre só metadados — a lista de imagens é editada à parte, pelo seletor da Médiathèque.
export const albumFormSchema = z.object({
  title: z.object({ fr: z.string().trim().min(1) }),
  description: z.string().trim().optional(),
});

export type AlbumFormValues = z.infer<typeof albumFormSchema>;
