# TechPort

IT ニュース集約ポータル（仮称）。複数の IT 系情報サイト（Qiita / Zenn / ITmedia / @IT / はてなブログ等）の RSS / Atom フィードを定期収集し、新着記事を 1 か所で閲覧するための個人用ポータル。

## ドキュメント

- 要件定義書: [`docs/requirements.md`](docs/requirements.md) (ISO/IEC/IEEE 29148 準拠)
- プロジェクトルール (Claude Code 用): [`CLAUDE.md`](CLAUDE.md)

## 想定スタック

| 項目 | 技術 |
| --- | --- |
| フロントエンド | Next.js (App Router) |
| バックエンド | Next.js API Routes |
| DB | SQLite |
| ORM | Prisma または Drizzle |
| RSS 取得 | rss-parser |
| 定期実行 | cron |
| UI | shadcn/ui |

## ステータス

要件定義フェーズ。MVP スコープは要件定義書 10 章を参照。
