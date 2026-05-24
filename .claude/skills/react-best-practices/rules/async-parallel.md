---
title: 独立した操作には `Promise.all()` を使う
impact: CRITICAL
impactDescription: 2-10× の改善
tags: async, parallelization, promises, waterfalls
---

## 独立した操作には `Promise.all()` を使う

非同期処理どうしに依存関係がないなら、`Promise.all()` で並列に実行する。

**誤り (逐次実行 / ラウンドトリップ 3 回):**

```typescript
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

**正解 (並列実行 / ラウンドトリップ 1 回):**

```typescript
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```
