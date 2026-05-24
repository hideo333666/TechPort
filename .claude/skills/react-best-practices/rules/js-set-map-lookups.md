---
title: O(1) ルックアップには Set / Map を使う
impact: LOW-MEDIUM
impactDescription: O(n) から O(1) へ
tags: javascript, set, map, data-structures, performance
---

## O(1) ルックアップには Set / Map を使う

繰り返しメンバーシップチェックするなら、配列を Set / Map に変換する。

**誤り (チェックごとに O(n)):**

```typescript
const allowedIds = ['a', 'b', 'c', ...]
items.filter(item => allowedIds.includes(item.id))
```

**正解 (チェックごとに O(1)):**

```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])
items.filter(item => allowedIds.has(item.id))
```
