import { prisma } from "@/lib/prisma";
import { ArticleList } from "@/components/articles/ArticleList";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const articles = await prisma.article.findMany({
    where: { isSaved: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <section className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold">あとで読む</h1>
        <p className="text-sm text-neutral-500">保存した記事 {articles.length} 件</p>
      </header>
      <ArticleList
        articles={articles}
        empty="あとで読む記事がありません。記事一覧で「あとで読む」ボタンを押して登録してください。"
      />
    </section>
  );
}
