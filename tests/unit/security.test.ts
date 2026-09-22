import { describe, expect, it } from "vitest";

import { securityHeaders } from "@/lib/security/headers";
import {
  MAX_JSON_BODY_BYTES,
  PayloadTooLargeError,
  isSameOriginMutation,
  readLimitedJson,
} from "@/lib/security/request";

describe("security baseline", () => {
  it("defines the defensive response headers", () => {
    const headers = new Headers(
      securityHeaders.map(({ key, value }): [string, string] => [key, value]),
    );

    expect(headers.get("content-security-policy-report-only")).toContain(
      "frame-ancestors 'none'",
    );
    expect(headers.get("x-content-type-options")).toBe("nosniff");
    expect(headers.get("x-frame-options")).toBe("DENY");
    expect(headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(headers.get("permissions-policy")).toContain("camera=()");
  });

  it("parses JSON bodies within the limit", async () => {
    const request = new Request("https://oplib.test/api", {
      method: "POST",
      body: JSON.stringify({ contentType: "image/jpeg" }),
    });

    await expect(readLimitedJson(request)).resolves.toEqual({
      contentType: "image/jpeg",
    });
  });

  it("rejects a declared body above the limit", async () => {
    const request = new Request("https://oplib.test/api", {
      method: "POST",
      headers: { "content-length": String(MAX_JSON_BODY_BYTES + 1) },
      body: "{}",
    });

    await expect(readLimitedJson(request)).rejects.toBeInstanceOf(
      PayloadTooLargeError,
    );
  });

  it("rejects a streamed body above the limit", async () => {
    const request = new Request("https://oplib.test/api", {
      method: "POST",
      body: "x".repeat(MAX_JSON_BODY_BYTES + 1),
    });

    await expect(readLimitedJson(request)).rejects.toBeInstanceOf(
      PayloadTooLargeError,
    );
  });

  it.each([
    [{ origin: "https://oplib.test", "sec-fetch-site": "same-origin" }, true],
    [{ "sec-fetch-site": "cross-site" }, false],
    [{ "sec-fetch-site": "same-site" }, false],
    [{ origin: "https://evil.test", "sec-fetch-site": "same-origin" }, false],
    [{ referer: "https://evil.test/page" }, false],
    [{ referer: "invalid-url" }, false],
    [{ referer: "https://oplib.test/page" }, true],
    [{}, true],
  ] as const)(
    "checks public mutation provenance for %j",
    (headers, allowed) => {
      const request = new Request("https://oplib.test/api", {
        method: "POST",
        headers,
      });
      expect(isSameOriginMutation(request)).toBe(allowed);
    },
  );
});
