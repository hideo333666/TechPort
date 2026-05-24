# 翻訳に関する注記

このディレクトリ配下のドキュメントは [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) の
`skills/react-best-practices` を日本語化したものです。

## 翻訳ベース

- 上流リポジトリ: `vercel-labs/agent-skills`
- ブランチ: `main`
- 翻訳ベース commit: `18a24346600009dc3fcb99e4b2cd83b301601775`
- 取得日時 (UTC): `2026-05-22T17:27:28Z` (上流の最新コミット日時)
- ライセンス: MIT (上流 `SKILL.md` の frontmatter に明記)

## 翻訳対象 / 対象外

| 区分 | 扱い |
| --- | --- |
| 散文 (見出し / 説明段落 / リスト / テーブルセル) | 翻訳済み |
| frontmatter の値 (`title` / `impactDescription` / `description`) | 翻訳済み (数値・倍率は原文維持) |
| コード例 (` ```tsx ` 等のブロック) のコード行 | 翻訳しない |
| コード例の中の自然言語コメント | 翻訳済み |
| ファイル名 (`rules/async-parallel.md` 等) | 翻訳しない |
| frontmatter のキー名 (`title:` / `tags:` / `impact:`) | 翻訳しない |
| kebab-case ルール ID (`async-parallel` / `server-cache-react` 等) | 翻訳しない |
| `metadata.json` | 触らない |
| `AGENTS.md` | **触らない** (上流の build スクリプトで `rules/` から自動生成されるため、ここを翻訳しても上流再生成で上書きされる) |
| `README.md` | 触らない (上流保守者向けのビルド説明) |

## 上流更新の追従手順

1. 上流の最新 commit SHA を確認: `gh api repos/vercel-labs/agent-skills/commits/main --jq '.sha'`
2. 上記「翻訳ベース commit」と SHA が異なれば、tarball を再取得して
   `diff -r <new>/skills/react-best-practices/ ./` で差分ファイルを特定。
3. 差分のあった `rules/*.md` / `SKILL.md` / `_sections.md` のみ翻訳更新。
4. `AGENTS.md` は毎回そのまま上書き (翻訳対象外)。
5. 新規 rule が追加されていれば、本ファイルの「翻訳ベース commit」を更新し、
   `_translation_glossary.md` の用語表に必要なら追記。

## 用語統一

`_translation_glossary.md` を参照してください。翻訳の一貫性のため、
新規翻訳・既存修正時はグロッサリ準拠とします。
