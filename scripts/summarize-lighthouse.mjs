import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const [reportDirectory = ".lighthouseci", outputFile] = process.argv.slice(2);
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
const reports = [];

for (const file of files) {
  const report = JSON.parse(
    await readFile(path.join(reportDirectory, file), "utf8"),
  );
  if (report.lighthouseVersion && report.audits && report.finalUrl) {
    // Lighthouse persists collection settings in the LHR. Protected Preview
    // headers must never become part of an uploaded artifact.
    delete report.configSettings?.extraHeaders;
    await writeFile(
      path.join(reportDirectory, file),
      `${JSON.stringify(report)}\n`,
      "utf8",
    );
    reports.push(report);
  }
}

if (reports.length === 0) {
  throw new Error(`No Lighthouse reports found in ${reportDirectory}.`);
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
  "| Rota | Performance | FCP | LCP | TBT | CLS | Speed Index | Transferência |",
  "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
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
  lines.push(
    `| ${route} | ${performance.toFixed(0)} | ${values.join(" | ")} |`,
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
