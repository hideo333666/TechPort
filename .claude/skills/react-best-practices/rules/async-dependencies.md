---
title: 依存関係ベースの並列化
impact: CRITICAL
impactDescription: 2-10× の改善
tags: async, parallelization, dependencies, better-all
---

## 依存関係ベースの並列化

部分的に依存関係がある処理には `better-all` を使って並列度を最大化する。各タスクは可能な限り早いタイミングで自動的に開始される。

**誤り (profile が config を不要に待ってしまう):**

```typescript
const [user, config] = await Promise.all([
  fetchUser(),
  fetchConfig()
])
const profile = await fetchProfile(user.id)
```

**正解 (config と profile が並列で動く):**

```typescript
import { all } from 'better-all'

const { user, config, profile } = await all({
  async user() { return fetchUser() },
  async config() { return fetchConfig() },
  async profile() {
    return fetchProfile((await this.$.user).id)
  }
})
```

**追加依存なしの代替案:**

すべての promise を先に作っておき、最後にまとめて `Promise.all()` する手もある。

```typescript
const userPromise = fetchUser()
const profilePromise = userPromise.then(user => fetchProfile(user.id))

const [user, config, profile] = await Promise.all([
  userPromise,
  fetchConfig(),
  profilePromise
])
```

参考: [https://github.com/shuding/better-all](https://github.com/shuding/better-all)
