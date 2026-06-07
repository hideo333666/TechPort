import { ArticleRow } from "./ArticleRow";

type Article = {
  id: number;
  title: string;
  url: string;
  source: string;
  publishedAt: Date;
  tags: string | null;
  isRead: boolean;
  isSaved: boolean;
};

export function ArticleList({
  articles,
  empty,
}: {
  articles: Article[];
  empty: string;
}) {
  if (articles.length === 0) {
    return (
      <p className="rounded border border-dashed border-neutral-300 dark:border-neutral-700 p-8 text-center text-sm text-neutral-500">
        {empty}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {articles.map((a) => (
        <ArticleRow
          key={a.id}
          article={{
            ...a,
            publishedAt: a.publishedAt.toISOString(),
          }}
        />
      ))}
    </ul>
  );
}
