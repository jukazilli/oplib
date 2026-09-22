import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  register: vi.fn(),
  valid: vi.fn(),
  create: vi.fn(),
  hash: vi.fn(),
  log: vi.fn(),
}));

vi.mock("@/modules/interactions/likes/repository", () => ({
  registerLike: mocks.register,
}));
vi.mock("@/modules/interactions/likes/identity", () => ({
  VISITOR_COOKIE_NAME: "oplib_visitor",
  validVisitorId: mocks.valid,
  createVisitorId: mocks.create,
  hashVisitorId: mocks.hash,
}));
vi.mock("@/lib/observability/logger", () => ({ logEvent: mocks.log }));

import { POST } from "@/app/api/publications/[slug]/like/route";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.valid.mockReturnValue(null);
  mocks.create.mockReturnValue("new-visitor-id");
  mocks.hash.mockReturnValue("visitor-hash");
  mocks.register.mockResolvedValue({ count: 1, alreadyLiked: false });
});

function request(cookie?: string) {
  return new Request("https://oplib.example/api/publications/publicacao/like", {
    method: "POST",
    headers: cookie ? { cookie } : undefined,
  });
}

describe("like route", () => {
  it("creates a protected visitor cookie and returns the authoritative count", async () => {
    const response = await POST(request(), {
      params: Promise.resolve({ slug: "publicacao" }),
    } as never);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ count: 1, alreadyLiked: false });
    expect(mocks.register).toHaveBeenCalledWith("publicacao", "visitor-hash");
    expect(response.headers.get("set-cookie")).toContain(
      "oplib_visitor=new-visitor-id",
    );
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("SameSite=lax");
  });

  it("reuses a valid opaque identifier without replacing it", async () => {
    mocks.valid.mockReturnValue("existing-id");
    mocks.register.mockResolvedValue({ count: 7, alreadyLiked: true });
    const response = await POST(request("oplib_visitor=existing-id"), {
      params: Promise.resolve({ slug: "publicacao" }),
    } as never);

    expect(await response.json()).toEqual({ count: 7, alreadyLiked: true });
    expect(mocks.hash).toHaveBeenCalledWith("existing-id");
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("does not reveal whether an unavailable slug is draft or withdrawn", async () => {
    mocks.register.mockResolvedValue(null);
    const response = await POST(request(), {
      params: Promise.resolve({ slug: "indisponivel" }),
    } as never);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      message: "Esta publicação não está disponível.",
    });
  });

  it("returns a generic retryable failure", async () => {
    mocks.register.mockRejectedValue(new Error("database"));
    const response = await POST(request(), {
      params: Promise.resolve({ slug: "publicacao" }),
    } as never);

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      message: "Não foi possível registrar sua curtida agora. Tente novamente.",
    });
  });

  it("refuses cross-origin mutation attempts", async () => {
    const crossOrigin = request();
    crossOrigin.headers.set("origin", "https://malicious.example");
    const response = await POST(crossOrigin, {
      params: Promise.resolve({ slug: "publicacao" }),
    } as never);

    expect(response.status).toBe(403);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(mocks.register).not.toHaveBeenCalled();
  });

  it("refuses browser cross-site requests even without Origin", async () => {
    const crossSite = request();
    crossSite.headers.set("sec-fetch-site", "cross-site");
    const response = await POST(crossSite, {
      params: Promise.resolve({ slug: "publicacao" }),
    } as never);

    expect(response.status).toBe(403);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(mocks.register).not.toHaveBeenCalled();
  });
});
