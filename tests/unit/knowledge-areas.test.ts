import { describe, expect, it, vi } from "vitest";

import {
  canonicalKnowledgeAreas,
  seedKnowledgeAreas,
} from "../../scripts/seed-knowledge-areas.mjs";

describe("canonical knowledge areas", () => {
  it("defines stable identities, normalized names and slugs", () => {
    expect(
      canonicalKnowledgeAreas.map(({ name, slug }) => ({ name, slug })),
    ).toEqual([
      { name: "Engenharia de Software", slug: "engenharia-de-software" },
      { name: "Educação Física", slug: "educacao-fisica" },
      { name: "Interdisciplinar", slug: "interdisciplinar" },
    ]);
    expect(new Set(canonicalKnowledgeAreas.map((area) => area.id)).size).toBe(
      3,
    );
    expect(
      new Set(canonicalKnowledgeAreas.map((area) => area.normalizedName)).size,
    ).toBe(3);
  });

  it("upserts by stable slug and does not rewrite unchanged rows", async () => {
    const query = vi.fn().mockResolvedValue({ rows: [] });
    await expect(seedKnowledgeAreas({ query })).resolves.toEqual([]);
    const [sql, values] = query.mock.calls[0] as [string, unknown[]];
    expect(sql).toContain("ON CONFLICT (slug) DO UPDATE");
    expect(sql).toContain("IS DISTINCT FROM");
    expect(values).toHaveLength(12);
  });
});
