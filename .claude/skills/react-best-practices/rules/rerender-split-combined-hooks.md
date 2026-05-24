---
title: まとめられた hook の計算を分割する
impact: MEDIUM
impactDescription: 独立したステップの再計算を回避
tags: rerender, useMemo, useEffect, dependencies, optimization
---

## まとめられた hook の計算を分割する

ひとつの hook の中に、依存が異なる独立した処理が複数入っている場合は、別々の hook に分ける。まとめられた hook は、変更された依存を使わない処理まで含めて、全部やり直してしまう。

**誤り (`sortOrder` が変わるたびにフィルタリングまでやり直される):**

```tsx
const sortedProducts = useMemo(() => {
  const filtered = products.filter((p) => p.category === category)
  const sorted = filtered.toSorted((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  )
  return sorted
}, [products, category, sortOrder])
```

**正解 (products / category が変わったときだけフィルタを再計算する):**

```tsx
const filteredProducts = useMemo(
  () => products.filter((p) => p.category === category),
  [products, category]
)

const sortedProducts = useMemo(
  () =>
    filteredProducts.toSorted((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    ),
  [filteredProducts, sortOrder]
)
```

このパターンは、関係ない副作用を 1 つの `useEffect` にまとめてしまったときにも当てはまる。

**誤り (どちらかの依存が変わると両方のエフェクトが走る):**

```tsx
useEffect(() => {
  analytics.trackPageView(pathname)
  document.title = `${pageTitle} | My App`
}, [pathname, pageTitle])
```

**正解 (エフェクトを独立させる):**

```tsx
useEffect(() => {
  analytics.trackPageView(pathname)
}, [pathname])

useEffect(() => {
  document.title = `${pageTitle} | My App`
}, [pageTitle])
```

**注意:** プロジェクトで [React Compiler](https://react.dev/learn/react-compiler) を有効にしていれば、依存追跡が自動最適化され、こうしたケースの一部は自動で処理される。
