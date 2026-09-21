import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ connection: vi.fn() }));

import { PgDialect } from "drizzle-orm/pg-core";

import { buildPublicSearchWhere } from "@/modules/discovery/publications";
import type { PublicSearch } from "@/modules/discovery/domain";

describe("public search query security", () => {
  it("keeps every hostile filter value in parameters instead of SQL text", () => {
    const injection = "x%' OR 1=1; DROP TABLE posts; --";
    const search = {
      busca: injection,
      area: injection,
      tipo: "article",
      categoria: injection,
      tag: injection,
      ano: 2026,
      ordem: "recentes",
      view: "feed",
      pagina: 1,
    } as PublicSearch;

    const query = new PgDialect().sqlToQuery(buildPublicSearchWhere(search));

    expect(query.sql).not.toContain(injection);
    expect(query.sql).not.toContain("DROP TABLE");
    expect(query.sql).toMatch(/\$\d+/);
    expect(query.params).toEqual(
      expect.arrayContaining([`%${injection}%`, injection, "article", 2026]),
    );
    expect(query.params.filter((value) => value === injection)).toHaveLength(3);
  });
});
