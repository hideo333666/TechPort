---
title: 繰り返しルックアップにはインデックス Map を作る
impact: LOW-MEDIUM
impactDescription: 1M ops を 2K ops に
tags: javascript, map, indexing, optimization, performance
---

## 繰り返しルックアップにはインデックス Map を作る

同じキーで `.find()` を繰り返し呼ぶなら、Map を使う。

**誤り (ルックアップごとに O(n)):**

```typescript
function processOrders(orders: Order[], users: User[]) {
  return orders.map(order => ({
    ...order,
    user: users.find(u => u.id === order.userId)
  }))
}
```

**正解 (ルックアップごとに O(1)):**

```typescript
function processOrders(orders: Order[], users: User[]) {
  const userById = new Map(users.map(u => [u.id, u]))

  return orders.map(order => ({
    ...order,
    user: userById.get(order.userId)
  }))
}
```

Map の構築は 1 回 (O(n))、その後のルックアップはすべて O(1)。
注文 1000 件 × ユーザー 1000 件なら 100 万 ops → 2K ops に。
