# TechPort — Claude Code 向けプロジェクトガイド

個人用のローカル限定 IT ニュース集約ポータル。複数の RSS/Atom フィード (Qiita / Zenn / ITmedia / @IT / はてなブログ等) を `node-cron` で定期収集し、Next.js の画面で一覧・既読管理する。

要件定義: [`docs/requirements.md`](docs/requirements.md) (ISO/IEC/IEEE 29148 準拠) — MVP スコープは 10 章を参照。

## スタック

- Next.js 16 (App Router, Turbopack)
- React 19
- Prisma 6 + SQLite (`prisma/dev.db`)
- `rss-parser` (RSS/Atom 取得) / `node-cron` (定期実行) / `zod` (入力検証)
- Tailwind CSS 4

## 開発コマンド

| コマンド | 用途 |
| --- | --- |
| `npm run dev` | 開発サーバ起動 (127.0.0.1:3000)。`instrumentation.ts` 経由で `startScheduler` が走り、`COLLECT_CRON` の間隔で `collectAll` を実行 |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番モード起動 (127.0.0.1:3000) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:generate` | Prisma Client 再生成 |

## ディレクトリ構成

- `src/app/` — App Router
  - `page.tsx` 記事一覧 (FR-06)
  - `feeds/page.tsx` フィード管理 (FR-03)
  - `saved/page.tsx` あとで読む (FR-11)
  - `api/feeds/route.ts` フィード登録/一覧 (FR-01)
  - `api/articles/[id]/route.ts` 既読・save 状態の PATCH (FR-10/FR-11)
  - `api/collect/route.ts` 手動収集トリガー (FR-04)
- `src/server/` — サーバ専用ロジック
  - `collector.ts` バッチ本体 (フィードごとに 500ms 間隔、重複は URL UNIQUE でスキップ、例外で全体停止しない)
  - `rss.ts` `rss-parser` ラッパ (15 秒タイムアウト)
  - `scheduler.ts` `node-cron` 起動
- `src/components/` — Server/Client コンポーネント
- `src/lib/` — `prisma.ts` シングルトン、`logger.ts` 構造化ログ (ISO8601, JSON)
- `prisma/` — `schema.prisma` と `migrations/`

## 設計方針

- **MVP スコープ** (実装済): FR-01, FR-03, FR-04, FR-05, FR-06, FR-09, FR-10, FR-11
- **Phase 2** (未着手): FR-02 フィード削除/無効化、FR-07 キーワード検索、FR-08 タグフィルタ
- **将来枠** (要件定義 9 章): LLM 要約、通知、モバイル対応、マルチユーザ等
- 認証は **意図的に未実装** (NFR-04 ローカル限定 / NFR-05)。外部公開する場合は要再設計。
- フィード追加でソース修正不要 (NFR-08)。RSS 取得ロジックとフィード定義は分離 (NFR-09)。

## 環境変数 (`.env`)

| キー | 必須 | 既定値 | 用途 |
| --- | --- | --- | --- |
| `DATABASE_URL` | 必須 | `file:./prisma/dev.db` | SQLite パス |
| `COLLECT_CRON` | 任意 | `*/30 * * * *` | 収集スケジュール (OR-01) |
| `LOG_FILE` | 任意 | 未設定 (stdout のみ) | ログ出力先 (OR-02) |
| `NODE_ENV` | 任意 | `development` | Next.js / Prisma の挙動 |

## 注意事項

- 外部公開不可 (NFR-04)。`next dev/start` は `-H 127.0.0.1` 固定。
- 外部リンクには `rel="noopener noreferrer"` 付与必須 (NFR-07)。`ArticleRow.tsx` 参照。
- バックアップは `cp prisma/dev.db prisma/dev.db.bak` で十分 (OR-03)。
- 収集失敗で全体クラッシュさせない方針 (FR-05) — `collector.ts` の try/catch を維持。
