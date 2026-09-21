import process from "node:process";

import pg from "pg";

import { canonicalKnowledgeAreas } from "./seed-knowledge-areas.mjs";

const connectionString = process.env.DATABASE_URL_UNPOOLED;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL_UNPOOLED é obrigatória para verificar as áreas.",
  );
}

const client = new pg.Client({ connectionString });

try {
  await client.connect();

  const areas = await client.query(
    `SELECT id, name, normalized_name, slug
     FROM knowledge_areas
     WHERE slug = ANY($1::text[])
     ORDER BY slug`,
    [canonicalKnowledgeAreas.map((area) => area.slug)],
  );

  if (areas.rowCount !== canonicalKnowledgeAreas.length) {
    throw new Error("O banco não contém todas as áreas canônicas.");
  }

  await client.query("BEGIN");
  const postId = "20000000-0000-4000-8000-000000000001";
  await client.query(
    `INSERT INTO posts (id, title, slug, summary, markdown, content_type)
     VALUES ($1, 'Verificação TAX-001', 'verificacao-tax-001', 'Resumo sintético', 'Conteúdo sintético', 'article')`,
    [postId],
  );

  const selectedAreas = canonicalKnowledgeAreas.slice(0, 2);
  for (const area of selectedAreas) {
    await client.query(
      `INSERT INTO post_knowledge_areas (post_id, knowledge_area_id)
       VALUES ($1, $2)`,
      [postId, area.id],
    );
  }

  const associations = await client.query(
    `SELECT count(*)::int AS count
     FROM post_knowledge_areas
     WHERE post_id = $1`,
    [postId],
  );
  if (associations.rows[0]?.count !== 2) {
    throw new Error("A associação múltipla de áreas não foi preservada.");
  }

  await client.query("SAVEPOINT duplicate_area");
  try {
    await client.query(
      `INSERT INTO post_knowledge_areas (post_id, knowledge_area_id)
       VALUES ($1, $2)`,
      [postId, selectedAreas[0].id],
    );
    throw new Error("A associação duplicada não foi rejeitada.");
  } catch (error) {
    if (!(error instanceof Error) || error.code !== "23505") throw error;
  } finally {
    await client.query("ROLLBACK TO SAVEPOINT duplicate_area");
  }

  await client.query("ROLLBACK");
  console.log(
    "TAX-001 verificada: 3 áreas canônicas, associação múltipla e duplicidade rejeitada; dados sintéticos revertidos.",
  );
} catch (error) {
  try {
    await client.query("ROLLBACK");
  } catch {
    // A conexão pode ter falhado antes de iniciar a transação.
  }
  throw error;
} finally {
  await client.end();
}
