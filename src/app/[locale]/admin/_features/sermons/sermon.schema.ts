import { z } from "zod";
import { extractYouTubeVideoId } from "@/lib/integrations/youtube";

// Só o francês, mesmo motivo do form de Categories/Events: conteúdo por ora é FR-only.
export const sermonFormSchema = z.object({
  title: z.object({ fr: z.string().trim().min(1) }),
  preacher: z.string().trim().min(1),
  date: z.date(),
  // O pastor cola o link completo do YouTube; aqui a gente extrai e guarda só o ID,
  // que é o que o banco de dados e as páginas públicas sempre esperaram.
  youtubeVideoId: z
    .string()
    .trim()
    .min(1)
    .transform((value, ctx) => {
      const id = extractYouTubeVideoId(value);
      if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Lien YouTube invalide. Colle le lien complet de la vidéo.",
        });
        return z.NEVER;
      }
      return id;
    }),
  biblicalReference: z.object({
    book: z.string().trim().optional(),
    // String, não número: mesmo motivo do `capacity` em event.schema.ts — input nativo manda
    // string vazia quando limpo, então validar o formato aqui é mais simples que coagir via zod.
    chapter: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || /^[1-9]\d*$/.test(value)),
    verses: z.string().trim().optional(),
  }),
  categoryIds: z.array(z.string()),
  themeIds: z.array(z.string()),
});

export type SermonFormValues = z.infer<typeof sermonFormSchema>;
