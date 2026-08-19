import { z } from "zod";
import { ROLES } from "./user.type";

// Vazio = "não alterar" no modo edição; a obrigatoriedade na criação é checada
// manualmente em UserFormSheet (não dá pra expressar "obrigatório só ao criar"
// num schema estático sem resolver dinâmico).
export const userFormSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  role: z.enum(ROLES),
  password: z.string().min(8).optional().or(z.literal("")),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
