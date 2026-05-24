---
title: ループ内のプロパティアクセスをキャッシュする
impact: LOW-MEDIUM
impactDescription: ルックアップを削減
tags: javascript, loops, optimization, caching
---

## ループ内のプロパティアクセスをキャッシュする

ホットパスでは、オブジェクトのプロパティルックアップをキャッシュする。

**誤り (ルックアップ 3 回 × N 回反復):**

```typescript
for (let i = 0; i < arr.length; i++) {
  process(obj.config.settings.value)
}
```

**正解 (合計 1 回のルックアップ):**

```typescript
const value = obj.config.settings.value
const len = arr.length
for (let i = 0; i < len; i++) {
  process(value)
}
```
