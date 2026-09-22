import { z } from "zod";

import { contentTypeValues } from "@/modules/publishing/draft-domain";

const optionalSlug = z
  .string()
  .trim()
  .max(140)
  .regex(/^[a-z0-9-]*$/)
  .catch("");

const publicSearchSchema = z.object({
  busca: z.string().trim().max(120).catch(""),
  area: optionalSlug,
  tipo: z.union([z.enum(contentTypeValues), z.literal("")]).catch(""),
  categoria: optionalSlug,
  tag: optionalSlug,
  ano: z
    .union([z.coerce.number().int().min(1900).max(2200), z.literal("")])
    .catch(""),
  ordem: z.enum(["recentes", "antigas"]).catch("recentes"),
  view: z.enum(["feed", "grid"]).catch("feed"),
  pagina: z.coerce.number().int().min(1).catch(1),
});

export type PublicSearch = z.infer<typeof publicSearchSchema>;

export function parsePublicSearch(
  input: Record<string, string | string[] | undefined>,
) {
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;
  return publicSearchSchema.parse({
    busca: first(input.busca) ?? "",
    area: first(input.area) ?? "",
    tipo: first(input.tipo) ?? "",
    categoria: first(input.categoria) ?? "",
    tag: first(input.tag) ?? "",
    ano: first(input.ano) ?? "",
    ordem: first(input.ordem) ?? "recentes",
    view: first(input.view) ?? "feed",
    pagina: first(input.pagina) ?? 1,
  });
}
