---
title: 派生 state を購読する
impact: MEDIUM
impactDescription: 再レンダリング頻度を削減
tags: rerender, derived-state, media-query, optimization
---

## 派生 state を購読する

連続した値ではなく、そこから派生した真偽値を購読することで、再レンダリングの頻度を下げる。

**誤り (1px 変わるたびに再レンダリングされる):**

```tsx
function Sidebar() {
  const width = useWindowWidth()  // 連続的に更新される
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

**正解 (真偽値が変わったときだけ再レンダリングされる):**

```tsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```
