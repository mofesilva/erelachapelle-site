import { z } from "zod";
import { POST_TYPES } from "./post.type";

// Só o francês, mesmo motivo do form de Sermons/Categories/Events: conteúdo por ora é FR-only.
export const postFormSchema = z.object({
  title: z.object({ fr: z.string().trim().min(1) }),
  excerpt: z.object({ fr: z.string().trim().min(1) }),
  content: z.object({ fr: z.string().trim().min(1) }),
  author: z.string().trim().min(1),
  postType: z.enum(POST_TYPES),
  categoryId: z.string().trim().min(1),
  themeIds: z.array(z.string()),
  tags: z.array(z.string()),
  featuredImage: z
    .object({
      id: z.string(),
      url: z.string(),
    })
    .nullable(),
  published: z.boolean(),
  publishedAt: z.date(),
});

export type PostFormValues = z.infer<typeof postFormSchema>;
