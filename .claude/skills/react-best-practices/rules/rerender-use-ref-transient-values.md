---
title: 一時的な値には `useRef` を使う
impact: MEDIUM
impactDescription: 高頻度更新時の不要な再レンダリングを回避
tags: rerender, useref, state, performance
---

## 一時的な値には `useRef` を使う

値が高頻度で変わり、毎更新で再レンダリングしたくないとき (マウストラッカー・インターバル・一時的なフラグ等) は、`useState` ではなく `useRef` に格納する。コンポーネント state は UI のために使い、DOM 近傍の一時的な値には ref を使う。ref を更新しても再レンダリングは発生しない。

**誤り (更新ごとに再レンダリングされる):**

```tsx
function Tracker() {
  const [lastX, setLastX] = useState(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => setLastX(e.clientX)
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: lastX,
        width: 8,
        height: 8,
        background: 'black',
      }}
    />
  )
}
```

**正解 (トラッキングで再レンダリングしない):**

```tsx
function Tracker() {
  const lastXRef = useRef(0)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastXRef.current = e.clientX
      const node = dotRef.current
      if (node) {
        node.style.transform = `translateX(${e.clientX}px)`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 8,
        height: 8,
        background: 'black',
        transform: 'translateX(0px)',
      }}
    />
  )
}
```
