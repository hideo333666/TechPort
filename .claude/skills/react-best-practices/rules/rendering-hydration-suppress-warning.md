---
title: 想定済みのハイドレーション不一致は警告を抑制する
impact: LOW-MEDIUM
impactDescription: 既知の差異によるノイジーなハイドレーション警告を回避
tags: rendering, hydration, ssr, nextjs
---

## 想定済みのハイドレーション不一致は警告を抑制する

SSR フレームワーク (Next.js 等) では、サーバとクライアントで意図的に異なる値がある (ランダム ID、日付、ロケール / タイムゾーン形式など)。こうした *想定済み* の不一致については、動的テキストを `suppressHydrationWarning` 付きの要素で囲んでノイジーな警告を回避する。本物のバグを隠すために使わないこと。乱用も避ける。

**誤り (既知の不一致でも警告が出る):**

```tsx
function Timestamp() {
  return <span>{new Date().toLocaleString()}</span>
}
```

**正解 (想定済みの不一致だけ抑制する):**

```tsx
function Timestamp() {
  return (
    <span suppressHydrationWarning>
      {new Date().toLocaleString()}
    </span>
  )
}
```
