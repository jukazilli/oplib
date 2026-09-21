import { z } from "zod";

export const draftIdSchema = z.string().uuid();

export const contentTypeValues = [
  "academic_work",
  "article",
  "research",
  "study",
  "reflection",
  "project",
] as const;

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) return true;
    const parsed = z.url().safeParse(value);
    return parsed.success && /^https?:\/\//i.test(value);
  }, "Use um endereço iniciado por http:// ou https://.");

const referenceSchema = z
  .object({
    id: z.union([draftIdSchema, z.literal("")]),
    kind: z.enum(["bibliography", "related_link"]),
    title: z.string().trim().min(1, "Informe o título da referência.").max(300),
    citation: z.string().trim().max(4_000),
    url: optionalUrl,
  })
  .refine((value) => value.citation || value.url, {
    message: "Informe a citação ou o endereço da referência.",
    path: ["citation"],
  });

export const draftInputSchema = z.object({
  id: z.union([draftIdSchema, z.literal("")]),
  version: z.union([z.iso.datetime(), z.literal("")]),
  title: z.string().max(240, "Use no máximo 240 caracteres no título."),
  slug: z.string().trim().max(260, "Use no máximo 260 caracteres no endereço."),
  summary: z.string().max(600, "Use no máximo 600 caracteres no resumo."),
  markdown: z.string().max(200_000, "O conteúdo está grande demais."),
  contentType: z.union([z.enum(contentTypeValues), z.literal("")]),
  areaIds: z.array(draftIdSchema),
  categoryId: z.union([draftIdSchema, z.literal("")]),
  tagIds: z.array(draftIdSchema).max(12, "Use no máximo 12 tags."),
  course: z.string().trim().max(180),
  discipline: z.string().trim().max(180),
  originalDate: z.union([z.iso.date(), z.literal("")]),
  references: z.array(referenceSchema).max(50, "Use no máximo 50 referências."),
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

export const publishInputSchema = draftInputSchema.superRefine(
  (value, context) => {
    const required = [
      ["title", value.title, "Informe o título."],
      ["summary", value.summary, "Informe o resumo."],
      ["markdown", value.markdown, "Escreva o conteúdo."],
    ] as const;
    for (const [field, text, message] of required) {
      if (!text.trim())
        context.addIssue({ code: "custom", path: [field], message });
    }
    if (!value.id || !value.version)
      context.addIssue({
        code: "custom",
        path: ["id"],
        message: "Salve o rascunho antes de publicar.",
      });
    if (!value.contentType)
      context.addIssue({
        code: "custom",
        path: ["contentType"],
        message: "Escolha o tipo de conteúdo.",
      });
    if (!value.areaIds.length)
      context.addIssue({
        code: "custom",
        path: ["areaIds"],
        message: "Escolha pelo menos uma área.",
      });
  },
);

export function parseDraftInput(formData: FormData) {
  let cover: unknown = null;
  let references: unknown = [];
  try {
    const serializedCover = formData.get("cover");
    cover = serializedCover ? JSON.parse(String(serializedCover)) : null;
  } catch {
    cover = undefined;
  }
  try {
    references = JSON.parse(String(formData.get("references") ?? "[]"));
  } catch {
    references = undefined;
  }
  return draftInputSchema.safeParse({
    id: formData.get("id"),
    version: formData.get("version"),
    title: formData.get("title"),
    slug: formData.get("slug") ?? "",
    summary: formData.get("summary") ?? "",
    markdown: formData.get("markdown"),
    contentType: formData.get("contentType") ?? "",
    areaIds: formData.getAll("areaIds"),
    categoryId: formData.get("categoryId") ?? "",
    tagIds: formData.getAll("tagIds"),
    course: formData.get("course") ?? "",
    discipline: formData.get("discipline") ?? "",
    originalDate: formData.get("originalDate") ?? "",
    references,
    cover,
  });
}

export function parsePublishInput(formData: FormData) {
  const draft = parseDraftInput(formData);
  return draft.success ? publishInputSchema.safeParse(draft.data) : draft;
}
