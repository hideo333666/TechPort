---
title: `React.cache()` によるリクエスト単位の重複排除
impact: MEDIUM
impactDescription: リクエスト内で重複排除
tags: server, cache, react-cache, deduplication
---

## `React.cache()` によるリクエスト単位の重複排除

サーバ側のリクエスト単位重複排除には `React.cache()` を使う。認証チェックと DB クエリで特に効果が高い。

**使い方:**

```typescript
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null
  return await db.user.findUnique({
    where: { id: session.user.id }
  })
})
```

ひとつのリクエスト内で `getCurrentUser()` を何度呼び出しても、クエリは 1 回しか走らない。

**引数にインラインオブジェクトを渡さない:**

`React.cache()` は `Object.is` による浅い等価比較でキャッシュヒットを判定する。インラインオブジェクトは呼び出すたびに新しい参照になるので、キャッシュにヒットしない。

**誤り (常にキャッシュミス):**

```typescript
const getUser = cache(async (params: { uid: number }) => {
  return await db.user.findUnique({ where: { id: params.uid } })
})

// 毎回新しいオブジェクトが作られるのでキャッシュにヒットしない
getUser({ uid: 1 })
getUser({ uid: 1 })  // キャッシュミス、クエリが再実行される
```

**正解 (キャッシュヒット):**

```typescript
const getUser = cache(async (uid: number) => {
  return await db.user.findUnique({ where: { id: uid } })
})

// プリミティブ引数は値の等価性で比較される
getUser(1)
getUser(1)  // キャッシュヒット、キャッシュされた結果を返す
```

どうしてもオブジェクトを渡したいなら、同じ参照を渡すこと:

```typescript
const params = { uid: 1 }
getUser(params)  // クエリ実行
getUser(params)  // キャッシュヒット (同じ参照)
```

**Next.js 固有のメモ:**

Next.js では `fetch` API がリクエストメモ化で拡張されている。同じ URL とオプションのリクエストはひとつのリクエスト内で自動的に重複排除されるため、`fetch` 呼び出しに `React.cache()` を被せる必要はない。ただし、`React.cache()` は他の非同期処理にとって依然必須:

- DB クエリ (Prisma / Drizzle 等)
- 重い計算
- 認証チェック
- ファイルシステム操作
- `fetch` 以外の非同期処理

これらをコンポーネントツリー全体で重複排除するときに `React.cache()` を使う。

参考: [React.cache documentation](https://react.dev/reference/react/cache)
