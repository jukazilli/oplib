import { describe, expect, it } from "vitest";
import {
  commentInputSchema,
  normalizeComment,
} from "@/modules/interactions/comments/contract";

const input = {
  authorName: "",
  body: " Texto simples ",
  website: "",
  startedAt: 1,
};

describe("comment contract", () => {
  it("normalizes anonymous and named comments without interpreting markup", () => {
    expect(normalizeComment(commentInputSchema.parse(input))).toEqual({
      authorName: "Anônimo",
      body: "Texto simples",
    });
    expect(
      normalizeComment(
        commentInputSchema.parse({
          ...input,
          authorName: " Ana ",
          body: "<script>alert(1)</script> **texto** https://example.com",
        }),
      ),
    ).toEqual({
      authorName: "Ana",
      body: "<script>alert(1)</script> **texto** https://example.com",
    });
  });
  it("rejects oversized names and text", () => {
    expect(
      commentInputSchema.safeParse({ ...input, authorName: "a".repeat(81) })
        .success,
    ).toBe(false);
    expect(
      commentInputSchema.safeParse({ ...input, body: "a".repeat(1501) })
        .success,
    ).toBe(false);
    expect(
      commentInputSchema.safeParse({ ...input, body: "a".repeat(1500) })
        .success,
    ).toBe(true);
  });
});
