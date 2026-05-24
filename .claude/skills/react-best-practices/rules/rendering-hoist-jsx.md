---
title: 静的な JSX 要素をホイストする
impact: LOW
impactDescription: 再生成を回避
tags: rendering, jsx, static, optimization
---

## 静的な JSX 要素をホイストする

静的な JSX はコンポーネントの外に切り出して、再生成を回避する。

**誤り (毎レンダリングで要素を作り直してしまう):**

```tsx
function LoadingSkeleton() {
  return <div className="animate-pulse h-20 bg-gray-200" />
}

function Container() {
  return (
    <div>
      {loading && <LoadingSkeleton />}
    </div>
  )
}
```

**正解 (同じ要素を使い回す):**

```tsx
const loadingSkeleton = (
  <div className="animate-pulse h-20 bg-gray-200" />
)

function Container() {
  return (
    <div>
      {loading && loadingSkeleton}
    </div>
  )
}
```

特に大きくて静的な SVG ノードに対して効果が大きい。毎レンダリングで作り直すと結構コストがかかる。

**注意:** プロジェクトで [React Compiler](https://react.dev/learn/react-compiler) を有効にしている場合、コンパイラが静的 JSX 要素を自動でホイストし、再レンダリングも最適化するため、手動ホイストは不要。
