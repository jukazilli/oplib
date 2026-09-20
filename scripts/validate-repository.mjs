import { readFileSync } from "node:fs";

const requiredFiles = [
  ".github/CODEOWNERS",
  ".github/ISSUE_TEMPLATE/bug_report.yml",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/ISSUE_TEMPLATE/task.yml",
  ".github/dependabot.yml",
  ".github/pull_request_template.md",
  ".github/workflows/codeql.yml",
  ".github/workflows/repository-policy.yml",
  ".gitignore",
  "CONTRIBUTING.md",
  "README.md",
  "SECURITY.md",
  "docs/08_Backlog_Canonico_Rastreabilidade_e_Plano_de_Entrega.md",
  "docs/09_Matriz_Operacional_de_Rastreabilidade.md",
];

const errors = [];

for (const path of requiredFiles) {
  try {
    const content = readFileSync(path, "utf8");
    if (content.trim().length === 0) {
      errors.push(`${path} está vazio`);
    }
  } catch {
    errors.push(`${path} não existe`);
  }
}

const backlog = readFileSync(
  "docs/08_Backlog_Canonico_Rastreabilidade_e_Plano_de_Entrega.md",
  "utf8",
);
const matrix = readFileSync(
  "docs/09_Matriz_Operacional_de_Rastreabilidade.md",
  "utf8",
);

if (!backlog.includes("### FND-001 — Proteger e preparar o repositório")) {
  errors.push("D08 não contém o item FND-001");
}

if (!matrix.includes("| FND-001 |")) {
  errors.push("D09 não contém o item FND-001");
}

if (!readFileSync(".gitignore", "utf8").includes(".env.*")) {
  errors.push(".gitignore não protege variantes de .env");
}

if (errors.length > 0) {
  console.error("Política do repositório inválida:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`${requiredFiles.length} arquivos de governança validados.`);
