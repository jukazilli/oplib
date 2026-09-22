import "server-only";

import { createHmac, randomUUID } from "node:crypto";
import { z } from "zod";

import { interactionsEnvSchema } from "@/lib/env/schema";
import { parseServerEnv } from "@/lib/env/server";

export const VISITOR_COOKIE_NAME = "oplib_visitor";
const visitorIdSchema = z.uuid();

export function validVisitorId(value: string | undefined) {
  return visitorIdSchema.safeParse(value).success ? value : null;
}

export function createVisitorId() {
  return randomUUID();
}

export function hashVisitorId(visitorId: string) {
  const { VISITOR_ID_PEPPER } = parseServerEnv(
    "interactions",
    interactionsEnvSchema,
  );
  return createHmac("sha256", VISITOR_ID_PEPPER)
    .update(visitorId)
    .digest("hex");
}
