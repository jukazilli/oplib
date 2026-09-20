import { checkHealth } from "@/lib/observability/health";

export const dynamic = "force-dynamic";

export async function GET() {
  const correlationId = crypto.randomUUID();
  const health = await checkHealth(correlationId);
  const version = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? "local";

  return Response.json(
    { ...health, version },
    {
      status: health.database ? 200 : 503,
      headers: {
        "cache-control": "no-store",
        "x-correlation-id": correlationId,
      },
    },
  );
}
