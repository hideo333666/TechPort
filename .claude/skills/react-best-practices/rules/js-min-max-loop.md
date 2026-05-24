---
title: min / max には sort ではなくループを使う
impact: LOW
impactDescription: O(n log n) ではなく O(n)
tags: javascript, arrays, performance, sorting, algorithms
---

## min / max には sort ではなくループを使う

最小 / 最大要素を見つけるのは配列を 1 回走査すれば済む。ソートは無駄で遅い。

**誤り (O(n log n) — ソートして最新を取り出す):**

```typescript
interface Project {
  id: string
  name: string
  updatedAt: number
}

function getLatestProject(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt)
  return sorted[0]
}
```

最大値を取るためだけに配列全体をソートしている。

**誤り (O(n log n) — 最古と最新を取るためにソート):**

```typescript
function getOldestAndNewest(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => a.updatedAt - b.updatedAt)
  return { oldest: sorted[0], newest: sorted[sorted.length - 1] }
}
```

min / max しか必要ないのにソートしてしまっている。

**正解 (O(n) — シングルループ):**

```typescript
function getLatestProject(projects: Project[]) {
  if (projects.length === 0) return null
  
  let latest = projects[0]
  
  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt > latest.updatedAt) {
      latest = projects[i]
    }
  }
  
  return latest
}

function getOldestAndNewest(projects: Project[]) {
  if (projects.length === 0) return { oldest: null, newest: null }
  
  let oldest = projects[0]
  let newest = projects[0]
  
  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt < oldest.updatedAt) oldest = projects[i]
    if (projects[i].updatedAt > newest.updatedAt) newest = projects[i]
  }
  
  return { oldest, newest }
}
```

配列を 1 回走査するだけ、コピーもソートもしない。

**代替案 (小さな配列なら `Math.min` / `Math.max`):**

```typescript
const numbers = [5, 2, 8, 1, 9]
const min = Math.min(...numbers)
const max = Math.max(...numbers)
```

小さな配列なら使えるが、spread 演算子の制限により、非常に大きな配列では遅くなったりエラーになったりする。配列の最大長は Chrome 143 で約 124,000、Safari 18 で約 638,000 (正確な数値は変動する可能性あり — [the fiddle](https://jsfiddle.net/qw1jabsx/4/) を参照)。安定して動かしたいならループ方式を使う。
