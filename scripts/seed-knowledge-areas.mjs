import process from "node:process";
import { pathToFileURL } from "node:url";

import pg from "pg";

export const canonicalKnowledgeAreas = Object.freeze([
  Object.freeze({
    id: "10000000-0000-4000-8000-000000000001",
    name: "Engenharia de Software",
    normalizedName: "engenharia de software",
    slug: "engenharia-de-software",
  }),
  Object.freeze({
    id: "10000000-0000-4000-8000-000000000002",
    name: "Educação Física",
    normalizedName: "educacao fisica",
    slug: "educacao-fisica",
  }),
  Object.freeze({
    id: "10000000-0000-4000-8000-000000000003",
    name: "Interdisciplinar",
    normalizedName: "interdisciplinar",
    slug: "interdisciplinar",
  }),
]);

export async function seedKnowledgeAreas(client) {
  const values = canonicalKnowledgeAreas.flatMap((area) => [
    area.id,
    area.name,
    area.normalizedName,
    area.slug,
  ]);
  const tuples = canonicalKnowledgeAreas
    .map(
      (_, index) =>
        `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`,
    )
    .join(", ");
  const result = await client.query(
    `INSERT INTO knowledge_areas (id, name, normalized_name, slug)
     VALUES ${tuples}
     ON CONFLICT (slug) DO UPDATE
       SET name = EXCLUDED.name,
           normalized_name = EXCLUDED.normalized_name,
           updated_at = now()
       WHERE knowledge_areas.name IS DISTINCT FROM EXCLUDED.name
          OR knowledge_areas.normalized_name IS DISTINCT FROM EXCLUDED.normalized_name
     RETURNING id, name, normalized_name, slug`,
    values,
  );
  return result.rows;
}

async function main() {
  const connectionString = process.env.DATABASE_URL_UNPOOLED;
  if (!connectionString)
    throw new Error(
      "DATABASE_URL_UNPOOLED é obrigatória para executar o seed.",
    );
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    await client.query("BEGIN");
    const changed = await seedKnowledgeAreas(client);
    await client.query("COMMIT");
    console.log(
      `Áreas canônicas verificadas: ${canonicalKnowledgeAreas.length}; alteradas: ${changed.length}.`,
    );
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* conexão pode ter falhado antes da transação */
    }
    throw error;
  } finally {
    await client.end();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  await main();
