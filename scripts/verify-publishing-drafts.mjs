import process from "node:process";

import pg from "pg";

const connectionString = process.env.DATABASE_URL_UNPOOLED;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL_UNPOOLED é obrigatória para verificar os rascunhos.",
  );
}

const client = new pg.Client({ connectionString });

try {
  await client.connect();
  await client.query("BEGIN");

  const inserted = await client.query(
    `INSERT INTO posts (title, slug, summary, markdown, content_type, status)
     VALUES ('', 'verificacao-pub-001', '', '', NULL, 'draft')
     RETURNING id, status, updated_at`,
  );
  if (inserted.rows[0]?.status !== "draft") {
    throw new Error("O rascunho incompleto não foi persistido como draft.");
  }

  await client.query("SAVEPOINT invalid_publication");
  try {
    await client.query(
      `INSERT INTO posts (title, slug, summary, markdown, content_type, status, published_at)
       VALUES ('', 'verificacao-pub-001-publicada', '', '', NULL, 'published', now())`,
    );
    throw new Error("Conteúdo público incompleto não foi rejeitado.");
  } catch (error) {
    if (!(error instanceof Error) || error.code !== "23514") throw error;
  } finally {
    await client.query("ROLLBACK TO SAVEPOINT invalid_publication");
  }

  await client.query("ROLLBACK");
  console.log(
    "PUB-001 verificada: rascunho incompleto aceito, conteúdo público incompleto rejeitado e dados sintéticos revertidos.",
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
