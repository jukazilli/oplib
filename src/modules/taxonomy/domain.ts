import { z } from "zod";

export const taxonomyKindSchema = z.enum(["category", "tag"]);
export type TaxonomyKind = z.infer<typeof taxonomyKindSchema>;

export const taxonomyNameSchema = z
  .string()
  .trim()
  .min(1, "Informe um nome.")
  .max(120, "Use no máximo 120 caracteres.");

export function normalizeTaxonomyName(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("pt-BR");
}

export function slugifyTaxonomyName(value: string) {
  return normalizeTaxonomyName(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseTaxonomyName(value: unknown, kind: TaxonomyKind) {
  const limit = kind === "tag" ? 80 : 120;
  const result = taxonomyNameSchema
    .max(limit, `Use no máximo ${limit} caracteres.`)
    .safeParse(value);

  if (!result.success) {
    return {
      success: false as const,
      error: result.error.issues[0]?.message ?? "Nome inválido.",
    };
  }

  const slug = slugifyTaxonomyName(result.data);
  if (!slug)
    return { success: false as const, error: "Use letras ou números no nome." };

  return {
    success: true as const,
    data: {
      name: result.data,
      normalizedName: normalizeTaxonomyName(result.data),
      slug,
    },
  };
}
