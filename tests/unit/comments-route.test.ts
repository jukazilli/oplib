import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  valid: vi.fn(),
  newId: vi.fn(),
  hash: vi.fn(),
  limit: vi.fn(),
  log: vi.fn(),
}));
vi.mock("@/modules/interactions/comments/repository", () => ({
  createPublicComment: mocks.create,
}));
vi.mock("@/modules/interactions/comments/rate-limit", () => ({
  allowCommentAttempt: mocks.limit,
}));
vi.mock("@/modules/interactions/likes/identity", () => ({
  VISITOR_COOKIE_NAME: "oplib_visitor",
  validVisitorId: mocks.valid,
  createVisitorId: mocks.newId,
  hashVisitorId: mocks.hash,
}));
vi.mock("@/lib/observability/logger", () => ({ logEvent: mocks.log }));

import { POST } from "@/app/api/publications/[slug]/comments/route";

const comment = {
  id: "id",
  authorName: "Anônimo",
  body: "Olá",
  createdAt: "2026-09-21T12:00:00.000Z",
};
const context = { params: Promise.resolve({ slug: "publicacao" }) } as never;
function request(payload: Record<string, unknown>, headers?: HeadersInit) {
  return new Request(
    "https://oplib.example/api/publications/publicacao/comments",
    {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify({
        authorName: "",
        body: "Olá",
        website: "",
        startedAt: Date.now() - 3000,
        ...payload,
      }),
    },
  );
}
beforeEach(() => {
  vi.clearAllMocks();
  mocks.valid.mockReturnValue(null);
  mocks.newId.mockReturnValue("opaque-id");
  mocks.hash.mockReturnValue("hash");
  mocks.limit.mockReturnValue(true);
  mocks.create.mockResolvedValue(comment);
});

describe("comments route", () => {
  it("persists before returning a visible anonymous comment and protected cookie", async () => {
    const response = await POST(request({}), context);
    expect(response.status).toBe(200);
    expect(mocks.create).toHaveBeenCalledWith("publicacao", {
      authorName: "Anônimo",
      body: "Olá",
    });
    expect(await response.json()).toEqual({ comment });
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
  });
  it("rejects empty, oversized, honeypot, too-fast and cross-origin inputs", async () => {
    for (const [payload, status] of [
      [{ body: "   " }, 400],
      [{ body: "x".repeat(1501) }, 400],
      [{ website: "bot" }, 400],
      [{ startedAt: Date.now() }, 400],
    ] as const) {
      expect((await POST(request(payload), context)).status).toBe(status);
    }
    expect(
      (await POST(request({}, { origin: "https://evil.example" }), context))
        .status,
    ).toBe(403);
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it("refuses browser cross-site requests even without Origin", async () => {
    const response = await POST(
      request({}, { "sec-fetch-site": "cross-site" }),
      context,
    );

    expect(response.status).toBe(403);
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it("rejects unsupported and malformed payloads as client errors", async () => {
    const unsupported = new Request(
      "https://oplib.example/api/publications/publicacao/comments",
      { method: "POST", body: "body=Olá" },
    );
    const malformed = new Request(
      "https://oplib.example/api/publications/publicacao/comments",
      {
        method: "POST",
        headers: { "content-type": "application/json; charset=utf-8" },
        body: '{"body":',
      },
    );

    const unsupportedResponse = await POST(unsupported, context);
    const malformedResponse = await POST(malformed, context);

    expect(unsupportedResponse.status).toBe(415);
    expect(unsupportedResponse.headers.get("cache-control")).toBe("no-store");
    expect(await unsupportedResponse.json()).toEqual({
      message: "Envie o comentário em formato JSON.",
    });
    expect(malformedResponse.status).toBe(400);
    expect(malformedResponse.headers.get("cache-control")).toBe("no-store");
    expect(await malformedResponse.json()).toEqual({
      message: "Revise os campos antes de publicar.",
    });
    expect(mocks.limit).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.log).not.toHaveBeenCalled();
  });
  it("rejects declared and streamed bodies above the endpoint limit", async () => {
    const declared = new Request(
      "https://oplib.example/api/publications/publicacao/comments",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "content-length": "10001",
        },
        body: "{}",
      },
    );
    const streamed = new Request(
      "https://oplib.example/api/publications/publicacao/comments",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: "x".repeat(10_001) }),
      },
    );

    for (const oversized of [declared, streamed]) {
      const response = await POST(oversized, context);
      expect(response.status).toBe(400);
      expect(response.headers.get("cache-control")).toBe("no-store");
    }
    expect(mocks.limit).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.log).not.toHaveBeenCalled();
  });
  it("limits repeated attempts and hides unavailable editorial state", async () => {
    mocks.limit.mockReturnValueOnce(false);
    expect((await POST(request({}), context)).status).toBe(429);
    mocks.create.mockResolvedValue(null);
    expect((await POST(request({}), context)).status).toBe(404);
  });
  it("returns a retryable generic failure without echoing content", async () => {
    mocks.create.mockRejectedValue(new Error("database secret"));
    const response = await POST(request({ body: "Meu texto" }), context);
    expect(response.status).toBe(503);
    expect(JSON.stringify(await response.json())).not.toContain("secret");
  });
});
