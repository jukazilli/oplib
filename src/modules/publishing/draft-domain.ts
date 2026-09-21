import { z } from "zod";

export const draftIdSchema = z.string().uuid();

export const draftInputSchema = z.object({
  id: z.union([draftIdSchema, z.literal("")]),
  version: z.union([z.iso.datetime(), z.literal("")]),
  title: z.string().max(240, "Use no máximo 240 caracteres no título."),
  markdown: z.string().max(200_000, "O conteúdo está grande demais."),
  categoryId: z.union([draftIdSchema, z.literal("")]),
  tagIds: z.array(draftIdSchema).max(12, "Use no máximo 12 tags."),
  cover: z
    .object({
      pathname: z.string().min(1),
      url: z.url(),
      altText: z.string().trim().min(1, "Descreva a imagem de capa.").max(300),
      contentType: z.string().min(1).max(100),
      sizeBytes: z.number().int().positive(),
      width: z.number().int().positive().nullable(),
      height: z.number().int().positive().nullable(),
    })
    .nullable(),
});

export type DraftInput = z.infer<typeof draftInputSchema>;

export function parseDraftInput(formData: FormData) {
  let cover: unknown = null;
  try {
    const serializedCover = formData.get("cover");
    cover = serializedCover ? JSON.parse(String(serializedCover)) : null;
  } catch {
    cover = undefined;
  }
  return draftInputSchema.safeParse({
    id: formData.get("id"),
    version: formData.get("version"),
    title: formData.get("title"),
    markdown: formData.get("markdown"),
    categoryId: formData.get("categoryId") ?? "",
    tagIds: formData.getAll("tagIds"),
    cover,
  });
}
