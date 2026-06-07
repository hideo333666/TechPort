"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function FeedForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [rssUrl, setRssUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rssUrl }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? `HTTP ${res.status}`);
        return;
      }
      setName("");
      setRssUrl("");
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 flex flex-col gap-3"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400" htmlFor="feed-name">
          フィード名 (1-100 文字)
        </label>
        <input
          id="feed-name"
          type="text"
          required
          minLength={1}
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-1.5 text-sm"
          placeholder="例: Zenn トレンド"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400" htmlFor="feed-url">
          RSS URL (http / https)
        </label>
        <input
          id="feed-url"
          type="url"
          required
          value={rssUrl}
          onChange={(e) => setRssUrl(e.target.value)}
          className="rounded border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-1.5 text-sm font-mono"
          placeholder="https://zenn.dev/feed"
        />
      </div>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      <div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 px-4 py-1.5 text-sm hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "登録中…" : "登録"}
        </button>
      </div>
    </form>
  );
}
