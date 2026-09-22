import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const [
  reportDirectory = ".lighthouseci",
  outputFile,
  sanitizedDirectory = "lighthouse-artifact",
] = process.argv.slice(2);
const metrics = [
  ["first-contentful-paint", "FCP", "ms"],
  ["largest-contentful-paint", "LCP", "ms"],
  ["total-blocking-time", "TBT", "ms"],
  ["cumulative-layout-shift", "CLS", ""],
  ["speed-index", "Speed Index", "ms"],
  ["total-byte-weight", "Transferência", "bytes"],
];

function median(values) {
  const ordered = values.toSorted((left, right) => left - right);
  return ordered[Math.floor(ordered.length / 2)];
}

function format(value, unit) {
  if (unit === "bytes") return `${(value / 1024).toFixed(1)} KiB`;
  if (unit === "ms") return `${Math.round(value)} ms`;
  return value.toFixed(3);
}

const files = (await readdir(reportDirectory)).filter((file) =>
  file.endsWith(".json"),
);
const reportsByRun = new Map();

for (const file of files) {
  const report = JSON.parse(
    await readFile(path.join(reportDirectory, file), "utf8"),
  );
  if (report.lighthouseVersion && report.audits && report.finalUrl) {
    reportsByRun.set(`${report.finalUrl}|${report.fetchTime}`, report);
  }
}

const reports = [...reportsByRun.values()];

if (reports.length === 0) {
  throw new Error(`No Lighthouse reports found in ${reportDirectory}.`);
}

await mkdir(sanitizedDirectory, { recursive: true });
for (const [index, report] of reports.entries()) {
  // Lighthouse persists collection settings in the LHR. Protected Preview
  // headers must never become part of an uploaded artifact.
  const sanitizedReport = structuredClone(report);
  delete sanitizedReport.configSettings?.extraHeaders;
  await writeFile(
    path.join(
      sanitizedDirectory,
      `report-${String(index + 1).padStart(2, "0")}.json`,
    ),
    `${JSON.stringify(sanitizedReport)}\n`,
    "utf8",
  );
}

const grouped = Map.groupBy(reports, (report) => {
  const url = new URL(report.finalUrl);
  return url.pathname || "/";
});
const lines = [
  "# Lighthouse Preview",
  "",
  `Mediana de ${reports.length} medições (${reports[0].configSettings.formFactor}).`,
  "",
  "| Rota | Performance | FCP | LCP | TBT | CLS | Speed Index | Transferência | JavaScript | JS não usado |",
  "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
];

for (const [route, routeReports] of [...grouped].toSorted(([left], [right]) =>
  left.localeCompare(right),
)) {
  const performance = median(
    routeReports.map((report) => report.categories.performance.score * 100),
  );
  const values = metrics.map(([id, , unit]) =>
    format(
      median(routeReports.map((report) => report.audits[id].numericValue)),
      unit,
    ),
  );
  const scriptBytes = median(
    routeReports.map(
      (report) =>
        report.audits["resource-summary"].details.items.find(
          (item) => item.resourceType === "script",
        )?.transferSize ?? 0,
    ),
  );
  const unusedScriptBytes = median(
    routeReports.map(
      (report) =>
        report.audits["unused-javascript"].details?.overallSavingsBytes ?? 0,
    ),
  );
  lines.push(
    `| ${route} | ${performance.toFixed(0)} | ${values.join(" | ")} | ${format(scriptBytes, "bytes")} | ${format(unusedScriptBytes, "bytes")} |`,
  );
}

lines.push(
  "",
  "> Medição sintética de Preview. O aceite final deve considerar conteúdo representativo e dados de campo.",
  "",
);

const summary = lines.join("\n");
if (outputFile) await writeFile(outputFile, summary, "utf8");
process.stdout.write(summary);
