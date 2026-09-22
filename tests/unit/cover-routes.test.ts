import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  admin: vi.fn(),
  cleanup: vi.fn(),
  del: vi.fn(),
  handleUpload: vi.fn(),
}));

vi.mock("@/modules/identity/admin", () => ({
  requireAdminCommand: mocks.admin,
}));
vi.mock("@/modules/media/covers", () => ({
  cleanupDetachedCover: mocks.cleanup,
}));
vi.mock("@vercel/blob", () => ({ del: mocks.del }));
vi.mock("@vercel/blob/client", () => ({ handleUpload: mocks.handleUpload }));

import {
  DELETE as deleteCover,
  POST as handleCoverUpload,
} from "@/app/api/admin/covers/route";
import { POST as prepareCoverPathname } from "@/app/api/admin/covers/pathname/route";
import { AdminAuthorizationError } from "@/modules/identity/authorization";

const endpoint = "https://oplib.example/api/admin/covers";

function jsonRequest(url: string, body: unknown, headers?: HeadersInit) {
  return new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("BLOB_COVERS_PREFIX", "covers/preview");
  mocks.admin.mockResolvedValue({ userId: "admin" });
  mocks.cleanup.mockResolvedValue({ deleted: true });
});

describe("cover pathname route", () => {
  it.each([
    ["unauthenticated", 401],
    ["forbidden", 404],
  ] as const)(
    "denies %s access without generating a pathname",
    async (access, status) => {
      mocks.admin.mockRejectedValue(new AdminAuthorizationError(access));

      const response = await prepareCoverPathname(
        jsonRequest(`${endpoint}/pathname`, { contentType: "image/png" }),
      );

      expect(response.status).toBe(status);
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(await response.json()).toEqual({
        error: "Acesso administrativo não autorizado.",
      });
    },
  );

  it("generates an immutable managed pathname only for an approved type", async () => {
    const response = await prepareCoverPathname(
      jsonRequest(`${endpoint}/pathname`, { contentType: "image/webp" }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({
      pathname: expect.stringMatching(/^covers\/preview\/[0-9a-f-]{36}\.webp$/),
    });

    const invalid = await prepareCoverPathname(
      jsonRequest(`${endpoint}/pathname`, { contentType: "image/svg+xml" }),
    );
    expect(invalid.status).toBe(400);
    expect(invalid.headers.get("cache-control")).toBe("no-store");
  });
});

describe("cover upload route", () => {
  it("authorizes token generation and constrains path, type, size and overwrite", async () => {
    mocks.handleUpload.mockImplementation(async ({ onBeforeGenerateToken }) => {
      const policy = await onBeforeGenerateToken(
        "covers/preview/10000000-0000-4000-8000-000000000001.png",
        "application/json",
      );
      return {
        type: "blob.generate-client-token",
        clientToken: "synthetic",
        policy,
      };
    });

    const response = await handleCoverUpload(jsonRequest(endpoint, {}));
    const payload = (await response.json()) as {
      policy: Record<string, unknown>;
    };

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(mocks.admin).toHaveBeenCalledOnce();
    expect(payload.policy).toMatchObject({
      allowedContentTypes: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif",
      ],
      maximumSizeInBytes: 5 * 1024 * 1024,
      allowOverwrite: false,
    });
  });

  it("rejects a pathname outside the managed immutable namespace", async () => {
    mocks.handleUpload.mockImplementation(async ({ onBeforeGenerateToken }) => {
      await onBeforeGenerateToken(
        "covers/preview/../attack.svg",
        "image/svg+xml",
      );
    });

    const response = await handleCoverUpload(jsonRequest(endpoint, {}));

    expect(response.status).toBe(400);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("deletes a blob whose bytes do not match its declared type", async () => {
    mocks.handleUpload.mockImplementation(async ({ onUploadCompleted }) => {
      await onUploadCompleted({
        blob: {
          url: "https://blob.example/cover.png",
          pathname: "covers/preview/id.png",
          contentType: "image/png",
        },
        tokenPayload: null,
      });
    });
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(new Uint8Array([0x47, 0x49, 0x46]), { status: 206 }),
        ),
    );

    const response = await handleCoverUpload(jsonRequest(endpoint, {}));

    expect(response.status).toBe(400);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(mocks.del).toHaveBeenCalledWith("https://blob.example/cover.png");
  });

  it("rejects an oversized protocol body before invoking Blob", async () => {
    const response = await handleCoverUpload(
      jsonRequest(endpoint, {}, { "content-length": String(64 * 1024 + 1) }),
    );

    expect(response.status).toBe(413);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(mocks.handleUpload).not.toHaveBeenCalled();
  });
});

describe("cover deletion route", () => {
  it("does not delete paths outside the managed namespace", async () => {
    const request = new Request(endpoint, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pathname: "covers/production/file.webp" }),
    });

    const response = await deleteCover(request);

    expect(response.status).toBe(400);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(mocks.cleanup).not.toHaveBeenCalled();
  });
});
