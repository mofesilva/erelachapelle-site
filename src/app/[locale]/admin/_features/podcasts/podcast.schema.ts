import { z } from "zod";

// Só o francês, mesmo motivo do form de Sermons/Categories/Events: conteúdo por ora é FR-only.
export const podcastFormSchema = z.object({
  title: z.object({ fr: z.string().trim().min(1) }),
  description: z.string().trim().optional(),
  url: z.string().trim().url(),
  date: z.date(),
});

export type PodcastFormValues = z.infer<typeof podcastFormSchema>;
