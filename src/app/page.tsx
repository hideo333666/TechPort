import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArticleList } from "@/components/articles/ArticleList";
import { CollectButton } from "@/components/articles/CollectButton";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [articles, feedCount] = await Promise.all([
    prisma.article.findMany({
      orderBy: { publishedAt: "desc" },
      take: 100,
    }),
    prisma.feed.count({ where: { isActive: true } }),
  ]);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">記事一覧</h1>
          <p className="text-sm text-neutral-500">
            有効フィード {feedCount} 件 / 直近 {articles.length} 件を表示
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CollectButton />
          <Link
            href="/feeds"
            className="rounded border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            フィードを追加
          </Link>
        </div>
      </header>
      <ArticleList
        articles={articles}
        empty="まだ記事がありません。「いま収集」ボタンか、フィードを登録してから収集してください。"
      />
    </section>
  );
}
