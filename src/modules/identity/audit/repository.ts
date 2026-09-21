import "server-only";

import { getDatabase, type Database } from "@/lib/db";
import { adminIdentities, auditEvents } from "@/lib/db/schema";
import { prepareAuditEvent, type AuditEventInput } from "./policy";

type AuditDatabase =
  Database | Parameters<Parameters<Database["transaction"]>[0]>[0];

/** Pass the same transaction as the administrative mutation for success events. */
export async function recordAdminAuditEvent(
  clerkUserId: string,
  input: AuditEventInput,
  database?: AuditDatabase,
) {
  if (!clerkUserId || clerkUserId.length > 128) {
    throw new Error("Invalid administrator identity for audit event.");
  }
  const event = prepareAuditEvent(input);
  const db = database ?? getDatabase();
  const identities = await db
    .insert(adminIdentities)
    .values({ clerkUserId })
    .onConflictDoUpdate({
      target: adminIdentities.clerkUserId,
      set: { updatedAt: new Date() },
    })
    .returning({ id: adminIdentities.id });
  const identity = identities[0];
  if (!identity) throw new Error("Administrator identity was not persisted.");
  const rows = await db
    .insert(auditEvents)
    .values({ ...event, adminIdentityId: identity.id })
    .returning({ id: auditEvents.id });
  if (!rows[0]) throw new Error("Audit event was not persisted.");
  return rows[0].id;
}
