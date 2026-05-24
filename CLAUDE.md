<!-- claude-setup:base -->
# プロジェクトルール (base)

このファイルは [claude-setup](https://github.com/hideo333666/claude-setup) によって
インストールされます。`base` セクションは全プロジェクト共通で適用されます。
言語固有のセクションは `install.sh --lang <name>` によって下に追記されます。

## コミュニケーション

- ユーザーの言語に合わせる (英語 / 日本語)。
- 簡潔に。デフォルトは短い回答にし、求められたときだけ詳しく説明する。
- 重要度の高い変更を提案するときは、実装前にトレードオフを 1 文で示す。

## コード

- 新規ファイルを作る前に、まず既存ファイルの編集で済まないか検討する。
- 現在のタスクに不要な抽象化・ヘルパー・フィーチャーフラグを導入しない。
- コードが何をしているか繰り返すだけのコメントは書かない。自明でない
  「なぜ」(不変条件・回避策・隠れた制約) のときだけコメントを書く。
- 起こり得ないケースのエラーハンドリングを足さない。検証は信頼境界
  (ユーザー入力・外部 API) でのみ行う。
- コードを消すときは実際に消す。「removed: ...」のようなコメントや
  コメントアウトされたブロックを残さない。

## ツール

- `make` / `npm run` / `just` など、プロジェクト固有のスクリプトが
  あればアドホックなコマンドより優先する。
- ユーザーから明示的に頼まれない限り、commit hook をスキップしない
  (`--no-verify` を使わない)。
- 破壊的な git 操作 (`reset --hard` / `push --force` / `branch -D` 等)
  を、明示的な確認なしに実行しない。

## シークレット

- シークレット・トークン・認証情報は絶対にコミットしない。
  `.env*` / `*credentials*` / `*secret*` にマッチするファイルは
  ステージング前に確認する。


<!-- claude-setup:lang:nextjs -->
## React

### 規約
- 関数コンポーネント + Hooks のみ。クラスコンポーネントや旧来の
  ライフサイクルメソッドを新規に持ち込まない。
- コンポーネントは小さく純粋に保つ。デフォルトでグローバルストアに
  頼らず、まずは state のリフトアップで考える。
- コンポーネント / スタイル / テストは同じ場所に置く。プロジェクトが
  別レイアウトを強制している場合はそれに従う。
- 既にプロジェクトで使われている状態管理ライブラリ (Zustand / Redux
  Toolkit / Jotai / TanStack Query 等) を使う。新しいものを足さない。
- `useEffect` よりコンポジションを優先する。`useEffect` は本物の副作用
  のみに使い、props から state を派生させる用途には使わない。
- Hooks のルール (安定した識別子・条件分岐内で呼ばない・依存配列を
  網羅) を守る。

### テスト (React)
- React Testing Library + Vitest または Jest を使う。Enzyme は新規に
  導入しない。
- `data-testid` ではなく、role / label / text でクエリする。
- コンポーネントツリー全体のスナップショットを取らない。挙動を
  アサートする。

## Next.js

### ディレクトリ構成
- App Router を新規採用する場合は以下を基準にする (Pages Router 既存
  プロジェクトではこれを強制せず既存構成に従う)。

  ```
  .
  ├── src/                       # 任意。採用する場合は app/ も src/ 配下に置く
  │   ├── app/                   # App Router のルートツリー
  │   │   ├── layout.tsx         # ルートレイアウト (必須)
  │   │   ├── page.tsx           # ルートページ
  │   │   ├── loading.tsx        # Suspense フォールバック (任意)
  │   │   ├── error.tsx          # エラーバウンダリ (任意)
  │   │   ├── not-found.tsx      # 404 (任意)
  │   │   ├── globals.css        # グローバルスタイル
  │   │   ├── (marketing)/       # Route Group: URL に含めず構造のみ分離
  │   │   ├── (app)/             # 認証後セクションなど
  │   │   ├── api/               # Route Handler (route.ts)
  │   │   └── _components/       # Private Folder: ルーティング対象外
  │   ├── components/            # 横断的に再利用する UI
  │   │   ├── ui/                # primitives (Button, Input, ...)
  │   │   └── <feature>/         # 機能別ドメイン部品
  │   ├── features/              # 機能単位のドメインロジック (任意)
  │   │   └── <feature>/{components,hooks,api,types}.ts
  │   ├── lib/                   # フレームワーク非依存の純粋ロジック
  │   ├── server/                # サーバ専用ユーティリティ ("server-only")
  │   ├── hooks/                 # 汎用カスタムフック
  │   ├── styles/                # Tailwind 設定や追加 CSS
  │   ├── types/                 # 共有型定義
  │   └── middleware.ts          # ルートはここ (src/ 採用時)
  ├── public/                    # 静的アセット (画像 / fonts / robots.txt)
  ├── tests/ または __tests__/    # E2E や統合テスト置き場
  ├── next.config.ts
  ├── tsconfig.json              # paths に "@/*": ["./src/*"] を設定
  ├── package.json
  └── .env.local                 # ローカル環境変数 (コミットしない)
  ```

- ルーティング規約:
  - `(group)/` は URL に出さない論理グループ化。レイアウト分割に使う。
  - `_folder/` は Private Folder。ルーティング対象から除外され、
    `app/` 配下にコンポーネントや fetcher を同居させたいときに使う。
  - 動的セグメントは `[id]` / catch-all は `[...slug]` / optional は
    `[[...slug]]`。
  - 並列ルートは `@slot`、インターセプトルートは `(.)` / `(..)`。
- コロケーション原則: ページ固有のコンポーネント・テスト・スタイルは
  そのルートセグメント直下に置く。横断的に使うものだけ
  `components/` / `lib/` に昇格させる。
- `src/` を採用するか否かはプロジェクト方針に従う。混在させない。
- `tsconfig.json` の `paths` は `@/*` を 1 種類だけ定義する。
  深い相対パス (`../../../`) を避けるための最低限の alias に留め、
  乱立させない。

### 規約
- ルーター方式を自動判定する。`app/` ディレクトリがあれば App Router、
  `pages/` があれば Pages Router。既存のものに合わせ、明示的な依頼が
  ない限りルーターを移行しない。
- App Router では Server Components がデフォルト。`"use client"` は
  本当にクライアント機能 (state / 副作用 / ブラウザ API /
  イベントハンドラ) が必要なときだけ付ける。
- データ取得は消費する場所の近くに置く (Server Component の `fetch` /
  Route Handler / Server Action)。サーバ取得のためだけにクライアント
  側のデータレイヤを持ち込まない。
- ファイルベースルーティングの名前はフレームワーク契約の一部。
  `page.tsx` / `layout.tsx` / `loading.tsx` / `error.tsx` / `route.ts` /
  `middleware.ts` をリネームしない。
- 内部ナビゲーションと画像は素の `<a>` / `<img>` ではなく `next/link` /
  `next/image` を使う。
- env 変数の分離を尊重する。`NEXT_PUBLIC_*` のみブラウザに渡り、
  それ以外はサーバ専用。Client Component からサーバシークレットを
  読まない。
- App Router のキャッシュ指定 (`fetch` のキャッシュオプション /
  `revalidate` / `dynamic`) は意図を持って使う。キャッシュ由来の
  不具合を黙らせるために `force-dynamic` を振りまかず、根本原因を
  特定する。

### ツール
- `next dev` / `next build` / `next start` はプロジェクトの npm
  スクリプト経由で実行する。
- 完了とする前に `next lint` (またはプロジェクトの lint スクリプト) と
  `npx tsc --noEmit` を実行する。

### テスト (Next.js)
- 単体 / コンポーネント: Vitest または Jest + React Testing Library。
- E2E: 既に Playwright があるならそれを使う。隣に Cypress を追加しない。
- Server Component で `fetch` をモックしない。実テストバックエンドか、
  本当に必要なときだけ MSW を使う。

### パフォーマンス参考資料
- `.claude/skills/react-best-practices/` に Vercel Engineering の
  React / Next.js パフォーマンス最適化ルール集 (70 ルール / 8 カテゴリ /
  MIT ライセンス) が同梱されています (`/react-best-practices` で呼び出し
  可)。バンドルサイズ削減・データウォーターフォール解消・Server Component
  最適化・再レンダリング抑制などの具体的なレシピが必要なときに
  `SKILL.md` から該当カテゴリの `rules/*.md` を参照してください。
- 散文・コード内コメント・frontmatter の翻訳対象値はすべて日本語化済み
  (コード自体・API 名・kebab-case ルール ID は原文維持)。翻訳ベース
  commit と上流追従手順は
  `skills/react-best-practices/_translation_notice.md` を、訳語統一表は
  `skills/react-best-practices/_translation_glossary.md` を参照してください。
- `AGENTS.md` は上流の build スクリプトで `rules/*.md` から自動生成
  されるドキュメントのため、英語のまま残しています (翻訳しても
  上流の再生成で上書きされる)。
