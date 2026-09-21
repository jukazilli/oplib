import process from "node:process";

import pg from "pg";

const connectionString = process.env.DATABASE_URL_UNPOOLED;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL_UNPOOLED é obrigatória para verificar a taxonomia.",
  );
}

const ids = {
  post: "30000000-0000-4000-8000-000000000001",
  categoryA: "30000000-0000-4000-8000-000000000002",
  categoryB: "30000000-0000-4000-8000-000000000003",
  tag: "30000000-0000-4000-8000-000000000004",
};
const client = new pg.Client({ connectionString });

try {
  await client.connect();
  await client.query("BEGIN");
  await client.query(
    `INSERT INTO categories (id, name, normalized_name, slug) VALUES
      ($1, 'Categoria sintética', 'categoria sintetica', 'categoria-sintetica'),
      ($2, 'Categoria destino', 'categoria destino', 'categoria-destino')`,
    [ids.categoryA, ids.categoryB],
  );
  await client.query(
    `INSERT INTO tags (id, name, normalized_name, slug)
     VALUES ($1, 'Tag sintética', 'tag sintetica', 'tag-sintetica')`,
    [ids.tag],
  );

  await client.query("SAVEPOINT duplicate_name");
  try {
    await client.query(
      `INSERT INTO categories (name, normalized_name, slug)
       VALUES ('CATEGORIA SINTÉTICA', 'categoria sintetica', 'outra-url')`,
    );
    throw new Error("O nome normalizado duplicado não foi rejeitado.");
  } catch (error) {
    if (!(error instanceof Error) || error.code !== "23505") throw error;
  } finally {
    await client.query("ROLLBACK TO SAVEPOINT duplicate_name");
  }

  await client.query(
    `INSERT INTO posts (id, title, slug, summary, markdown, content_type)
     VALUES ($1, 'Verificação TAX-002', 'verificacao-tax-002', 'Resumo sintético', 'Conteúdo sintético', 'article')`,
    [ids.post],
  );
  await client.query(
    `INSERT INTO post_categories (post_id, category_id) VALUES ($1, $2)`,
    [ids.post, ids.categoryA],
  );
  await client.query(
    `INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)`,
    [ids.post, ids.tag],
  );

  await client.query("SAVEPOINT unsafe_delete");
  try {
    await client.query(`DELETE FROM categories WHERE id = $1`, [ids.categoryA]);
    throw new Error(
      "A exclusão direta de categoria associada não foi rejeitada.",
    );
  } catch (error) {
    if (
      !(error instanceof Error) ||
      (error.code !== "23001" && error.code !== "23503")
    )
      throw error;
  } finally {
    await client.query("ROLLBACK TO SAVEPOINT unsafe_delete");
  }

  await client.query(
    `UPDATE categories SET name = 'Categoria renomeada', normalized_name = 'categoria renomeada', slug = 'categoria-renomeada' WHERE id = $1`,
    [ids.categoryA],
  );
  await client.query(
    `INSERT INTO post_categories (post_id, category_id)
     SELECT post_id, $2 FROM post_categories WHERE category_id = $1
     ON CONFLICT DO NOTHING`,
    [ids.categoryA, ids.categoryB],
  );
  await client.query(`DELETE FROM post_categories WHERE category_id = $1`, [
    ids.categoryA,
  ]);
  await client.query(`DELETE FROM categories WHERE id = $1`, [ids.categoryA]);

  const replacement = await client.query(
    `SELECT count(*)::int AS count FROM post_categories WHERE post_id = $1 AND category_id = $2`,
    [ids.post, ids.categoryB],
  );
  if (replacement.rows[0]?.count !== 1)
    throw new Error("A substituição da categoria não preservou a associação.");

  await client.query(`DELETE FROM post_tags WHERE tag_id = $1`, [ids.tag]);
  await client.query(`DELETE FROM tags WHERE id = $1`, [ids.tag]);
  const removed = await client.query(
    `SELECT count(*)::int AS count FROM post_tags WHERE post_id = $1`,
    [ids.post],
  );
  if (removed.rows[0]?.count !== 0)
    throw new Error("A remoção das associações da tag falhou.");

  await client.query("ROLLBACK");
  console.log(
    "TAX-002 verificada: CRUD, duplicidade, proteção referencial, substituição e remoção aprovados; dados sintéticos revertidos.",
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
