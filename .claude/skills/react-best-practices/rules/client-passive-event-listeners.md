---
title: スクロール性能のためパッシブイベントリスナを使う
impact: MEDIUM
impactDescription: イベントリスナによるスクロール遅延を解消
tags: client, event-listeners, scrolling, performance, touch, wheel
---

## スクロール性能のためパッシブイベントリスナを使う

タッチ / ホイールイベントリスナに `{ passive: true }` を付けて、即時スクロールを有効にする。通常ブラウザは、リスナが `preventDefault()` を呼ぶか確かめるためリスナの完了を待つため、スクロールに遅延が出る。

**誤り:**

```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)
  
  document.addEventListener('touchstart', handleTouch)
  document.addEventListener('wheel', handleWheel)
  
  return () => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  }
}, [])
```

**正解:**

```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)
  
  document.addEventListener('touchstart', handleTouch, { passive: true })
  document.addEventListener('wheel', handleWheel, { passive: true })
  
  return () => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  }
}, [])
```

**パッシブにすべき場面:** トラッキング / アナリティクス、ロギング、`preventDefault()` を呼ばない任意のリスナ。

**パッシブにしてはいけない場面:** 独自のスワイプジェスチャ実装、独自のズーム制御、`preventDefault()` を呼ぶ必要がある任意のリスナ。
