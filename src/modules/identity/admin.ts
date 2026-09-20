import "server-only";

import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import { identityEnvSchema } from "@/lib/env/schema";
import { evaluateAdminAccess } from "@/modules/identity/access";

export async function requireAdmin() {
  const { userId } = await auth();
  const env = identityEnvSchema.parse(process.env);
  const access = evaluateAdminAccess(userId, env.ADMIN_CLERK_USER_ID);

  if (access === "unauthenticated") {
    redirect("/sign-in");
  }

  if (access === "forbidden") {
    notFound();
  }

  return { userId };
}
