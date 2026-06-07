import "server-only";
import cron from "node-cron";
import { collectAll } from "@/server/collector";
import { log } from "@/lib/logger";

const DEFAULT_SCHEDULE = "*/30 * * * *";

const globalForScheduler = globalThis as unknown as {
  techportSchedulerStarted?: boolean;
};

export function startScheduler() {
  if (globalForScheduler.techportSchedulerStarted) return;
  globalForScheduler.techportSchedulerStarted = true;

  const schedule = process.env.COLLECT_CRON ?? DEFAULT_SCHEDULE;
  if (!cron.validate(schedule)) {
    log({
      event: "scheduler_invalid_cron",
      level: "error",
      message: `invalid COLLECT_CRON="${schedule}", scheduler not started`,
    });
    return;
  }

  cron.schedule(schedule, () => {
    void collectAll().catch((err) => {
      log({
        event: "scheduler_unexpected_error",
        level: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    });
  });

  log({ event: "scheduler_started", message: `schedule="${schedule}"` });
}
