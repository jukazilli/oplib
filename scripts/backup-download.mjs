import { createWriteStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import process from "node:process";

import { get } from "@vercel/blob";

const [retentionTier, backupId, outputDirectory] = process.argv.slice(2);
const token = process.env.BACKUP_BLOB_READ_WRITE_TOKEN;

if (!["daily", "weekly", "manual"].includes(retentionTier))
  throw new Error("Retenção inválida.");
if (!/^\d{4}-\d{2}-\d{2}T\d{6}Z$/.test(backupId))
  throw new Error("backupId inválido.");
if (!outputDirectory) throw new Error("Diretório de saída ausente.");
if (!token) throw new Error("BACKUP_BLOB_READ_WRITE_TOKEN ausente.");

await mkdir(outputDirectory, { recursive: true, mode: 0o700 });
const prefix = `backups/${retentionTier}/${backupId}`;
const encrypted = await get(`${prefix}/oplib.dump.age`, {
  access: "private",
  token,
});
const manifest = await get(`${prefix}/oplib.manifest.json`, {
  access: "private",
  token,
});

if (!encrypted || encrypted.statusCode !== 200 || !encrypted.stream) {
  throw new Error("Backup criptografado não encontrado.");
}
if (!manifest || manifest.statusCode !== 200 || !manifest.stream) {
  throw new Error("Manifesto do backup não encontrado.");
}

await pipeline(
  Readable.fromWeb(encrypted.stream),
  createWriteStream(`${outputDirectory}/oplib.dump.age`, { mode: 0o600 }),
);
const manifestText = await new Response(manifest.stream).text();
await writeFile(`${outputDirectory}/oplib.manifest.json`, manifestText, {
  mode: 0o600,
});

console.log(
  JSON.stringify({ event: "backup.downloaded", backupId, retentionTier }),
);
