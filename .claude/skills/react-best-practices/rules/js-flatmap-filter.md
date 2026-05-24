---
title: map と filter を 1 パスで行うには `flatMap` を使う
impact: LOW-MEDIUM
impactDescription: 中間配列を排除
tags: javascript, arrays, flatMap, filter, performance
---

## map と filter を 1 パスで行うには `flatMap` を使う

**影響度: LOW-MEDIUM (中間配列を排除)**

`.map().filter(Boolean)` のチェーンは中間配列を作り、配列を 2 回走査する。`.flatMap()` を使えば 1 パスで変換 + フィルタができる。

**誤り (2 回走査、中間配列あり):**

```typescript
const userNames = users
  .map(user => user.isActive ? user.name : null)
  .filter(Boolean)
```

**正解 (1 回走査、中間配列なし):**

```typescript
const userNames = users.flatMap(user =>
  user.isActive ? [user.name] : []
)
```

**さらに例:**

```typescript
// レスポンスから有効なメールを抽出
// 修正前
const emails = responses
  .map(r => r.success ? r.data.email : null)
  .filter(Boolean)

// 修正後
const emails = responses.flatMap(r =>
  r.success ? [r.data.email] : []
)

// 文字列をパースして有効な数値だけ取り出す
// 修正前
const numbers = strings
  .map(s => parseInt(s, 10))
  .filter(n => !isNaN(n))

// 修正後
const numbers = strings.flatMap(s => {
  const n = parseInt(s, 10)
  return isNaN(n) ? [] : [n]
})
```

**使うべき場面:**
- 一部の要素を除外しつつ変換する
- 一部の入力に出力がない条件付きマッピング
- 不正な入力を skip するパース / バリデーション
