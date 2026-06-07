# TechPort

IT ニュース集約ポータル（仮称）。複数の IT 系情報サイト（Qiita / Zenn / ITmedia / @IT / はてなブログ等）の RSS / Atom フィードを定期収集し、新着記事を 1 か所で閲覧するための個人用ポータル。

## ドキュメント

- 要件定義書: [`docs/requirements.md`](docs/requirements.md) (ISO/IEC/IEEE 29148 準拠)
- プロジェクトルール (Claude Code 用): [`CLAUDE.md`](CLAUDE.md)

## 採用スタック

| 項目 | 技術 |
| --- | --- |
| フロントエンド | Next.js 16 (App Router, Turbopack) / React 19 |
| バックエンド | Next.js API Routes |
| DB | SQLite (`prisma/dev.db`) |
| ORM | Prisma 6 |
| RSS 取得 | rss-parser |
| 定期実行 | node-cron |
| 入力検証 | zod |
| UI | Tailwind CSS 4 |

## ステータス

MVP 実装済み (FR-01 / FR-03 / FR-04 / FR-05 / FR-06 / FR-09 / FR-10 / FR-11)。Phase 2 (FR-02 フィード削除、FR-07 検索、FR-08 タグフィルタ) は未着手。詳細は [`CLAUDE.md`](CLAUDE.md) と要件定義書 10 章を参照。

## クイックスタート

```sh
npm install
npm run db:migrate   # 初回のみ
npm run dev          # http://127.0.0.1:3000
```

`/feeds` から RSS URL を登録 → トップの「いま収集」ボタン、もしくは `COLLECT_CRON` (既定 30 分) で自動収集される。

## 環境変数

| キー | 既定値 | 用途 |
| --- | --- | --- |
| `DATABASE_URL` | `file:./prisma/dev.db` | SQLite パス |
| `COLLECT_CRON` | `*/30 * * * *` | 収集スケジュール (OR-01) |
| `LOG_FILE` | 未設定 (stdout のみ) | ログ出力先 (OR-02) |

## バックアップ

```sh
cp prisma/dev.db prisma/dev.db.bak
```
