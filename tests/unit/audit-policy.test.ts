import { describe, expect, it } from "vitest";

import {
  auditActionEntity,
  prepareAuditEvent,
} from "@/modules/identity/audit/policy";

const entityId = "10000000-0000-4000-8000-000000000001";

describe("admin audit policy", () => {
  it("covers publication and moderation actions with fixed entity types", () => {
    expect(Object.keys(auditActionEntity)).toEqual([
      "publication.publish",
      "publication.update",
      "publication.withdraw",
      "publication.republish",
      "publication.delete",
      "publication.feature",
      "comment.hide",
      "comment.restore",
      "comment.delete",
    ]);
    for (const action of Object.keys(auditActionEntity) as Array<
      keyof typeof auditActionEntity
    >) {
      expect(
        prepareAuditEvent({ action, result: "success", entityId }).entityType,
      ).toBe(auditActionEntity[action]);
    }
  });

  it("distinguishes failure while keeping only a stable error code", () => {
    expect(
      prepareAuditEvent({
        action: "publication.publish",
        result: "failure",
        entityId,
        errorCode: "PUBLISH_CONFLICT",
      }),
    ).toEqual({
      action: "publication.publish",
      entityType: "publication",
      entityId,
      result: "failure",
      metadata: { errorCode: "PUBLISH_CONFLICT" },
    });
  });

  it("rejects arbitrary content, secrets and invalid identifiers", () => {
    expect(() =>
      prepareAuditEvent({
        action: "publication.publish",
        result: "failure",
        entityId,
        errorCode: "token=secret",
      }),
    ).toThrow();
    expect(() =>
      prepareAuditEvent({
        action: "publication.publish",
        result: "success",
        entityId,
        errorCode: "SENSITIVE",
      }),
    ).toThrow();
    expect(() =>
      prepareAuditEvent({
        action: "publication.publish",
        result: "success",
        entityId: "not-an-id",
        markdown: "private content",
      } as never),
    ).not.toHaveProperty("markdown");
  });
});
