import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const sensitiveNames = [
  "CLERK_SECRET_KEY",
  "DATABASE_URL",
  "DATABASE_URL_UNPOOLED",
  "BLOB_READ_WRITE_TOKEN",
  "VISITOR_ID_PEPPER",
  "BACKUP_BLOB_READ_WRITE_TOKEN",
  "BACKUP_ENCRYPTION_PUBLIC_KEY",
];

const patterns = [
  {
    name: "valor de variável secreta",
    expression: new RegExp(
      `(?:^|[\\t ])(?:${sensitiveNames.join("|")})[\\t ]*=[\\t ]*[^\\s#]+`,
      "m",
    ),
  },
  {
    name: "URL PostgreSQL com credenciais",
    expression: /postgres(?:ql)?:\/\/[^\s/:]+:[^\s/@]+@/i,
  },
  {
    name: "chave secreta Clerk",
    expression: new RegExp(`s${"k"}_(?:live|test)_[A-Za-z0-9_-]{20,}`),
  },
  {
    name: "token Vercel Blob",
    expression: new RegExp(`vercel_blob_${"rw"}_[A-Za-z0-9_-]{20,}`, "i"),
  },
  {
    name: "chave privada PEM",
    expression: new RegExp(
      `-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE ${"KEY"}-----[A-Za-z0-9+/=\\r\\n]{64,}-----END (?:RSA |EC |OPENSSH )?PRIVATE ${"KEY"}-----`,
    ),
  },
];

const requestedFiles = process.argv.slice(2);
const trackedFiles =
  requestedFiles.length > 0
    ? requestedFiles
    : execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
        .split("\0")
        .filter(Boolean);

const findings = [];

for (const path of trackedFiles) {
  if (path === "pnpm-lock.yaml") continue;

  const content = readFileSync(path);
  if (content.includes(0)) continue;

  const text = content.toString("utf8");
  for (const pattern of patterns) {
    const match = pattern.expression.exec(text);
    if (!match) continue;

    const line = text.slice(0, match.index).split("\n").length;
    findings.push(`${path}:${line} (${pattern.name})`);
  }
}

if (findings.length > 0) {
  console.error("Possível segredo encontrado em arquivo versionado:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`${trackedFiles.length} arquivos verificados; nenhum padrão de segredo encontrado.`);
