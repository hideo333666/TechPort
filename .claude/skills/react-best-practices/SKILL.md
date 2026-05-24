---
name: react-best-practices
description: Vercel Engineering による React と Next.js のパフォーマンス最適化ガイドライン。React / Next.js コードの記述・レビュー・リファクタリング時に最適なパフォーマンスパターンを確保するために使用する。React コンポーネント・Next.js ページ・データ取得・バンドル最適化・パフォーマンス改善に関するタスクで発火する。
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# Vercel React Best Practices

Vercel が保守する、React および Next.js アプリケーション向けの包括的なパフォーマンス最適化ガイド。8 カテゴリ・70 ルールを影響度順に整理し、自動リファクタリングとコード生成を導くために使う。

> 日本語化に関するメモは `_translation_notice.md` を、用語統一表は `_translation_glossary.md` を参照してください。本文・コードコメントは日本語化されていますが、コード自体・API 名・kebab-case ルール ID は原文のまま維持しています。

## 適用する場面

以下のときにこのガイドラインを参照する:

- 新しい React コンポーネントや Next.js ページを書くとき
- データ取得 (クライアント / サーバ) を実装するとき
- コードをパフォーマンス観点でレビューするとき
- 既存の React / Next.js コードをリファクタリングするとき
- バンドルサイズやロード時間を最適化するとき

## 優先度別ルールカテゴリ

| 優先度 | カテゴリ | 影響度 | 接頭辞 |
|--------|----------|--------|--------|
| 1 | ウォーターフォール解消 | CRITICAL | `async-` |
| 2 | バンドルサイズ最適化 | CRITICAL | `bundle-` |
| 3 | サーバサイドパフォーマンス | HIGH | `server-` |
| 4 | クライアントサイドデータ取得 | MEDIUM-HIGH | `client-` |
| 5 | 再レンダリング最適化 | MEDIUM | `rerender-` |
| 6 | レンダリングパフォーマンス | MEDIUM | `rendering-` |
| 7 | JavaScript パフォーマンス | LOW-MEDIUM | `js-` |
| 8 | 上級パターン | LOW | `advanced-` |

## クイックリファレンス

### 1. ウォーターフォール解消 (CRITICAL)

- `async-cheap-condition-before-await` — await の前に安価な同期条件をチェックする
- `async-defer-await` — 実際に使う分岐の中まで await を遅らせる
- `async-parallel` — 独立した操作には `Promise.all()` を使う
- `async-dependencies` — 部分的に依存する取得には better-all を使う
- `async-api-routes` — API ルートでは promise を早く開始し、await は遅らせる
- `async-suspense-boundaries` — `<Suspense>` でコンテンツをストリーミングする

### 2. バンドルサイズ最適化 (CRITICAL)

- `bundle-barrel-imports` — バレルファイルを避け、直接 import する
- `bundle-analyzable-paths` — 静的解析可能な import / ファイルパスを優先し、トレースとバンドルが肥大化するのを防ぐ
- `bundle-dynamic-imports` — 重いコンポーネントには `next/dynamic` を使う
- `bundle-defer-third-party` — アナリティクス / ロギングはハイドレーション後にロードする
- `bundle-conditional` — 機能が有効になったときだけモジュールをロードする
- `bundle-preload` — 体感速度向上のため hover / focus でプリロードする

### 3. サーバサイドパフォーマンス (HIGH)

- `server-auth-actions` — Server Action を API ルートと同様に認証する
- `server-cache-react` — リクエスト単位の重複排除に `React.cache()` を使う
- `server-cache-lru` — リクエスト横断のキャッシュに LRU キャッシュを使う
- `server-dedup-props` — RSC props で同じデータを二重シリアライズしない
- `server-hoist-static-io` — 静的 I/O (フォント / ロゴ) はモジュールレベルにホイストする
- `server-no-shared-module-state` — RSC / SSR でリクエスト由来のミュータブル状態をモジュールレベルに置かない
- `server-serialization` — クライアントコンポーネントに渡すデータを最小化する
- `server-parallel-fetching` — 取得を並列化できるようコンポーネント構成を見直す
- `server-parallel-nested-fetching` — アイテムごとのネストした取得は `Promise.all` で並列化する
- `server-after-nonblocking` — ブロッキングしない処理には `after()` を使う

### 4. クライアントサイドデータ取得 (MEDIUM-HIGH)

- `client-swr-dedup` — リクエストの自動重複排除に SWR を使う
- `client-event-listeners` — グローバルなイベントリスナを重複登録しない
- `client-passive-event-listeners` — スクロール系にはパッシブリスナを使う
- `client-localstorage-schema` — localStorage データはバージョン管理し、最小化する

### 5. 再レンダリング最適化 (MEDIUM)

- `rerender-defer-reads` — コールバック内でしか使わない state を購読しない
- `rerender-memo` — 重い処理をメモ化コンポーネントへ切り出す
- `rerender-memo-with-default-value` — 非プリミティブのデフォルト props はホイストする
- `rerender-dependencies` — エフェクトの依存配列にはプリミティブを使う
- `rerender-derived-state` — 生の値ではなく派生したブール値を購読する
- `rerender-derived-state-no-effect` — 派生 state はエフェクトではなくレンダリング中に計算する
- `rerender-functional-setstate` — コールバックを安定化させるため関数形式の `setState` を使う
- `rerender-lazy-state-init` — 重い初期値は `useState` に関数を渡して遅延初期化する
- `rerender-simple-expression-in-memo` — 単純なプリミティブには `memo` を使わない
- `rerender-split-combined-hooks` — 独立した依存を持つ hook は分割する
- `rerender-move-effect-to-event` — インタラクション由来のロジックはイベントハンドラに移す
- `rerender-transitions` — 緊急でない更新には `startTransition` を使う
- `rerender-use-deferred-value` — 入力の応答性を保つため重いレンダリングには `useDeferredValue` を使う
- `rerender-use-ref-transient-values` — 頻繁に変わる一時的な値には ref を使う
- `rerender-no-inline-components` — コンポーネントの中でコンポーネントを定義しない

### 6. レンダリングパフォーマンス (MEDIUM)

- `rendering-animate-svg-wrapper` — SVG 要素ではなく div ラッパーをアニメーションする
- `rendering-content-visibility` — 長いリストには `content-visibility` を使う
- `rendering-hoist-jsx` — 静的な JSX はコンポーネント外へ切り出す
- `rendering-svg-precision` — SVG 座標の精度を下げる
- `rendering-hydration-no-flicker` — クライアント専用データには inline script を使う
- `rendering-hydration-suppress-warning` — 想定済みの不一致は警告を抑制する
- `rendering-activity` — 表示・非表示には Activity コンポーネントを使う
- `rendering-conditional-render` — 条件付きレンダリングは `&&` ではなく三項演算子を使う
- `rendering-usetransition-loading` — ローディング状態は `useTransition` を優先する
- `rendering-resource-hints` — プリロードには React DOM のリソースヒントを使う
- `rendering-script-defer-async` — `<script>` タグには `defer` または `async` を付ける

### 7. JavaScript パフォーマンス (LOW-MEDIUM)

- `js-batch-dom-css` — CSS 変更はクラスまたは `cssText` でまとめる
- `js-index-maps` — 繰り返し参照には Map を作る
- `js-cache-property-access` — ループ内ではオブジェクトプロパティをキャッシュする
- `js-cache-function-results` — 関数結果はモジュールレベルの Map にキャッシュする
- `js-cache-storage` — localStorage / sessionStorage の読み込みはキャッシュする
- `js-combine-iterations` — 複数の filter / map を 1 つのループにまとめる
- `js-length-check-first` — 重い比較の前に配列長をチェックする
- `js-early-exit` — 関数からは早期 return する
- `js-hoist-regexp` — RegExp の生成はループ外にホイストする
- `js-min-max-loop` — min / max には sort ではなくループを使う
- `js-set-map-lookups` — O(1) ルックアップには Set / Map を使う
- `js-tosorted-immutable` — イミュータブルにしたいときは `toSorted()` を使う
- `js-flatmap-filter` — map と filter を 1 パスで行うには `flatMap` を使う
- `js-request-idle-callback` — 重要でない処理はブラウザのアイドル時間に遅延する

### 8. 上級パターン (LOW)

- `advanced-effect-event-deps` — `useEffectEvent` の結果をエフェクトの依存配列に入れない
- `advanced-event-handler-refs` — イベントハンドラは ref に格納する
- `advanced-init-once` — アプリ初期化はアプリロード時に 1 回だけ行う
- `advanced-use-latest` — コールバック ref を安定化させるための `useLatest`

## 使い方

各ルールファイルを読むと、詳細な説明とコード例があります:

```
rules/async-parallel.md
rules/bundle-barrel-imports.md
```

各ルールファイルには以下が含まれます:
- なぜそれが重要かの簡潔な説明
- 不正解のコード例とその説明
- 正解のコード例とその説明
- 補足情報と参考リンク

## 全ルール展開ドキュメント

全ルールを展開した完全版ガイドは `AGENTS.md` を参照してください (上流が build スクリプトで自動生成するため、本ファイルは英語のままです)。
