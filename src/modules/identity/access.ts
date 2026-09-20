export type AdminAccess = "allowed" | "unauthenticated" | "forbidden";

export function evaluateAdminAccess(
  userId: string | null,
  allowedUserId: string,
): AdminAccess {
  if (!userId) {
    return "unauthenticated";
  }

  return userId === allowedUserId ? "allowed" : "forbidden";
}
