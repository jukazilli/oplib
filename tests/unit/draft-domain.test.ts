import { describe, expect, it } from "vitest";

import { parseDraftInput } from "@/modules/publishing/draft-domain";

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("draft domain", () => {
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
});
