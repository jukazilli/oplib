import { describe, expect, it } from "vitest";

import {
  normalizeTaxonomyName,
  parseTaxonomyName,
  slugifyTaxonomyName,
} from "@/modules/taxonomy/domain";

describe("taxonomy domain", () => {
  it("normalizes spacing and case for duplicate detection", () => {
    expect(normalizeTaxonomyName("  Ciência   de DADOS ")).toBe(
      "ciência de dados",
    );
  });

  it("creates stable URL slugs without accents", () => {
    expect(slugifyTaxonomyName("Educação Física & Saúde")).toBe(
      "educacao-fisica-saude",
    );
  });

  it("enforces the shorter tag limit and identifies the name field", () => {
    const parsed = parseTaxonomyName("a".repeat(81), "tag");
    expect(parsed).toEqual({
      success: false,
      error: "Use no máximo 80 caracteres.",
    });
  });

  it("refuses names that cannot produce a slug", () => {
    expect(parseTaxonomyName("---", "category")).toEqual({
      success: false,
      error: "Use letras ou números no nome.",
    });
  });
});
