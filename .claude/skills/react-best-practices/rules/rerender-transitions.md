---
title: 緊急でない更新にはトランジションを使う
impact: MEDIUM
impactDescription: UI の応答性を維持
tags: rerender, transitions, startTransition, performance
---

## 緊急でない更新にはトランジションを使う

頻繁に走る・緊急でない state 更新はトランジションとしてマークし、UI の応答性を保つ。

**誤り (スクロールごとに UI がブロックされる):**

```tsx
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

**正解 (ノンブロッキングな更新):**

```tsx
import { startTransition } from 'react'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => {
      startTransition(() => setScrollY(window.scrollY))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```
