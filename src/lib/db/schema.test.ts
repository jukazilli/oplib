import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { getTableConfig } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";

import { comments, likes, posts } from "./schema";

const migration = readFileSync(
  resolve(process.cwd(), "drizzle/0000_even_tigra.sql"),
  "utf8",
);
const draftMigration = readFileSync(
  resolve(process.cwd(), "drizzle/0001_broken_frank_castle.sql"),
  "utf8",
);

describe("schema inicial", () => {
  it("materializa as tabelas e enums do modelo aprovado", () => {
    expect(migration.match(/CREATE TABLE/g)).toHaveLength(13);
    expect(migration.match(/CREATE TYPE/g)).toHaveLength(4);
    expect(migration).not.toContain("CREATE EXTENSION");
  });

  it("protege slug e curtida contra duplicação", () => {
    expect(migration).toContain('CREATE UNIQUE INDEX "posts_slug_unique"');
    expect(migration).toContain(
      'CREATE UNIQUE INDEX "likes_post_visitor_unique"',
    );

    const likeConfig = getTableConfig(likes);
    expect(likeConfig.foreignKeys).toHaveLength(1);
  });

  it("define integridade referencial e estados editoriais", () => {
    const postConfig = getTableConfig(posts);
    const commentConfig = getTableConfig(comments);

    expect(postConfig.foreignKeys).toHaveLength(1);
    expect(commentConfig.foreignKeys).toHaveLength(1);
    expect(migration).toContain("posts_editorial_dates_match_status");
    expect(migration).toContain("comments_moderation_matches_status");
    expect(migration).toContain("ON DELETE restrict");
  });

  it("permite rascunho incompleto sem enfraquecer conteúdo publicável", () => {
    expect(draftMigration).toContain(
      'ALTER TABLE "posts" ALTER COLUMN "content_type" DROP NOT NULL',
    );
    expect(draftMigration).toContain("posts_publishable_content");
    expect(draftMigration).toContain('"posts"."status" = \'draft\' OR');
  });

  it("não depende de roles customizadas do provedor", () => {
    expect(migration).not.toContain("oplib_runtime");
    expect(migration).not.toContain("oplib_migration");
    expect(migration).not.toMatch(/\bGRANT\b/);
  });
});
