import process from "node:process";

import pg from "pg";

const connectionString = process.env.DATABASE_URL_UNPOOLED;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL_UNPOOLED é obrigatória para analisar a pesquisa pública.",
  );
}

const client = new pg.Client({ connectionString });

function collectNodeTypes(plan, types = new Set()) {
  types.add(plan["Node Type"]);
  for (const child of plan.Plans ?? []) collectNodeTypes(child, types);
  return [...types].sort();
}

function sanitizePlan(label, explainResult) {
  const report = explainResult.rows[0]["QUERY PLAN"][0];
  const plan = report.Plan;
  return {
    label,
    planningMs: Number(report["Planning Time"].toFixed(3)),
    executionMs: Number(report["Execution Time"].toFixed(3)),
    returnedRows: plan["Actual Rows"],
    sharedHitBlocks: plan["Shared Hit Blocks"] ?? 0,
    sharedReadBlocks: plan["Shared Read Blocks"] ?? 0,
    nodeTypes: collectNodeTypes(plan),
  };
}

const representativeSql = `
  select
    split_part(trim(p.title), ' ', 1) as term,
    p.content_type::text as content_type,
    extract(year from p.published_at)::int as publication_year,
    (select ka.slug
      from post_knowledge_areas pka
      inner join knowledge_areas ka on ka.id = pka.knowledge_area_id
      where pka.post_id = p.id limit 1) as area_slug,
    (select c.slug
      from post_categories pc
      inner join categories c on c.id = pc.category_id
      where pc.post_id = p.id limit 1) as category_slug,
    (select t.slug
      from post_tags pt
      inner join tags t on t.id = pt.tag_id
      where pt.post_id = p.id limit 1) as tag_slug
  from posts p
  where p.status = 'published'
  order by p.published_at desc, p.id desc
  limit 1
`;

const whereSql = `
  p.status = 'published'
  and ($1 = '' or p.title ilike $2 or p.summary ilike $2 or p.markdown ilike $2)
  and ($3::content_type is null or p.content_type = $3::content_type)
  and ($4::int is null or extract(year from p.published_at) = $4::int)
  and ($5 = '' or exists (
    select 1 from post_knowledge_areas pka
    inner join knowledge_areas ka on ka.id = pka.knowledge_area_id
    where pka.post_id = p.id and ka.slug = $5
  ))
  and ($6 = '' or exists (
    select 1 from post_categories pc
    inner join categories c on c.id = pc.category_id
    where pc.post_id = p.id and c.slug = $6
  ))
  and ($7 = '' or exists (
    select 1 from post_tags pt
    inner join tags t on t.id = pt.tag_id
    where pt.post_id = p.id and t.slug = $7
  ))
`;

try {
  await client.connect();
  await client.query("begin transaction read only");

  const counts = await client.query(`
    select
      count(*)::int as total,
      count(*) filter (where status = 'published')::int as published
    from posts
  `);
  const representative = await client.query(representativeSql);

  if (!representative.rows[0]) {
    console.log(
      JSON.stringify({
        status: "insufficient-data",
        totalPosts: counts.rows[0].total,
        publishedPosts: counts.rows[0].published,
      }),
    );
    process.exitCode = 2;
  } else {
    const sample = representative.rows[0];
    const term = sample.term?.length >= 3 ? sample.term : "";
    const values = [
      term,
      term ? `%${term}%` : "",
      sample.content_type,
      sample.publication_year,
      sample.area_slug ?? "",
      sample.category_slug ?? "",
      sample.tag_slug ?? "",
    ];
    const countPlan = await client.query(
      `explain (analyze, buffers, format json)
       select count(*) from posts p where ${whereSql}`,
      values,
    );
    const pagePlan = await client.query(
      `explain (analyze, buffers, format json)
       select p.id, p.slug, p.title, p.summary, p.markdown, p.content_type,
              p.published_at, p.cover_asset_id
       from posts p
       left join cover_assets ca on ca.id = p.cover_asset_id
       where ${whereSql}
       order by p.published_at desc, p.id desc
       limit 20 offset 0`,
      values,
    );

    console.log(
      JSON.stringify(
        {
          status: "measured",
          totalPosts: counts.rows[0].total,
          publishedPosts: counts.rows[0].published,
          activeFilters: {
            term: Boolean(term),
            contentType: Boolean(sample.content_type),
            year: Boolean(sample.publication_year),
            area: Boolean(sample.area_slug),
            category: Boolean(sample.category_slug),
            tag: Boolean(sample.tag_slug),
          },
          plans: [
            sanitizePlan("count", countPlan),
            sanitizePlan("page", pagePlan),
          ],
        },
        null,
        2,
      ),
    );
  }
} finally {
  try {
    await client.query("rollback");
  } finally {
    await client.end();
  }
}
