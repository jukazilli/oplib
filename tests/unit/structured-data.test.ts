import { describe, expect, it } from "vitest";

import {
  publicationStructuredData,
  serializeStructuredData,
} from "@/lib/seo/structured-data";

const publication = {
  id: "1",
  title: "Conhecimento </script> em movimento",
  slug: "conhecimento-em-movimento",
  summary: "Uma síntese clara.",
  markdown: "Conteúdo",
  contentType: "article" as const,
  areaIds: [],
  areaNames: ["Engenharia de Software"],
  categoryId: "",
  categoryName: "",
  tagIds: [],
  tagNames: ["Arquitetura"],
  course: "",
  discipline: "",
  originalDate: "",
  references: [],
  cover: null,
  publishedAt: new Date("2026-09-20T12:00:00.000Z"),
  updatedAt: new Date("2026-09-21T12:00:00.000Z"),
};

describe("publication structured data", () => {
  it("describes only facts present in the public publication", () => {
    expect(
      publicationStructuredData(
        publication,
        "https://oplib.example/publicacoes/conhecimento-em-movimento",
      ),
    ).toMatchObject({
      "@type": "Article",
      headline: publication.title,
      datePublished: "2026-09-20T12:00:00.000Z",
      dateModified: "2026-09-21T12:00:00.000Z",
      mainEntityOfPage:
        "https://oplib.example/publicacoes/conhecimento-em-movimento",
      author: { "@type": "Person", name: "Juliano Zilli" },
      publisher: { "@type": "Person", name: "Juliano Zilli" },
      about: [{ "@type": "Thing", name: "Engenharia de Software" }],
      keywords: "Arquitetura",
    });
  });

  it("escapes markup-closing characters before embedding JSON-LD", () => {
    const serialized = serializeStructuredData({ headline: publication.title });
    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003c/script>");
  });
});
