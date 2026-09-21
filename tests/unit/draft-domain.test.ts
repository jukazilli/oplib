import { describe, expect, it } from "vitest";

import {
  parseDraftInput,
  parsePublishInput,
} from "@/modules/publishing/draft-domain";

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("draft domain", () => {
  it("requires a saved, complete composition to publish", () => {
    const incomplete = parsePublishInput(
      form({ id: "", version: "", title: "", markdown: "" }),
    );
    expect(incomplete.success).toBe(false);
    if (!incomplete.success) {
      expect(incomplete.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining([
          "id",
          "title",
          "summary",
          "markdown",
          "contentType",
          "areaIds",
        ]),
      );
    }
    const complete = form({
      id: "10000000-0000-4000-8000-000000000001",
      version: "2026-09-21T12:00:00.000Z",
      title: "Publicação",
      summary: "Resumo",
      markdown: "# Conteúdo",
      contentType: "article",
    });
    complete.append("areaIds", "10000000-0000-4000-8000-000000000002");
    expect(parsePublishInput(complete).success).toBe(true);
  });
  it("accepts an incomplete new draft", () => {
    const result = parseDraftInput(
      form({ id: "", version: "", title: "", markdown: "" }),
    );
    expect(result.success).toBe(true);
  });

  it("requires a valid version when editing", () => {
    const result = parseDraftInput(
      form({
        id: "10000000-0000-4000-8000-000000000001",
        version: "ontem",
        title: "Título",
        markdown: "Conteúdo",
      }),
    );
    expect(result.success).toBe(false);
  });

  it("enforces the persisted title limit", () => {
    const result = parseDraftInput(
      form({ id: "", version: "", title: "x".repeat(241), markdown: "" }),
    );
    expect(result.success).toBe(false);
  });

  it("requires accessible text when a cover is attached", () => {
    const result = parseDraftInput(
      form({
        id: "",
        version: "",
        title: "Título",
        markdown: "Conteúdo",
        cover: JSON.stringify({
          pathname: "covers/example.webp",
          url: "https://example.com/example.webp",
          altText: "",
          contentType: "image/webp",
          sizeBytes: 1024,
          width: null,
          height: null,
        }),
      }),
    );
    expect(result.success).toBe(false);
  });

  it("accepts complete metadata and ordered references", () => {
    const data = form({
      id: "",
      version: "",
      title: "Virtualização",
      markdown: "Conteúdo",
      summary: "Resumo",
      contentType: "academic_work",
      originalDate: "2026-09-21",
      references: JSON.stringify([
        {
          id: "",
          kind: "related_link",
          title: "NIST",
          citation: "",
          url: "https://www.nist.gov/",
        },
      ]),
    });
    data.append("areaIds", "10000000-0000-4000-8000-000000000001");

    const result = parseDraftInput(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.areaIds).toHaveLength(1);
      expect(result.data.references[0]?.title).toBe("NIST");
    }
  });

  it("rejects unsafe reference addresses", () => {
    const result = parseDraftInput(
      form({
        id: "",
        version: "",
        title: "Título",
        markdown: "Conteúdo",
        references: JSON.stringify([
          {
            id: "",
            kind: "related_link",
            title: "Endereço",
            citation: "",
            url: "javascript:alert(1)",
          },
        ]),
      }),
    );
    expect(result.success).toBe(false);
  });
});
