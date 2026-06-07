"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function CollectButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const onClick = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/collect", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setMessage(`収集失敗: ${data.error ?? res.statusText}`);
      } else {
        setMessage(
          `収集完了: feeds=${data.feeds} / inserted=${data.inserted} / duplicates=${data.duplicates} / failed=${data.failed}`,
        );
        startTransition(() => router.refresh());
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="rounded bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 px-3 py-1.5 text-sm hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "収集中…" : "いま収集"}
      </button>
      {message && (
        <span className="text-[11px] text-neutral-500 max-w-[20rem] text-right">{message}</span>
      )}
    </div>
  );
}
