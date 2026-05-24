---
title: RegExp の生成をホイストする
impact: LOW-MEDIUM
impactDescription: 再生成を回避
tags: javascript, regexp, optimization, memoization
---

## RegExp の生成をホイストする

レンダリング中に RegExp を生成しない。モジュールスコープにホイストするか、`useMemo()` でメモ化する。

**誤り (毎レンダリングで新しい RegExp が作られる):**

```tsx
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**正解 (メモ化またはホイスト):**

```tsx
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  )
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**注意 (global フラグ付き regex はミュータブルな state を持つ):**

global regex (`/g`) は `lastIndex` というミュータブルな状態を持つ:

```typescript
const regex = /foo/g
regex.test('foo')  // true、lastIndex = 3
regex.test('foo')  // false、lastIndex = 0
```
