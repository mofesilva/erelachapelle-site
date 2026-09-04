import { z } from "zod";
import { DOCUMENT_TYPES } from "./public-file.type";

const assetSchema = z.object({
  id: z.string(),
  url: z.string(),
  fileType: z.enum(["pdf", "epub"]),
  coverUrl: z.string().optional(),
});

// Só o francês, mesmo motivo do form de Podcasts/Sermons/Categories. `asset` é nullable no
// tipo (estado inicial sem arquivo escolhido), mas o refine barra o submit sem ele — não dá
// pra publicar um arquivo sem arquivo.
export const publicFileFormSchema = z.object({
  title: z.object({ fr: z.string().trim().min(1) }),
  description: z.string().trim().optional(),
  documentType: z.enum(DOCUMENT_TYPES),
  asset: assetSchema.nullable().refine((value) => value !== null),
});

export type PublicFileFormValues = z.infer<typeof publicFileFormSchema>;
