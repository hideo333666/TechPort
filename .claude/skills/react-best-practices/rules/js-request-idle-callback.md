---
title: 重要でない処理は `requestIdleCallback` で遅延する
impact: MEDIUM
impactDescription: バックグラウンド処理中も UI を応答可能に保つ
tags: javascript, performance, idle, scheduling, analytics
---

## 重要でない処理は `requestIdleCallback` で遅延する

**影響度: MEDIUM (バックグラウンド処理中も UI を応答可能に保つ)**

`requestIdleCallback()` でブラウザのアイドル時間に重要でない処理をスケジュールする。メインスレッドをユーザー操作とアニメーションのために空けておけるので、ジャンクが減り体感パフォーマンスが向上する。

**誤り (ユーザー操作中にメインスレッドをブロックする):**

```typescript
function handleSearch(query: string) {
  const results = searchItems(query)
  setResults(results)

  // これらは即座にメインスレッドをブロックする
  analytics.track('search', { query })
  saveToRecentSearches(query)
  prefetchTopResults(results.slice(0, 3))
}
```

**正解 (重要でない処理はアイドル時間に遅延する):**

```typescript
function handleSearch(query: string) {
  const results = searchItems(query)
  setResults(results)

  // 重要でない処理はアイドル時間に遅らせる
  requestIdleCallback(() => {
    analytics.track('search', { query })
  })

  requestIdleCallback(() => {
    saveToRecentSearches(query)
  })

  requestIdleCallback(() => {
    prefetchTopResults(results.slice(0, 3))
  })
}
```

**必要な処理には timeout を付ける:**

```typescript
// ブラウザがビジーでも 2 秒以内にアナリティクスを発火させる
requestIdleCallback(
  () => analytics.track('page_view', { path: location.pathname }),
  { timeout: 2000 }
)
```

**大きなタスクをチャンク化する:**

```typescript
function processLargeDataset(items: Item[]) {
  let index = 0

  function processChunk(deadline: IdleDeadline) {
    // アイドル時間があるうちに処理する (1 チャンク < 50ms を目安に)
    while (index < items.length && deadline.timeRemaining() > 0) {
      processItem(items[index])
      index++
    }

    // まだ残りがあれば次のチャンクをスケジュール
    if (index < items.length) {
      requestIdleCallback(processChunk)
    }
  }

  requestIdleCallback(processChunk)
}
```

**非対応ブラウザ向けのフォールバック:**

```typescript
const scheduleIdleWork = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1))

scheduleIdleWork(() => {
  // 重要でない処理
})
```

**使うべき場面:**

- アナリティクスとテレメトリ
- localStorage / IndexedDB への state 保存
- 次操作のためのリソースプリフェッチ
- 緊急でないデータ変換
- 重要でない機能の遅延初期化

**使うべきでない場面:**

- 即座のフィードバックが要るユーザー操作
- ユーザーが結果を待っているレンダリング更新
- タイミングが厳しい処理
