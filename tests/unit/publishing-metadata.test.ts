import { describe, expect, it } from "vitest";

import {
  normalizeRequestedSlug,
  slugifyPostTitle,
} from "@/modules/publishing/metadata";

describe("publishing metadata", () => {
  it("creates a stable URL segment without accents", () => {
    expect(slugifyPostTitle("Virtualização de Sistemas Operacionais")).toBe(
      "virtualizacao-de-sistemas-operacionais",
    );
  });

  it("normalizes a manually requested permanent address", () => {
    expect(normalizeRequestedSlug("  Meu Artigo / 2026  ")).toBe(
      "meu-artigo-2026",
    );
  });
});
