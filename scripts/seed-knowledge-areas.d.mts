type SeedClient = {
  query: (
    sql: string,
    values: readonly string[],
  ) => Promise<{ rows: Array<Record<string, unknown>> }>;
};

export type CanonicalKnowledgeArea = Readonly<{
  id: string;
  name: string;
  normalizedName: string;
  slug: string;
}>;

export const canonicalKnowledgeAreas: readonly CanonicalKnowledgeArea[];

export function seedKnowledgeAreas(
  client: SeedClient,
): Promise<Array<Record<string, unknown>>>;
