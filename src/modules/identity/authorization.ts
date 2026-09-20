import { evaluateAdminAccess, type AdminAccess } from "./access";

export class AdminAuthorizationError extends Error {
  constructor(public readonly access: Exclude<AdminAccess, "allowed">) {
    super("Administrative access denied.");
    this.name = "AdminAuthorizationError";
  }
}

export function assertAdminAccess(
  userId: string | null,
  allowedUserId: string,
) {
  const access = evaluateAdminAccess(userId, allowedUserId);

  if (access !== "allowed") {
    throw new AdminAuthorizationError(access);
  }

  return { userId: userId as string };
}

export function adminAuthorizationResponse(error: unknown) {
  if (!(error instanceof AdminAuthorizationError)) {
    return null;
  }

  return Response.json(
    { error: "Acesso administrativo não autorizado." },
    {
      status: error.access === "unauthenticated" ? 401 : 404,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
