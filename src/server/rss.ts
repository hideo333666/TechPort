import "server-only";
import Parser from "rss-parser";

const parser = new Parser({
  timeout: 15_000,
  headers: {
    "User-Agent": "TechPort/0.1 (+local)",
  },
});

export type ParsedItem = {
  title: string;
  url: string;
  publishedAt: Date;
  tags: string[] | null;
};

function pickDate(item: Record<string, unknown>): Date {
  const candidates = [item.isoDate, item.pubDate, item.published, item.updated];
  for (const c of candidates) {
    if (typeof c === "string") {
      const d = new Date(c);
      if (!Number.isNaN(d.getTime())) return d;
    }
  }
  return new Date();
}

function pickTags(item: Record<string, unknown>): string[] | null {
  const cats = item.categories;
  if (!Array.isArray(cats)) return null;
  const list = cats
    .map((c) => {
      if (typeof c === "string") return c.trim();
      if (c && typeof c === "object" && "_" in c && typeof (c as { _: unknown })._ === "string") {
        return (c as { _: string })._.trim();
      }
      return "";
    })
    .filter(Boolean);
  return list.length > 0 ? list : null;
}

export async function fetchFeed(url: string): Promise<ParsedItem[]> {
  const feed = await parser.parseURL(url);
  const items: ParsedItem[] = [];
  for (const raw of feed.items ?? []) {
    const link = raw.link ?? raw.guid;
    const title = raw.title;
    if (!link || !title) continue;
    items.push({
      title: title.trim(),
      url: link,
      publishedAt: pickDate(raw as Record<string, unknown>),
      tags: pickTags(raw as Record<string, unknown>),
    });
  }
  return items;
}
