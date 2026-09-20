import { describe, expect, it } from "vitest";

import {
  AdminAuthorizationError,
  adminAuthorizationResponse,
  assertAdminAccess,
} from "@/modules/identity/authorization";
import {
  adminSignInUrl,
  safeAdminReturnUrl,
} from "@/modules/identity/redirect";

describe("administrative authorization", () => {
  const allowedUserId = "user_allowed";

  it("allows only the configured identity", () => {
    expect(assertAdminAccess(allowedUserId, allowedUserId)).toEqual({
      userId: allowedUserId,
    });
    expect(() => assertAdminAccess("user_other", allowedUserId)).toThrow(
      AdminAuthorizationError,
    );
  });

  it.each([
    ["unauthenticated", 401],
    ["forbidden", 404],
  ] as const)(
    "returns a safe response for %s commands",
    async (access, status) => {
      const response = adminAuthorizationResponse(
        new AdminAuthorizationError(access),
      );

      expect(response?.status).toBe(status);
      expect(response?.headers.get("cache-control")).toBe("no-store");
      await expect(response?.json()).resolves.toEqual({
        error: "Acesso administrativo não autorizado.",
      });
    },
  );
});

describe("administrative return URL", () => {
  it.each([
    [undefined, "/admin"],
    ["/", "/admin"],
    ["//example.com/admin", "/admin"],
    ["https://example.com/admin", "/admin"],
    ["/admin", "/admin"],
    [
      "/admin/publicacoes?status=rascunho",
      "/admin/publicacoes?status=rascunho",
    ],
  ])("normalizes %s to %s", (candidate, expected) => {
    expect(safeAdminReturnUrl(candidate)).toBe(expected);
  });

  it("builds an expired-session sign-in URL", () => {
    expect(adminSignInUrl("/admin/publicacoes", true)).toBe(
      "/sign-in?redirect_url=%2Fadmin%2Fpublicacoes&reason=session_expired",
    );
  });
});
