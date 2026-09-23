import { readFile, writeFile } from "node:fs/promises";
import process from "node:process";

const [activeFile, outputFile, draftFile] = process.argv.slice(2);

if (!activeFile || !outputFile) {
  throw new Error(
    "Usage: node scripts/summarize-firewall.mjs <active.json> <summary.md> [draft.json]",
  );
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function actionName(action) {
  if (typeof action === "string") return action;
  const mitigate = action?.mitigate;
  if (!mitigate || typeof mitigate !== "object") return "unknown";
  if (mitigate.rateLimit) {
    const outcome = mitigate.rateLimit.action ?? "unknown";
    return `rate_limit:${outcome}`;
  }
  return mitigate.action ?? "unknown";
}

function safeCondition(condition) {
  const safeValueTypes = new Set([
    "environment",
    "host",
    "method",
    "path",
    "request_method",
    "request_path",
  ]);
  const type = String(condition?.type ?? "unknown");
  const value = safeValueTypes.has(type) ? condition?.value : undefined;

  return {
    type,
    operator: String(condition?.op ?? "unknown"),
    negated: Boolean(condition?.neg),
    ...(typeof value === "string" ? { value } : {}),
  };
}

function summarizeRule(rule) {
  const rateLimit = rule?.action?.mitigate?.rateLimit;
  return {
    name: String(rule?.name ?? "Unnamed rule"),
    active: Boolean(rule?.active),
    valid: rule?.valid !== false,
    action: actionName(rule?.action),
    ...(rateLimit
      ? {
          rateLimit: {
            algorithm: String(rateLimit.algo ?? "unknown"),
            limit: Number(rateLimit.limit),
            windowSeconds: Number(rateLimit.window),
            keyCount: asArray(rateLimit.keys).length,
          },
        }
      : {}),
    conditions: asArray(rule?.conditionGroup).flatMap((group) =>
      asArray(group?.conditions).map(safeCondition),
    ),
  };
}

function summarizeManagedRules(managedRules) {
  if (!managedRules || typeof managedRules !== "object") return [];
  return Object.entries(managedRules)
    .map(([name, rule]) => ({
      name,
      active: Boolean(rule?.active),
      action: String(rule?.action ?? "unknown"),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function summarizeConfig(config) {
  return {
    firewallEnabled: Boolean(config?.firewallEnabled),
    botIdEnabled: Boolean(config?.botIdEnabled),
    pendingChanges: asArray(config?.changes).length,
    ipRuleCount: asArray(config?.ips).length,
    rules: asArray(config?.rules).map(summarizeRule),
    legacyConditions: asArray(config?.conditions).map(summarizeRule),
    managedRules: summarizeManagedRules(config?.managedRules),
  };
}

function renderConfig(title, config) {
  const lines = [
    `## ${title}`,
    "",
    `- Firewall habilitado: ${config.firewallEnabled ? "sim" : "não"}`,
    `- BotID habilitado: ${config.botIdEnabled ? "sim" : "não"}`,
    `- Alterações pendentes informadas: ${config.pendingChanges}`,
    `- Regras por IP: ${config.ipRuleCount} (valores omitidos)`,
    `- Regras customizadas: ${config.rules.length}`,
    `- Condições legadas: ${config.legacyConditions.length}`,
    "",
  ];

  const rules = [...config.rules, ...config.legacyConditions];
  if (rules.length === 0) {
    lines.push("Nenhuma regra customizada retornada.", "");
  } else {
    lines.push(
      "| Regra | Ativa | Válida | Ação | Condições saneadas |",
      "| --- | --- | --- | --- | --- |",
    );
    for (const rule of rules) {
      const action = rule.rateLimit
        ? `${rule.action} (${rule.rateLimit.limit}/${rule.rateLimit.windowSeconds}s; ${rule.rateLimit.keyCount} chave(s))`
        : rule.action;
      const conditions = rule.conditions
        .map((condition) =>
          [
            condition.type,
            condition.operator,
            condition.negated ? "negada" : null,
            condition.value,
          ]
            .filter(Boolean)
            .join(" "),
        )
        .join("; ");
      lines.push(
        `| ${rule.name} | ${rule.active ? "sim" : "não"} | ${rule.valid ? "sim" : "não"} | ${action} | ${conditions || "—"} |`,
      );
    }
    lines.push("");
  }

  const activeManaged = config.managedRules.filter((rule) => rule.active);
  lines.push(
    `Rulesets gerenciados ativos: ${
      activeManaged.length
        ? activeManaged
            .map((rule) => `${rule.name} (${rule.action})`)
            .join(", ")
        : "nenhum"
    }.`,
    "",
  );
  return lines;
}

const active = summarizeConfig(JSON.parse(await readFile(activeFile, "utf8")));
const draft = draftFile
  ? summarizeConfig(JSON.parse(await readFile(draftFile, "utf8")))
  : null;
const lines = [
  "# Auditoria saneada do Vercel Firewall",
  "",
  "> Consulta somente de leitura. IDs, IPs, cabeçalhos, descrições, usuários e valores de condições não aprovadas são omitidos.",
  "",
  ...renderConfig("Configuração ativa", active),
  "## Draft",
  "",
  ...(draft
    ? [
        "Draft retornado pela API.",
        "",
        ...renderConfig("Configuração do draft", draft),
      ]
    : ["Nenhum draft retornado pela API.", ""]),
];
const summary = lines.join("\n");

await writeFile(outputFile, summary, "utf8");
process.stdout.write(summary);
