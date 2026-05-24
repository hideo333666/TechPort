---
title: 配列比較では先に長さをチェックする
impact: MEDIUM-HIGH
impactDescription: 長さが違うときに高コスト処理を回避
tags: javascript, arrays, performance, optimization, comparison
---

## 配列比較では先に長さをチェックする

配列を高コストな操作 (ソート・深い等価比較・シリアライズ等) で比較するときは、最初に長さをチェックする。長さが違えば、その配列は等しくあり得ない。

実アプリでは、この比較がホットパス (イベントハンドラ・レンダリングループ) で走るときに特に効く。

**誤り (常に高コストな比較が走る):**

```typescript
function hasChanges(current: string[], original: string[]) {
  // 長さが違っても常にソート・結合する
  return current.sort().join() !== original.sort().join()
}
```

`current.length` が 5、`original.length` が 100 でも、O(n log n) のソートが 2 回走る。結合と文字列比較のオーバーヘッドもある。

**正解 (まず O(1) の長さチェック):**

```typescript
function hasChanges(current: string[], original: string[]) {
  // 長さが違えば早期 return
  if (current.length !== original.length) {
    return true
  }
  // 長さが一致するときだけソート
  const currentSorted = current.toSorted()
  const originalSorted = original.toSorted()
  for (let i = 0; i < currentSorted.length; i++) {
    if (currentSorted[i] !== originalSorted[i]) {
      return true
    }
  }
  return false
}
```

この新しいアプローチが効率的な理由:
- 長さが違うときソートと結合のオーバーヘッドを避けられる
- 結合文字列のためのメモリ消費を避けられる (大きな配列で特に重要)
- 元配列をミューテートしない
- 差異を見つけた時点で早期 return できる
