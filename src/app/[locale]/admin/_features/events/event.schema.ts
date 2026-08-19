import { z } from "zod";
import { EVENT_TYPES } from "./event.type";

// "none" cobre "não repete", que não existe no lado do backend (lá a ausência do campo
// `recurrence` já significa isso) — só faz sentido como opção do <Select> aqui no form.
export const RECURRENCE_FREQUENCY_OPTIONS = ["none", "daily", "weekly", "monthly", "yearly", "custom"] as const;
export const RECURRENCE_END_TYPE_OPTIONS = ["never", "until", "count"] as const;

// Só o francês, mesmo motivo do form de Categories: conteúdo por ora é FR-only.
export const eventFormSchema = z
  .object({
    title: z.object({ fr: z.string().trim().min(1) }),
    description: z.object({ fr: z.string().trim().min(1) }),
    eventType: z.enum(EVENT_TYPES),
    startDate: z.date(),
    endDate: z.date().optional(),
    // Só a exceção — o padrão vem de DEFAULT_LOCATION, não é campo do formulário.
    customAddress: z.string().trim().optional(),
    // Preenchido pelo upload em `EventBannerField`, nunca digitado — só guarda a referência
    // ao MediaAsset já criado. `null` explícito (não `undefined`) pelo mesmo motivo de
    // `recurrence`: precisa dar pra remover um banner já escolhido num PUT parcial.
    featuredImage: z
      .object({
        id: z.string(),
        url: z.string(),
        altText: z.object({ fr: z.string() }).optional(),
      })
      .nullable()
      .optional(),
    // String, não número: input nativo manda string vazia quando limpo, e coagir isso pra
    // número via zod é mais frágil que só validar o formato aqui e converter no service.
    capacity: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || /^[1-9]\d*$/.test(value)),
    // Campos planos (não um objeto de recorrência aninhado): mais simples de ligar a campos
    // condicionais do RHF do que um discriminated union. `event.service.ts#buildRecurrence`
    // traduz isso pro formato aninhado que a API espera.
    recurrenceFrequency: z.enum(RECURRENCE_FREQUENCY_OPTIONS).default("none"),
    recurrenceWeekdays: z.array(z.number().int().min(0).max(6)).optional(),
    recurrenceEndType: z.enum(RECURRENCE_END_TYPE_OPTIONS).optional(),
    recurrenceUntil: z.date().optional(),
    recurrenceCount: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || /^[1-9]\d*$/.test(value)),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    path: ["endDate"],
  })
  .refine((data) => data.recurrenceFrequency !== "custom" || (data.recurrenceWeekdays?.length ?? 0) > 0, {
    message: "Selecione ao menos um dia da semana",
    path: ["recurrenceWeekdays"],
  })
  .refine((data) => data.recurrenceFrequency === "none" || !!data.recurrenceEndType, {
    path: ["recurrenceEndType"],
  })
  .refine((data) => data.recurrenceEndType !== "until" || !!data.recurrenceUntil, {
    path: ["recurrenceUntil"],
  })
  .refine(
    (data) => data.recurrenceEndType !== "count" || /^[1-9]\d*$/.test(data.recurrenceCount ?? ""),
    { path: ["recurrenceCount"] }
  );

export type EventFormValues = z.infer<typeof eventFormSchema>;
