import { z } from "zod";

export const draftIdSchema = z.string().uuid();

export const draftInputSchema = z.object({
  id: z.union([draftIdSchema, z.literal("")]),
  version: z.union([z.iso.datetime(), z.literal("")]),
  title: z.string().max(240, "Use no máximo 240 caracteres no título."),
  markdown: z.string().max(200_000, "O conteúdo está grande demais."),
});

export type DraftInput = z.infer<typeof draftInputSchema>;

export function parseDraftInput(formData: FormData) {
  return draftInputSchema.safeParse({
    id: formData.get("id"),
    version: formData.get("version"),
    title: formData.get("title"),
    markdown: formData.get("markdown"),
  });
}
