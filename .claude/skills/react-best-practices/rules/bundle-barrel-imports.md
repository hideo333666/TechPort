---
title: バレルファイル import を避ける
impact: CRITICAL
impactDescription: 200-800ms の import コスト、ビルド遅延
tags: bundle, imports, tree-shaking, barrel-files, performance
---

## バレルファイル import を避ける

バレルファイル経由ではなく、ソースファイルから直接 import する。そうしないと、何千もの使われないモジュールをロードしてしまう。**バレルファイル** とは、複数のモジュールを再エクスポートするエントリポイント (例: `export * from './module'` を並べた `index.js`) のこと。

主要なアイコン・コンポーネントライブラリのエントリファイルには **最大 10,000 個の再エクスポート** が並んでいることもある。多くの React パッケージで **import するだけで 200-800ms かかる** ことがあり、開発速度と本番のコールドスタートの両方に影響する。

**ツリーシェイキングだけでは助からない理由:** ライブラリが external (バンドル対象外) に指定されているとバンドラは最適化できない。一方でバンドル対象にしてツリーシェイキングを効かせようとすると、モジュールグラフ全体を解析することになりビルドが大幅に遅くなる。

**誤り (ライブラリ全体を import している):**

```tsx
import { Check, X, Menu } from 'lucide-react'
// 1,583 モジュールをロード、開発時に ~2.8s 余分にかかる
// 実行時コスト: コールドスタートごとに 200-800ms

import { Button, TextField } from '@mui/material'
// 2,225 モジュールをロード、開発時に ~4.2s 余分にかかる
```

**正解 - Next.js 13.5 以降 (推奨):**

```js
// next.config.js — ビルド時にバレル import を自動最適化
module.exports = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@mui/material']
  }
}
```

```tsx
// 通常の import 構文のまま — Next.js が直接 import に変換してくれる
import { Check, X, Menu } from 'lucide-react'
// TypeScript の型補完もそのまま、手動でパスを書き換える必要なし
```

これが推奨である理由は、TypeScript の型安全性とエディタ補完を維持しつつ、バレル import のコストを取り除けるから。

**正解 - 直接 import (Next.js 以外のプロジェクト):**

```tsx
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// 使うものだけがロードされる
```

> **TypeScript の注意:** 一部のライブラリ (特に `lucide-react`) は深い import パスに対応する `.d.ts` を同梱していない。`lucide-react/dist/esm/icons/check` から import すると暗黙の `any` に解決され、`strict` / `noImplicitAny` の下ではエラーになる。可能なら `optimizePackageImports` を優先し、直接 import を使う前に対象ライブラリがサブパスの型を提供しているか確認すること。

これらの最適化により、開発時の起動が 15-70% 高速化、ビルド時間が 28% 短縮、コールドスタートが 40% 高速化、HMR も大幅に高速化する。

よく影響を受けるライブラリ: `lucide-react` / `@mui/material` / `@mui/icons-material` / `@tabler/icons-react` / `react-icons` / `@headlessui/react` / `@radix-ui/react-*` / `lodash` / `ramda` / `date-fns` / `rxjs` / `react-use`。

参考: [How we optimized package imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
