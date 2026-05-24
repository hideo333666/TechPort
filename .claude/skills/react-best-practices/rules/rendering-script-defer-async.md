---
title: `<script>` タグには `defer` または `async` を使う
impact: HIGH
impactDescription: 描画ブロッキングを解消
tags: rendering, script, defer, async, performance
---

## `<script>` タグには `defer` または `async` を使う

**影響度: HIGH (描画ブロッキングを解消)**

`defer` も `async` も付いていない `<script>` タグは、ダウンロードと実行の間 HTML パースをブロックする。First Contentful Paint と Time to Interactive が遅れる原因になる。

- **`defer`**: 並列ダウンロード、HTML パース完了後に実行、実行順は保証される
- **`async`**: 並列ダウンロード、準備でき次第すぐ実行、順序は保証されない

DOM や他スクリプトに依存するなら `defer`、アナリティクスのように独立しているなら `async` を使う。

**誤り (描画をブロックする):**

```tsx
export default function Document() {
  return (
    <html>
      <head>
        <script src="https://example.com/analytics.js" />
        <script src="/scripts/utils.js" />
      </head>
      <body>{/* content */}</body>
    </html>
  )
}
```

**正解 (ノンブロッキング):**

```tsx
export default function Document() {
  return (
    <html>
      <head>
        {/* 独立したスクリプトは async */}
        <script src="https://example.com/analytics.js" async />
        {/* DOM 依存のスクリプトは defer */}
        <script src="/scripts/utils.js" defer />
      </head>
      <body>{/* content */}</body>
    </html>
  )
}
```

**注意:** Next.js では、生の `<script>` タグより `strategy` prop を持つ `next/script` コンポーネントを優先する:

```tsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/analytics.js" strategy="afterInteractive" />
      <Script src="/scripts/utils.js" strategy="beforeInteractive" />
    </>
  )
}
```

参考: [MDN - Script element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#defer)
