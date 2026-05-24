---
title: ネストしたデータ取得の並列化
impact: CRITICAL
impactDescription: サーバ側ウォーターフォールを解消
tags: server, rsc, parallel-fetching, promise-chaining
---

## ネストしたデータ取得の並列化

ネストしたデータを並列で取得するときは、依存する fetch をアイテムごとの promise の中でチェーンする。そうしないと、遅いアイテム 1 個が他のすべてをブロックしてしまう。

**誤り (遅いアイテムが 1 つあるだけで全部のネスト fetch がブロックされる):**

```tsx
const chats = await Promise.all(
  chatIds.map(id => getChat(id))
)

const chatAuthors = await Promise.all(
  chats.map(chat => getUser(chat.author))
)
```

100 件のうち 1 件の `getChat(id)` が極端に遅いと、他 99 件の chat のデータは揃っているのに、その author の読み込みが始められない。

**正解 (各アイテムが自分のネスト fetch をチェーンする):**

```tsx
const chatAuthors = await Promise.all(
  chatIds.map(id => getChat(id).then(chat => getUser(chat.author)))
)
```

各アイテムが独立して `getChat` → `getUser` をチェーンするので、遅い chat があっても他の author の取得をブロックしない。
