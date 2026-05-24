---
title: Storage API 呼び出しをキャッシュする
impact: LOW-MEDIUM
impactDescription: 高コストな I/O を削減
tags: javascript, localStorage, storage, caching, performance
---

## Storage API 呼び出しをキャッシュする

`localStorage` / `sessionStorage` / `document.cookie` は同期かつ高コスト。読み取り結果をメモリにキャッシュする。

**誤り (毎呼び出しでストレージを読む):**

```typescript
function getTheme() {
  return localStorage.getItem('theme') ?? 'light'
}
// 10 回呼ぶ = ストレージ 10 回読み
```

**正解 (Map でキャッシュ):**

```typescript
const storageCache = new Map<string, string | null>()

function getLocalStorage(key: string) {
  if (!storageCache.has(key)) {
    storageCache.set(key, localStorage.getItem(key))
  }
  return storageCache.get(key)
}

function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value)
  storageCache.set(key, value)  // キャッシュを同期する
}
```

hook ではなく Map を使うので、ユーティリティでもイベントハンドラでも、React コンポーネント以外でも使える。

**Cookie のキャッシュ:**

```typescript
let cookieCache: Record<string, string> | null = null

function getCookie(name: string) {
  if (!cookieCache) {
    cookieCache = Object.fromEntries(
      document.cookie.split('; ').map(c => c.split('='))
    )
  }
  return cookieCache[name]
}
```

**重要 (外部からの変更時には invalidate する):**

ストレージが外部 (別タブ、サーバ設定の cookie 等) から変わり得るなら、キャッシュを破棄する:

```typescript
window.addEventListener('storage', (e) => {
  if (e.key) storageCache.delete(e.key)
})

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    storageCache.clear()
  }
})
```
