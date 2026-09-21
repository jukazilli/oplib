import { z } from "zod";

export const auditActionEntity = {
  "publication.publish": "publication",
  "publication.update": "publication",
  "publication.withdraw": "publication",
  "publication.republish": "publication",
  "publication.delete": "publication",
  "publication.feature": "publication",
  "comment.hide": "comment",
  "comment.restore": "comment",
  "comment.delete": "comment",
} as const;

export const auditActionSchema = z.enum(
  Object.keys(auditActionEntity) as [
    keyof typeof auditActionEntity,
    ...(keyof typeof auditActionEntity)[],
  ],
);

export const auditEventInputSchema = z.object({
  action: auditActionSchema,
  result: z.enum(["success", "failure"]),
  entityId: z.uuid().nullable(),
  errorCode: z
    .string()
    .regex(/^[A-Z][A-Z0-9_]{2,63}$/)
    .optional(),
});

export type AuditEventInput = z.input<typeof auditEventInputSchema>;

export function prepareAuditEvent(input: AuditEventInput) {
  const parsed = auditEventInputSchema.parse(input);
  if (parsed.result === "success" && parsed.errorCode) {
    throw new Error("Successful audit events cannot contain an error code.");
  }
  return {
    action: parsed.action,
    entityType: auditActionEntity[parsed.action],
    entityId: parsed.entityId,
    result: parsed.result,
    metadata: parsed.errorCode ? { errorCode: parsed.errorCode } : null,
  };
}
