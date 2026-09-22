import { describe, expect, it } from "vitest";

import {
  estimateReadingMinutes,
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

  it("calculates deterministic reading time from textual Markdown", () => {
    expect(estimateReadingMinutes("# Título\n\nTexto curto.")).toBe(1);
    expect(
      estimateReadingMinutes(
        Array.from({ length: 201 }, () => "palavra").join(" "),
      ),
    ).toBe(2);
  });
});
