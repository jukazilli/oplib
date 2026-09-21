import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import type { Database } from "@/lib/db";
import { recordAdminAuditEvent } from "@/modules/identity/audit/repository";

const adminId = "10000000-0000-4000-8000-000000000001";
const eventId = "10000000-0000-4000-8000-000000000002";
const publicationId = "10000000-0000-4000-8000-000000000003";

function auditDatabase() {
  const identityReturning = vi.fn().mockResolvedValue([{ id: adminId }]);
  const eventReturning = vi.fn().mockResolvedValue([{ id: eventId }]);
  const identityUpsert = vi.fn(() => ({ returning: identityReturning }));
  const identityValues = vi.fn(() => ({ onConflictDoUpdate: identityUpsert }));
  const eventValues = vi.fn(() => ({ returning: eventReturning }));
  const insert = vi
    .fn()
    .mockReturnValueOnce({ values: identityValues })
    .mockReturnValueOnce({ values: eventValues });
  return {
    database: { insert } as unknown as Database,
    insert,
    identityValues,
    eventValues,
  };
}

beforeEach(() => vi.clearAllMocks());

describe("admin audit repository", () => {
  it("persists actor and a minimized event using the supplied transaction", async () => {
    const { database, identityValues, eventValues } = auditDatabase();
    await expect(
      recordAdminAuditEvent(
        "user_admin_1",
        {
          action: "publication.publish",
          result: "success",
          entityId: publicationId,
        },
        database,
      ),
    ).resolves.toBe(eventId);
    expect(identityValues).toHaveBeenCalledWith({
      clerkUserId: "user_admin_1",
    });
    expect(eventValues).toHaveBeenCalledWith({
      adminIdentityId: adminId,
      action: "publication.publish",
      entityType: "publication",
      entityId: publicationId,
      result: "success",
      metadata: null,
    });
  });

  it("rejects an invalid actor before any database write", async () => {
    const { database, insert } = auditDatabase();
    await expect(
      recordAdminAuditEvent(
        "",
        { action: "comment.hide", result: "failure", entityId: null },
        database,
      ),
    ).rejects.toThrow("Invalid administrator identity");
    expect(insert).not.toHaveBeenCalled();
  });
});
