---
title: グローバルイベントリスナを重複排除する
impact: LOW
impactDescription: N コンポーネントに対して 1 リスナ
tags: client, swr, event-listeners, subscription
---

## グローバルイベントリスナを重複排除する

`useSWRSubscription()` を使って、グローバルなイベントリスナを複数のコンポーネントインスタンス間で共有する。

**誤り (インスタンス N 個 = リスナ N 個):**

```tsx
function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === key) {
        callback()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback])
}
```

`useKeyboardShortcut` フックを複数回使うと、それぞれのインスタンスが新しいリスナを登録してしまう。

**正解 (インスタンス N 個 = リスナ 1 個):**

```tsx
import useSWRSubscription from 'swr/subscription'

// キーごとにコールバックを束ねるモジュールレベルの Map
const keyCallbacks = new Map<string, Set<() => void>>()

function useKeyboardShortcut(key: string, callback: () => void) {
  // このコールバックを Map に登録
  useEffect(() => {
    if (!keyCallbacks.has(key)) {
      keyCallbacks.set(key, new Set())
    }
    keyCallbacks.get(key)!.add(callback)

    return () => {
      const set = keyCallbacks.get(key)
      if (set) {
        set.delete(callback)
        if (set.size === 0) {
          keyCallbacks.delete(key)
        }
      }
    }
  }, [key, callback])

  useSWRSubscription('global-keydown', () => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && keyCallbacks.has(e.key)) {
        keyCallbacks.get(e.key)!.forEach(cb => cb())
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })
}

function Profile() {
  // 複数のショートカットが同じリスナを共有する
  useKeyboardShortcut('p', () => { /* ... */ }) 
  useKeyboardShortcut('k', () => { /* ... */ })
  // ...
}
```
