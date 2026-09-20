import { describe, expect, it } from "vitest";

import { evaluateAdminAccess } from "@/modules/identity/access";

describe("admin access", () => {
  const allowedUserId = "user_allowed";

  it("allows the configured administrator", () => {
    expect(evaluateAdminAccess(allowedUserId, allowedUserId)).toBe("allowed");
  });

  it("denies an authenticated identity outside the allowlist", () => {
    expect(evaluateAdminAccess("user_other", allowedUserId)).toBe("forbidden");
  });

  it("requires a valid session", () => {
    expect(evaluateAdminAccess(null, allowedUserId)).toBe("unauthenticated");
  });
});
