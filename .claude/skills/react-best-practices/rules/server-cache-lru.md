---
title: リクエスト横断の LRU キャッシュ
impact: HIGH
impactDescription: リクエストをまたいでキャッシュ
tags: server, cache, lru, cross-request
---

## リクエスト横断の LRU キャッシュ

`React.cache()` はひとつのリクエスト内でしか効かない。ユーザーがボタン A を押した直後にボタン B を押すといった、連続するリクエスト間で共有したいデータには LRU キャッシュを使う。

**実装例:**

```typescript
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: 5 * 60 * 1000  // 5 分
})

export async function getUser(id: string) {
  const cached = cache.get(id)
  if (cached) return cached

  const user = await db.user.findUnique({ where: { id } })
  cache.set(id, user)
  return user
}

// リクエスト 1: DB クエリ、結果がキャッシュされる
// リクエスト 2: キャッシュヒット、DB クエリは走らない
```

数秒以内に複数エンドポイントが同じデータを必要とするような、連続したユーザー操作に有効。

**Vercel の [Fluid Compute](https://vercel.com/docs/fluid-compute) を使うと:** 複数の同時リクエストが同じ関数インスタンスとキャッシュを共有できるため LRU キャッシュが特に効く。Redis のような外部ストレージなしでキャッシュがリクエスト横断で維持される。

**従来のサーバレス環境では:** 各起動が独立して走るため、プロセス間キャッシュには Redis を検討する。

参考: [https://github.com/isaacs/node-lru-cache](https://github.com/isaacs/node-lru-cache)
