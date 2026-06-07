import "server-only";
import { prisma } from "@/lib/prisma";
import { log } from "@/lib/logger";
import { fetchFeed } from "@/server/rss";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type CollectSummary = {
  feeds: number;
  inserted: number;
  duplicates: number;
  failed: number;
  durationMs: number;
};

let running = false;

export async function collectAll(): Promise<CollectSummary> {
  if (running) {
    log({ event: "collect_skipped", message: "previous collection still running" });
    return { feeds: 0, inserted: 0, duplicates: 0, failed: 0, durationMs: 0 };
  }
  running = true;
  const startedAt = Date.now();

  let inserted = 0;
  let duplicates = 0;
  let failed = 0;

  try {
    const feeds = await prisma.feed.findMany({ where: { isActive: true } });
    log({ event: "collect_started", message: `collecting ${feeds.length} feeds` });

    for (const feed of feeds) {
      try {
        const items = await fetchFeed(feed.rssUrl);
        let feedInserted = 0;
        let feedDup = 0;
        for (const item of items) {
          const exists = await prisma.article.findUnique({ where: { url: item.url } });
          if (exists) {
            feedDup++;
            continue;
          }
          await prisma.article.create({
            data: {
              title: item.title,
              url: item.url,
              source: feed.name,
              publishedAt: item.publishedAt,
              tags: item.tags ? JSON.stringify(item.tags) : null,
            },
          });
          feedInserted++;
        }
        inserted += feedInserted;
        duplicates += feedDup;
        log({
          event: "rss_fetch_succeeded",
          feedId: feed.id,
          message: `fetched=${items.length} inserted=${feedInserted} duplicate_skipped=${feedDup}`,
          inserted: feedInserted,
          duplicate_skipped: feedDup,
        });
      } catch (err) {
        failed++;
        log({
          event: "rss_fetch_failed",
          level: "error",
          feedId: feed.id,
          message: err instanceof Error ? err.message : String(err),
        });
      }
      // NFR-06: avoid burst against upstream sites
      await sleep(500);
    }

    const summary: CollectSummary = {
      feeds: feeds.length,
      inserted,
      duplicates,
      failed,
      durationMs: Date.now() - startedAt,
    };
    log({
      event: "collect_finished",
      message: `feeds=${summary.feeds} inserted=${summary.inserted} duplicates=${summary.duplicates} failed=${summary.failed} duration_ms=${summary.durationMs}`,
      ...summary,
    });
    return summary;
  } finally {
    running = false;
  }
}
