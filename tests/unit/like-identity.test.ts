import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  createVisitorId,
  hashVisitorId,
  validVisitorId,
} from "@/modules/interactions/likes/identity";

afterEach(() => vi.unstubAllEnvs());

describe("anonymous like identity", () => {
  it("accepts only opaque UUID identifiers", () => {
    const visitorId = createVisitorId();
    expect(validVisitorId(visitorId)).toBe(visitorId);
    expect(validVisitorId("browser-fingerprint")).toBeNull();
  });

  it("stores a deterministic hash without exposing the identifier or pepper", () => {
    vi.stubEnv(
      "VISITOR_ID_PEPPER",
      "a-secure-pepper-with-at-least-32-characters",
    );
    const visitorId = "10000000-0000-4000-8000-000000000001";
    const hash = hashVisitorId(visitorId);

    expect(hash).toHaveLength(64);
    expect(hash).toBe(hashVisitorId(visitorId));
    expect(hash).not.toContain(visitorId);
    expect(hash).not.toContain("a-secure-pepper");
  });
});
