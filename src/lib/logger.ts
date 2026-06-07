import "server-only";
import { appendFileSync } from "node:fs";

type LogLevel = "info" | "warn" | "error";

type LogPayload = {
  event: string;
  message: string;
  feedId?: number;
  level?: LogLevel;
  [extra: string]: unknown;
};

const logFile = process.env.LOG_FILE;

export function log(payload: LogPayload) {
  const entry = {
    time: new Date().toISOString(),
    level: payload.level ?? "info",
    ...payload,
  };
  const line = JSON.stringify(entry);

  if (entry.level === "error") {
    console.error(line);
  } else if (entry.level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }

  if (logFile) {
    try {
      appendFileSync(logFile, line + "\n");
    } catch {
      // Logging is best-effort; do not crash callers on FS issues.
    }
  }
}
