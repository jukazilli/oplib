import { randomUUID } from "node:crypto";

import pg from "pg";

const { Client } = pg;

if (process.env.ALLOW_PREVIEW_DB_WRITE !== "1") {
  throw new Error(
    "Refusing the publishing drill without ALLOW_PREVIEW_DB_WRITE=1.",
  );
}

const connectionString =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL is required.");
}

const postId = randomUUID();
const rollbackPostId = randomUUID();
const administratorKey = `preview-publishing-drill-${randomUUID()}`;
const slug = `preview-publishing-drill-${randomUUID()}`;
const rollbackSlug = `preview-publishing-rollback-${randomUUID()}`;
const first = new Client({ connectionString });
const second = new Client({ connectionString });
const cleanup = new Client({ connectionString });

async function removeSyntheticRecords() {
  await cleanup.query("begin");
  try {
    await cleanup.query(
      "delete from audit_events where entity_id = any($1::uuid[])",
      [[postId, rollbackPostId]],
    );
    await cleanup.query("delete from posts where id = any($1::uuid[])", [
      [postId, rollbackPostId],
    ]);
    await cleanup.query(
      "delete from admin_identities where clerk_user_id = $1",
      [administratorKey],
    );
    await cleanup.query("commit");
  } catch (error) {
    await cleanup.query("rollback");
    throw error;
  }
}

await Promise.all([first.connect(), second.connect(), cleanup.connect()]);

try {
  await removeSyntheticRecords();

  const areaResult = await first.query(
    "select id from knowledge_areas order by id limit 1",
  );
  const areaId = areaResult.rows[0]?.id;
  if (!areaId) throw new Error("The Preview database has no knowledge area.");

  const initial = await first.query(
    `insert into posts (
      id, title, slug, summary, markdown, content_type, status,
      created_at, updated_at
    ) values ($1, $2, $3, $4, $5, 'article', 'draft', now(), now())
    returning updated_at`,
    [
      postId,
      "Preview publishing transaction drill",
      slug,
      "Synthetic record used only to verify the Preview transaction.",
      "Synthetic content used only by the publishing transaction drill.",
    ],
  );
  const initialVersion = initial.rows[0]?.updated_at;
  if (!initialVersion) throw new Error("The synthetic draft was not created.");

  await first.query(
    "insert into post_knowledge_areas (post_id, knowledge_area_id) values ($1, $2)",
    [postId, areaId],
  );

  await first.query("begin");
  const published = await first.query(
    `update posts
      set status = 'published', published_at = now(), updated_at = now()
      where id = $1
        and status = 'draft'
        and updated_at >= $2::timestamptz
        and updated_at < $2::timestamptz + interval '1 millisecond'
      returning updated_at`,
    [postId, initialVersion],
  );
  if (published.rowCount !== 1) {
    throw new Error("The guarded publication did not update one row.");
  }

  const identity = await first.query(
    `insert into admin_identities (clerk_user_id, created_at, updated_at)
      values ($1, now(), now())
      on conflict (clerk_user_id) do update set updated_at = now()
      returning id`,
    [administratorKey],
  );
  await first.query(
    `insert into audit_events (
      admin_identity_id, action, entity_type, entity_id, result
    ) values ($1, 'publication.publish', 'publication', $2, 'success')`,
    [identity.rows[0].id, postId],
  );

  const competing = second.query(
    `update posts
      set status = 'published', published_at = now(), updated_at = now()
      where id = $1
        and status = 'draft'
        and updated_at >= $2::timestamptz
        and updated_at < $2::timestamptz + interval '1 millisecond'
      returning id`,
    [postId, initialVersion],
  );

  await first.query("commit");
  const competingResult = await competing;
  if (competingResult.rowCount !== 0) {
    throw new Error("The stale competing publication was not rejected.");
  }

  const committed = await first.query(
    `select
      count(*) filter (where p.status = 'published' and p.published_at is not null)::int as published,
      count(distinct ae.id)::int as audits,
      count(distinct pka.knowledge_area_id)::int as areas
    from posts p
    left join audit_events ae on ae.entity_id = p.id
      and ae.action = 'publication.publish'
      and ae.result = 'success'
    left join post_knowledge_areas pka on pka.post_id = p.id
    where p.id = $1`,
    [postId],
  );
  const committedRow = committed.rows[0];
  if (
    committedRow?.published !== 1 ||
    committedRow?.audits !== 1 ||
    committedRow?.areas !== 1
  ) {
    throw new Error("The committed publication invariants were not preserved.");
  }

  await first.query("begin");
  try {
    await first.query(
      `insert into posts (
        id, title, slug, summary, markdown, content_type, status,
        published_at, created_at, updated_at
      ) values ($1, $2, $3, $4, $5, 'article', 'published', now(), now(), now())`,
      [
        rollbackPostId,
        "Preview publishing rollback drill",
        rollbackSlug,
        "Synthetic record used only to verify rollback.",
        "Synthetic content used only by the publishing rollback drill.",
      ],
    );
    await first.query(
      `insert into audit_events (
        admin_identity_id, action, entity_type, entity_id, result
      ) values ($1, 'publication.publish', 'publication', $2, 'invalid')`,
      [identity.rows[0].id, rollbackPostId],
    );
    throw new Error("The invalid audit event unexpectedly succeeded.");
  } catch (error) {
    await first.query("rollback");
    if (error.message === "The invalid audit event unexpectedly succeeded.") {
      throw error;
    }
  }

  const rolledBack = await first.query(
    "select count(*)::int as count from posts where id = $1",
    [rollbackPostId],
  );
  if (rolledBack.rows[0]?.count !== 0) {
    throw new Error("The failed transaction left a synthetic publication.");
  }

  await removeSyntheticRecords();
  const residue = await cleanup.query(
    `select
      (select count(*) from posts where id = any($1::uuid[]))::int as posts,
      (select count(*) from audit_events where entity_id = any($1::uuid[]))::int as audits,
      (select count(*) from admin_identities where clerk_user_id = $2)::int as identities`,
    [[postId, rollbackPostId], administratorKey],
  );
  const residueRow = residue.rows[0];
  if (
    residueRow?.posts !== 0 ||
    residueRow?.audits !== 0 ||
    residueRow?.identities !== 0
  ) {
    throw new Error("The publishing drill left synthetic database residue.");
  }

  process.stdout.write(
    `${JSON.stringify({
      result: "passed",
      committedPublication: true,
      auditInTransaction: true,
      staleWriteRejected: true,
      failedTransactionRolledBack: true,
      residue: 0,
    })}\n`,
  );
} finally {
  try {
    await removeSyntheticRecords();
  } finally {
    await Promise.allSettled([first.end(), second.end(), cleanup.end()]);
  }
}
