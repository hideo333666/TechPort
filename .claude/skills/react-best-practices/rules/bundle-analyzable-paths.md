---
title: 静的解析可能なパスを優先する
impact: HIGH
impactDescription: バンドルとファイルトレースが意図せず広がるのを防ぐ
tags: bundle, nextjs, vite, webpack, rollup, esbuild, path
---

## 静的解析可能なパスを優先する

ビルドツールは import やファイルシステムパスがビルド時に明白であるほどうまく機能する。実際のパスを変数の中に隠したり、動的に組み立てすぎたりすると、ツールは安全側に倒すために候補ファイルを広く含めるか、解析不能を警告するか、ファイルトレーシングの範囲を広げざるをえなくなる。

到達可能なファイル集合を狭く予測可能に保つため、明示的なマップやリテラルなパスを優先する。これは `import()` でモジュールを選ぶ場合も、サーバ / ビルドコードでファイルを読む場合も同じルール。

解析範囲が広がると現実的なコストがかかる:
- サーババンドルが大きくなる
- ビルドが遅くなる
- コールドスタートが悪化する
- メモリ使用量が増える

### import パス

**誤り (バンドラから何が import され得るか分からない):**

```ts
const PAGE_MODULES = {
  home: './pages/home',
  settings: './pages/settings',
} as const

const Page = await import(PAGE_MODULES[pageName])
```

**正解 (許可されたモジュールの明示的なマップを使う):**

```ts
const PAGE_MODULES = {
  home: () => import('./pages/home'),
  settings: () => import('./pages/settings'),
} as const

const Page = await PAGE_MODULES[pageName]()
```

### ファイルシステムパス

**誤り (2 値の enum でも最終パスが静的解析から見えない):**

```ts
const baseDir = path.join(process.cwd(), 'content/' + contentKind)
```

**正解 (呼び出し箇所ごとに最終パスをリテラルにする):**

```ts
const baseDir =
  kind === ContentKind.Blog
    ? path.join(process.cwd(), 'content/blog')
    : path.join(process.cwd(), 'content/docs')
```

Next.js のサーバコードでは、これは出力ファイルトレーシングにも効いてくる。Next.js は `import` / `require` / `fs` の使用を静的に解析するため、`path.join(process.cwd(), someVar)` だとトレース対象が広がる可能性がある。

参考: [Next.js output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) / [Next.js dynamic imports](https://nextjs.org/learn/seo/dynamic-imports) / [Vite features](https://vite.dev/guide/features.html) / [esbuild API](https://esbuild.github.io/api/) / [Rollup dynamic import vars](https://www.npmjs.com/package/@rollup/plugin-dynamic-import-vars) / [Webpack dependency management](https://webpack.js.org/guides/dependency-management/)
