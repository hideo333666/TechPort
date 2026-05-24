---
title: イベントハンドラを ref に格納する
impact: LOW
impactDescription: 購読を安定化する
tags: advanced, hooks, refs, event-handlers, optimization
---

## イベントハンドラを ref に格納する

コールバックが変わるたびに再購読してほしくないエフェクトでは、コールバックを ref に格納する。

**誤り (毎レンダリングで再購読される):**

```tsx
function useWindowEvent(event: string, handler: (e) => void) {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => window.removeEventListener(event, handler)
  }, [event, handler])
}
```

**正解 (購読を安定化させる):**

```tsx
function useWindowEvent(event: string, handler: (e) => void) {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const listener = (e) => handlerRef.current(e)
    window.addEventListener(event, listener)
    return () => window.removeEventListener(event, listener)
  }, [event])
}
```

**別解: 最新版の React を使っているなら `useEffectEvent` を使う:**

```tsx
import { useEffectEvent } from 'react'

function useWindowEvent(event: string, handler: (e) => void) {
  const onEvent = useEffectEvent(handler)

  useEffect(() => {
    window.addEventListener(event, onEvent)
    return () => window.removeEventListener(event, onEvent)
  }, [event])
}
```

`useEffectEvent` は同じパターンをよりクリーンな API で提供してくれる。安定した関数参照を作り、その関数は常に最新版のハンドラを呼び出す。
