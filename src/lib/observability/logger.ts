import "server-only";

type LogLevel = "error" | "info" | "warn";

export type LogEvent = {
  level: LogLevel;
  event: string;
  correlationId: string;
  module: string;
  result: string;
  durationMs?: number;
  errorCode?: string;
};

export function serializeLogEvent(event: LogEvent) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level: event.level,
    event: event.event,
    correlationId: event.correlationId,
    module: event.module,
    result: event.result,
    ...(event.durationMs === undefined
      ? {}
      : { durationMs: Math.max(0, Math.round(event.durationMs)) }),
    ...(event.errorCode ? { errorCode: event.errorCode } : {}),
  });
}

export function logEvent(event: LogEvent) {
  const serialized = serializeLogEvent(event);

  if (event.level === "error") console.error(serialized);
  else if (event.level === "warn") console.warn(serialized);
  else console.info(serialized);
}
