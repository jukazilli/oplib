import "server-only";

import { sql } from "drizzle-orm";

import { getDatabase } from "@/lib/db/client";
import { logEvent } from "@/lib/observability/logger";

type DatabaseCheck = () => Promise<void>;

export async function checkHealth(
  correlationId: string,
  checkDatabase: DatabaseCheck = async () => {
    await getDatabase().execute(sql`select 1`);
  },
) {
  const startedAt = performance.now();

  try {
    await checkDatabase();
    logEvent({
      level: "info",
      event: "health.checked",
      correlationId,
      module: "health",
      result: "healthy",
      durationMs: performance.now() - startedAt,
    });

    return { status: "healthy" as const, database: true };
  } catch {
    logEvent({
      level: "error",
      event: "health.checked",
      correlationId,
      module: "health",
      result: "degraded",
      errorCode: "DATABASE_UNAVAILABLE",
      durationMs: performance.now() - startedAt,
    });

    return { status: "degraded" as const, database: false };
  }
}
