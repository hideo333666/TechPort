"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Article = {
  id: number;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  tags: string | null;
  isRead: boolean;
  isSaved: boolean;
};

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((s) => typeof s === "string");
  } catch {
    // fall through
  }
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ArticleRow({ article }: { article: Article }) {
  const router = useRouter();
  const [isRead, setIsRead] = useState(article.isRead);
  const [isSaved, setIsSaved] = useState(article.isSaved);
  const [, startTransition] = useTransition();

  const patch = async (patchBody: { isRead?: boolean; isSaved?: boolean }) => {
    try {
      await fetch(`/api/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchBody),
      });
    } catch {
      // best-effort
    }
    startTransition(() => router.refresh());
  };

  const onOpen = () => {
    if (!isRead) {
      setIsRead(true);
      void patch({ isRead: true });
    }
  };

  const toggleRead = () => {
    const next = !isRead;
    setIsRead(next);
    void patch({ isRead: next });
  };

  const toggleSaved = () => {
    const next = !isSaved;
    setIsSaved(next);
    void patch({ isSaved: next });
  };

  const tags = parseTags(article.tags);

  return (
    <li
      className={`rounded-lg border p-4 transition-colors ${
        isRead
          ? "border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/40 text-neutral-500 dark:text-neutral-400"
          : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onOpen}
            className={`block text-base font-medium leading-snug hover:underline ${
              isRead ? "" : "text-neutral-900 dark:text-neutral-50"
            }`}
          >
            {article.title}
          </a>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-medium">{article.source}</span>
            <span>·</span>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            {tags.length > 0 && (
              <>
                <span>·</span>
                <span className="flex flex-wrap gap-1">
                  {tags.slice(0, 6).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 text-[10px] uppercase tracking-wide"
                    >
                      {t}
                    </span>
                  ))}
                </span>
              </>
            )}
            {isRead && (
              <span className="inline-flex items-center rounded-full bg-neutral-300/70 dark:bg-neutral-700/70 px-2 py-0.5 text-[10px] tracking-wide">
                既読
              </span>
            )}
            {isSaved && (
              <span className="inline-flex items-center rounded-full bg-amber-200 dark:bg-amber-700 text-amber-900 dark:text-amber-50 px-2 py-0.5 text-[10px] tracking-wide">
                あとで読む
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-1 text-xs">
          <button
            type="button"
            onClick={toggleRead}
            className="rounded border border-neutral-300 dark:border-neutral-700 px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {isRead ? "未読に戻す" : "既読にする"}
          </button>
          <button
            type="button"
            onClick={toggleSaved}
            className={`rounded border px-2 py-1 ${
              isSaved
                ? "border-amber-400 bg-amber-100 dark:bg-amber-900/60 dark:border-amber-600"
                : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            {isSaved ? "保存を解除" : "あとで読む"}
          </button>
        </div>
      </div>
    </li>
  );
}
