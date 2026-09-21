import { randomUUID } from "node:crypto";
import { unstable_rethrow } from "next/navigation";

import {
  AdminOverviewContent,
  AdminOverviewError,
} from "@/components/admin/admin-overview";
import { logEvent } from "@/lib/observability/logger";
import { getAdminOverview, type AdminOverview } from "@/modules/admin/overview";

export default async function AdminPage() {
  let overview: AdminOverview | null = null;

  try {
    overview = await getAdminOverview();
  } catch (error) {
    unstable_rethrow(error);
    logEvent({
      level: "error",
      event: "admin.overview.read",
      correlationId: randomUUID(),
      module: "admin",
      result: "degraded",
      errorCode: "OVERVIEW_READ_FAILED",
    });
  }

  return overview ? (
    <AdminOverviewContent overview={overview} />
  ) : (
    <AdminOverviewError />
  );
}
