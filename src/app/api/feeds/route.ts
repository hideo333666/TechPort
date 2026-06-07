import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fetchFeed } from "@/server/rss";
import { log } from "@/lib/logger";

const createSchema = z.object({
  name: z.string().trim().min(1, "name は 1 文字以上").max(100, "name は 100 文字以下"),
  rssUrl: z
    .string()
    .trim()
    .url("URL の形式が不正です")
    .refine((u) => /^https?:\/\//i.test(u), "http(s) スキームのみ対応"),
});

export async function GET() {
  const feeds = await prisma.feed.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ feeds });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON ボディが必要です" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join(", ") },
      { status: 400 },
    );
  }

  const existing = await prisma.feed.findUnique({ where: { rssUrl: parsed.data.rssUrl } });
  if (existing) {
    return NextResponse.json({ error: "同じ RSS URL は既に登録済みです" }, { status: 409 });
  }

  try {
    await fetchFeed(parsed.data.rssUrl);
  } catch (err) {
    log({
      event: "feed_register_reachability_failed",
      level: "warn",
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "RSS フィードを取得できません。URL を確認してください" },
      { status: 400 },
    );
  }

  const feed = await prisma.feed.create({
    data: { name: parsed.data.name, rssUrl: parsed.data.rssUrl },
  });
  return NextResponse.json({ feed }, { status: 201 });
}
