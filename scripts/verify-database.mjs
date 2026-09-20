import process from "node:process";

import pg from "pg";

const connectionString = process.env.DATABASE_URL_UNPOOLED;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL_UNPOOLED é obrigatória para verificar o banco.",
  );
}

const client = new pg.Client({ connectionString });

async function expectSqlState(name, sql, values, expectedCode) {
  await client.query(`SAVEPOINT ${name}`);

  try {
    await client.query(sql, values);
    throw new Error(`A restrição ${name} não rejeitou a operação.`);
  } catch (error) {
    if (!(error instanceof Error) || error.code !== expectedCode) {
      throw error;
    }
  } finally {
    await client.query(`ROLLBACK TO SAVEPOINT ${name}`);
  }
}

try {
  await client.connect();

  const tables = await client.query(`
    SELECT count(*)::int AS count
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
  `);

  if (tables.rows[0].count !== 14) {
    throw new Error(
      `Esperadas 13 tabelas de domínio e 1 de migrations; encontradas ${tables.rows[0].count}.`,
    );
  }

  const migrations = await client.query(
    'SELECT count(*)::int AS count FROM public."__oplib_migrations"',
  );

  if (migrations.rows[0].count !== 1) {
    throw new Error("A migration inicial não está registrada uma única vez.");
  }

  await client.query("BEGIN");
  const postId = "00000000-0000-4000-8000-000000000006";

  await client.query(
    `INSERT INTO posts (id, title, slug, summary, markdown, content_type)
     VALUES ($1, 'Verificação FND-006', 'verificacao-fnd-006', 'Resumo', 'Conteúdo', 'article')`,
    [postId],
  );

  await expectSqlState(
    "unique_slug",
    `INSERT INTO posts (title, slug, summary, markdown, content_type)
     VALUES ('Duplicado', 'verificacao-fnd-006', 'Resumo', 'Conteúdo', 'article')`,
    [],
    "23505",
  );

  await expectSqlState(
    "foreign_key",
    "INSERT INTO likes (post_id, visitor_hash) VALUES ($1, 'visitante-inexistente')",
    ["00000000-0000-4000-8000-000000000099"],
    "23503",
  );

  await client.query(
    "INSERT INTO likes (post_id, visitor_hash) VALUES ($1, 'visitante-fnd-006')",
    [postId],
  );
  await expectSqlState(
    "unique_like",
    "INSERT INTO likes (post_id, visitor_hash) VALUES ($1, 'visitante-fnd-006')",
    [postId],
    "23505",
  );

  await client.query("ROLLBACK");
  console.log(
    "Banco verificado: 13 tabelas de domínio, migration registrada, unicidades e FK ativas.",
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
