import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { checkHealth } from "@/lib/observability/health";
import { serializeLogEvent } from "@/lib/observability/logger";

describe("observability", () => {
  it("reports a healthy database without internal details", async () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);

    await expect(
      checkHealth("correlation-healthy", async () => undefined),
    ).resolves.toEqual({ status: "healthy", database: true });
  });

  it("reports degradation without exposing the original error", async () => {
    const errorLog = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    await expect(
      checkHealth("correlation-degraded", async () => {
        throw new Error("postgres://user:secret@example.test/private");
      }),
    ).resolves.toEqual({ status: "degraded", database: false });

    expect(errorLog).toHaveBeenCalledOnce();
    expect(errorLog.mock.calls[0]?.[0]).not.toContain("secret");
  });

  it("serializes only the approved fields", () => {
    const serialized = serializeLogEvent({
      level: "warn",
      event: "test.event",
      correlationId: "correlation-id",
      module: "test",
      result: "rejected",
      errorCode: "TEST_REJECTED",
    });

    expect(JSON.parse(serialized)).toMatchObject({
      level: "warn",
      event: "test.event",
      correlationId: "correlation-id",
      module: "test",
      result: "rejected",
      errorCode: "TEST_REJECTED",
    });
    expect(serialized).not.toContain("cookie");
    expect(serialized).not.toContain("token");
  });
});
