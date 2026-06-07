# Contributing to TechPort

個人利用前提のローカル限定アプリ (NFR-04) だが、開発は **Issue 駆動** で進める。

## ワークフロー

```
Issue 作成 → ブランチ作成 → 実装 → コミット → push → PR → main にマージ
```

### 1. Issue を作成する

`.github/ISSUE_TEMPLATE/` のテンプレートから起票する。

- **バグ**: `bug_report.yml`
- **機能要望 / 改善**: `feature_request.yml`

要件定義 ([`docs/requirements.md`](docs/requirements.md)) の FR-XX / NFR-XX に紐付くものは、本文の「関連要件」欄に番号を書く。

### 2. ブランチを切る

`<type>/<issue番号>-<短いslug>` の形式。

| type | 用途 |
| --- | --- |
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `refactor` | 挙動を変えない内部改善 |
| `docs` | ドキュメントのみ |
| `chore` | ビルド / 設定 / ツール / 雑務 |
| `test` | テスト追加 |

例:
```bash
git switch -c feat/12-keyword-search
git switch -c fix/15-feed-fetch-timeout
```

### 3. コミット

[Conventional Commits](https://www.conventionalcommits.org/) に準拠。

```
<type>: <要約>

<本文 (任意)>

Refs #<issue番号>
```

例:
```
feat: implement keyword search on article list

- adds `q` query param handling in /app/page.tsx
- uses Prisma full-text-ish LIKE for SQLite

Refs #12
```

破壊的変更がある場合は `feat!:` / `fix!:` のように `!` を付けるか、本文に `BREAKING CHANGE:` を書く。

### 4. PR

- ターゲット: `main`
- タイトル: Conventional Commits 形式（マージ後の履歴に残る前提で書く）
- 本文に **`Closes #<issue番号>`** を入れて Issue を自動 close
- マージ方式: **Squash & Merge** 推奨（Issue 単位で 1 コミットに集約）

### 5. レビュー / マージ

ソロ開発でも自分でセルフレビューしてからマージする。最低限:

- [ ] `npm run typecheck` パス
- [ ] `npm run lint` パス
- [ ] 動作確認（dev サーバで該当画面を触る）
- [ ] 関連 Issue を `Closes/Refs` で紐付け

## ローカル開発

主要コマンド・環境変数は [`CLAUDE.md`](CLAUDE.md) を参照。

## 命名規則まとめ

| 対象 | 形式 | 例 |
| --- | --- | --- |
| Issue | テンプレートが title prefix を付与 | `[Bug] ...` / `[Feature] ...` |
| ブランチ | `<type>/<issue番号>-<slug>` | `feat/12-keyword-search` |
| コミット | Conventional Commits | `feat: ...` / `fix: ...` |
| PR タイトル | Conventional Commits | `feat: ...` |
