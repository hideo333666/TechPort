---
title: 関数から早期 return する
impact: LOW-MEDIUM
impactDescription: 不要な計算を回避
tags: javascript, functions, optimization, early-return
---

## 関数から早期 return する

結果が確定したらすぐ return して、それ以降の処理をスキップする。

**誤り (答えが分かった後も全アイテムを処理してしまう):**

```typescript
function validateUsers(users: User[]) {
  let hasError = false
  let errorMessage = ''
  
  for (const user of users) {
    if (!user.email) {
      hasError = true
      errorMessage = 'Email required'
    }
    if (!user.name) {
      hasError = true
      errorMessage = 'Name required'
    }
    // エラーが見つかっても全ユーザーをチェックし続ける
  }
  
  return hasError ? { valid: false, error: errorMessage } : { valid: true }
}
```

**正解 (最初のエラーで即 return する):**

```typescript
function validateUsers(users: User[]) {
  for (const user of users) {
    if (!user.email) {
      return { valid: false, error: 'Email required' }
    }
    if (!user.name) {
      return { valid: false, error: 'Name required' }
    }
  }

  return { valid: true }
}
```
