# 用語統一表 (グロッサリ)

`react-best-practices` スキル配下の日本語翻訳で使用する訳語の統一表。
新規翻訳・既存修正のときは必ずここを参照する。

## 基本方針

- React / Next.js の **API 名・識別子・コード内シンボル** は原文維持
  (例: `useTransition()` / `React.cache()` / `useEffect` / `<Suspense>`)
- 確立した日本語訳がある用語はカタカナ訳
- 確立訳が無い・揺れがある用語は **原文維持** または **初出時併記**
- 数値・倍率 (`2-10×` / `15% faster` 等) は原文のまま

## 訳語表

| 英語 | 日本語訳 | 備考 |
| --- | --- | --- |
| Server Component | サーバコンポーネント (Server Component) | 初出のみ英語併記 |
| Client Component | クライアントコンポーネント (Client Component) | 初出のみ英語併記 |
| React Server Components (RSC) | React Server Components (RSC) | 原文維持 |
| Server Action | Server Action | 原文維持 |
| Route Handler | Route Handler | 原文維持 |
| App Router / Pages Router | App Router / Pages Router | 原文維持 |
| re-render | 再レンダリング | |
| render | レンダリング | |
| rendering | レンダリング | |
| hydration | ハイドレーション | |
| waterfall | ウォーターフォール | |
| bundle | バンドル | |
| bundle size | バンドルサイズ | |
| barrel import / barrel file | バレル import / バレルファイル | |
| dynamic import | 動的 import | |
| tree-shaking | ツリーシェイキング | |
| memoize / memoization | メモ化 | |
| memo (the API `memo()`) | `memo()` | API 名は原文 |
| transition | トランジション | API 名 `startTransition()` は原文 |
| derived state | 派生 state | "state" は訳さない |
| state / props / ref / hook | state / props / ref / hook | 原文維持 |
| effect | エフェクト | API 名 `useEffect` は原文 |
| event handler | イベントハンドラ | |
| event listener | イベントリスナ | |
| serialization | シリアライゼーション | |
| deserialization | デシリアライゼーション | |
| deduplication / dedup | 重複排除 | |
| cache / caching | キャッシュ / キャッシング | |
| LRU cache | LRU キャッシュ | |
| stale | 古い (stale) | 文脈で使い分け |
| revalidate | 再検証 | Next.js の `revalidate` 設定は原文維持 |
| streaming | ストリーミング | |
| Suspense (the component `<Suspense>`) | `<Suspense>` | コンポーネント名は原文 |
| Suspense boundary | Suspense 境界 | |
| boundary | 境界 | |
| fallback | フォールバック | |
| flicker | チラつき | |
| FOUC | FOUC | 略語のまま |
| critical / high / medium / low (impact) | CRITICAL / HIGH / MEDIUM / LOW | 大文字英語のまま |
| layout shift | レイアウトシフト | |
| layout thrash / thrashing | レイアウトスラッシング | |
| paint | ペイント | |
| repaint / reflow | 再ペイント / リフロー | |
| compositor | コンポジタ | |
| analytics | アナリティクス | |
| logging | ロギング | |
| telemetry | テレメトリ | |
| API route | API ルート | |
| edge / edge function | Edge / Edge Function | 原文維持 |
| middleware | ミドルウェア | |
| prefetch / preload | プリフェッチ / プリロード | |
| resource hint | リソースヒント | |
| viewport | ビューポート | |
| intersection observer | Intersection Observer | 原文維持 |
| idle callback | アイドルコールバック | API 名 `requestIdleCallback` は原文 |
| passive event listener | パッシブイベントリスナ | |
| throttle / debounce | スロットル / デバウンス | |
| immutable | イミュータブル | |
| mutable | ミュータブル | |
| inline | インライン | |
| hoist / hoisting | ホイスト / ホイスティング | |
| third-party | サードパーティ | |
| first-party | ファーストパーティ | |
| primitive (type) | プリミティブ | |
| reference (type) | 参照型 | |
| identity (object identity) | 同一性 | |

## 表記ルール

- **コードはそのまま**: `` ` `` で囲まれたシンボル・API 名・識別子は翻訳しない。
- **半角英数記号の前後**: 必要なら半角スペース 1 個 (日本語+英単語の可読性のため)。
  例: 「`useEffect` を使う」 / 「2-10× の高速化」
- **句読点**: 「、」「。」を使う。半角カンマ・ピリオドはコード内のみ。
- **箇条書きスタイル**: 上流の Markdown 構造 (`-` リスト、見出しレベル) を維持。
- **強調**: `**bold**` / `*italic*` の Markdown 構文を保つ。中身だけ訳す。
- **見出し**: `## Why` → `## なぜ重要か` / `## Pattern` → `## パターン` 等、
  上流の意図を保ちつつ自然な日本語に。

## 訳語ゆれが起きやすい単語の判断

迷ったときの方針:

- **片仮名訳と原文どちらも市民権がある場合**: 文脈で短い方を優先 (本文は読みやすさ重視)
- **API 名と紛らわしい場合**: 原文を優先
- **同一ファイル内では訳語を統一**: ファイルをまたぐと多少のゆれは許容
