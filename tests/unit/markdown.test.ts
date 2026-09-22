import { describe, expect, it } from "vitest";

import { markdownWarnings } from "@/modules/publishing/markdown";

describe("markdown warnings", () => {
  it("identifies unsupported HTML and dangerous link schemes", () => {
    expect(
      markdownWarnings(
        '<iframe src="x"></iframe>\n[link](javascript:alert(1))',
      ),
    ).toEqual([
      "HTML não é exibido na prévia.",
      "Um link com endereço não permitido foi removido.",
    ]);
  });

  it("does not warn for ordinary GFM", () => {
    expect(
      markdownWarnings("## Título\n\n- item\n\n[site](https://example.com)"),
    ).toEqual([]);
  });

  it("directs inline images to the approved cover flow", () => {
    for (const markdown of [
      "![Diagrama](https://example.com/image.png)",
      "![Diagrama][imagem]\n\n[imagem]: https://example.com/image.png",
    ]) {
      expect(markdownWarnings(markdown)).toContain(
        "Imagens no texto não são exibidas. Use a capa.",
      );
    }
  });
});
