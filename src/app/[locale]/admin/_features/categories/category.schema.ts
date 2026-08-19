import { z } from "zod";

// Só o francês: `tasks.md:54` define que por ora o conteúdo é FR-only e pt/en ficam
// vazios usando fallback. O aninhamento em `name` espelha o corpo que a API espera.
export const categoryFormSchema = z.object({
  name: z.object({
    fr: z.string().trim().min(1),
  }),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
