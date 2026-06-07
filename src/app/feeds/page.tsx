import { prisma } from "@/lib/prisma";
import { FeedForm } from "@/components/feeds/FeedForm";

export const dynamic = "force-dynamic";

function formatDate(d: Date): string {
  return d.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function FeedsPage() {
  const feeds = await prisma.feed.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <section className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold">フィード管理</h1>
        <p className="text-sm text-neutral-500">登録済み {feeds.length} 件</p>
      </header>

      <FeedForm />

      <div className="rounded-lg border border-neutral-300 dark:border-neutral-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
            <tr>
              <th className="text-left px-4 py-2 font-medium">名前</th>
              <th className="text-left px-4 py-2 font-medium">RSS URL</th>
              <th className="text-left px-4 py-2 font-medium">状態</th>
              <th className="text-left px-4 py-2 font-medium">登録日時</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-950">
            {feeds.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                  まだフィードがありません。上のフォームから登録してください。
                </td>
              </tr>
            )}
            {feeds.map((f) => (
              <tr key={f.id} className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-2">{f.name}</td>
                <td className="px-4 py-2 font-mono text-xs break-all">{f.rssUrl}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${
                      f.isActive
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
                        : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    {f.isActive ? "有効" : "無効"}
                  </span>
                </td>
                <td className="px-4 py-2 text-neutral-500 text-xs">{formatDate(f.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
