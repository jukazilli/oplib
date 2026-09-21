import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import process from "node:process";

import { del, head, list, put } from "@vercel/blob";

import {
  relatedBackupPaths,
  selectExpiredBackups,
} from "./lib/backup-retention.mjs";

const [command, encryptedFile, manifestFile, tierOverride] =
  process.argv.slice(2);
const token = process.env.BACKUP_BLOB_READ_WRITE_TOKEN;

if (command !== "upload" || !encryptedFile || !manifestFile) {
  throw new Error(
    "Uso: node scripts/backup-storage.mjs upload <dump.age> <manifest.json>",
  );
}
if (!token) throw new Error("BACKUP_BLOB_READ_WRITE_TOKEN ausente.");

const manifest = JSON.parse(await readFile(manifestFile, "utf8"));
const { backupId } = manifest;
const retentionTier = tierOverride ?? manifest.retentionTier;
if (!/^\d{4}-\d{2}-\d{2}T\d{6}Z$/.test(backupId))
  throw new Error("backupId inválido.");
if (!["daily", "weekly", "manual"].includes(retentionTier))
  throw new Error("Retenção inválida.");

const prefix = `backups/${retentionTier}/${backupId}`;
const encryptedPathname = `${prefix}/oplib.dump.age`;
const manifestPathname = `${prefix}/oplib.manifest.json`;
const encryptedSize = (await stat(encryptedFile)).size;

await put(encryptedPathname, createReadStream(encryptedFile), {
  access: "private",
  addRandomSuffix: false,
  contentType: "application/octet-stream",
  token,
});
await put(manifestPathname, JSON.stringify({ ...manifest, retentionTier }), {
  access: "private",
  addRandomSuffix: false,
  contentType: "application/json",
  token,
});

const uploaded = await head(encryptedPathname, { token });
if (uploaded.size !== encryptedSize)
  throw new Error("Tamanho do upload diverge do arquivo local.");

const pathnames = [];
let cursor;
do {
  const page = await list({ prefix: "backups/", limit: 1000, cursor, token });
  pathnames.push(...page.blobs.map(({ pathname }) => pathname));
  cursor = page.hasMore ? page.cursor : undefined;
} while (cursor);

const expired = selectExpiredBackups(pathnames);
for (const pathname of expired)
  await del(relatedBackupPaths(pathname), { token });

console.log(
  JSON.stringify({
    event: "backup.uploaded",
    backupId,
    retentionTier,
    encryptedBytes: encryptedSize,
    expiredBackupsRemoved: expired.length,
  }),
);
