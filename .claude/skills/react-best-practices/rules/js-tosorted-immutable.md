---
title: イミュータブルな並べ替えには `sort()` ではなく `toSorted()` を使う
impact: MEDIUM-HIGH
impactDescription: React state でのミューテーションバグを防ぐ
tags: javascript, arrays, immutability, react, state, mutation
---

## イミュータブルな並べ替えには `sort()` ではなく `toSorted()` を使う

`.sort()` は配列を破壊的にミューテートするので、React の state / props に対して使うとバグの原因になる。ミューテートせずにソート済みの新しい配列を作るには `.toSorted()` を使う。

**誤り (元の配列をミューテートする):**

```typescript
function UserList({ users }: { users: User[] }) {
  // users prop の配列を破壊的に変更してしまう
  const sorted = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**正解 (新しい配列を作る):**

```typescript
function UserList({ users }: { users: User[] }) {
  // ソート済みの新しい配列を作る。元配列は変わらない
  const sorted = useMemo(
    () => users.toSorted((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**React で重要な理由:**

1. props / state のミューテーションは React のイミュータビリティモデルを壊す — React は props と state を読み取り専用として扱うことを期待している
2. 古いクロージャバグを誘発する — クロージャ (コールバック・エフェクト) 内で配列をミューテートすると、予期せぬ挙動を生む

**ブラウザサポート (古いブラウザ向けフォールバック):**

`.toSorted()` は主要モダンブラウザに搭載済み (Chrome 110+ / Safari 16+ / Firefox 115+ / Node.js 20+)。古い環境では spread 演算子を使う:

```typescript
// 古いブラウザ向けフォールバック
const sorted = [...items].sort((a, b) => a.value - b.value)
```

**その他のイミュータブルな配列メソッド:**

- `.toSorted()` — イミュータブルなソート
- `.toReversed()` — イミュータブルな reverse
- `.toSpliced()` — イミュータブルな splice
- `.with()` — イミュータブルな要素置換
