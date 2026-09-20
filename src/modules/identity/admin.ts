import "server-only";

import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import { identityEnvSchema } from "@/lib/env/schema";
import {
  AdminAuthorizationError,
  assertAdminAccess,
} from "@/modules/identity/authorization";

export async function requireAdmin() {
  const { userId } = await auth();
  const env = identityEnvSchema.parse(process.env);

  try {
    return assertAdminAccess(userId, env.ADMIN_CLERK_USER_ID);
  } catch (error) {
    if (
      error instanceof AdminAuthorizationError &&
      error.access === "unauthenticated"
    ) {
      redirect("/sign-in?redirect_url=%2Fadmin");
    }

    notFound();
  }
}

export async function requireAdminCommand() {
  const { userId } = await auth();
  const env = identityEnvSchema.parse(process.env);

  return assertAdminAccess(userId, env.ADMIN_CLERK_USER_ID);
}
