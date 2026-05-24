---
title: 関数形式の `setState` を使う
impact: MEDIUM
impactDescription: 古いクロージャと不要なコールバック再生成を防ぐ
tags: react, hooks, useState, useCallback, callbacks, closures
---

## 関数形式の `setState` を使う

現在の state 値に基づいて state を更新するときは、state 変数を直接参照するのではなく、関数形式の setState を使う。古いクロージャを防ぎ、不要な依存を消し、コールバック参照を安定化できる。

**誤り (state を依存配列に入れる必要がある):**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)
  
  // items に依存するため、items が変わるたびに再生成される
  const addItems = useCallback((newItems: Item[]) => {
    setItems([...items, ...newItems])
  }, [items])  // ❌ items を依存配列に入れるため再生成される
  
  // 依存配列から漏らすと、古いクロージャの危険がある
  const removeItem = useCallback((id: string) => {
    setItems(items.filter(item => item.id !== id))
  }, [])  // ❌ items が依存配列に無い — 古い items を参照してしまう
  
  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

最初のコールバックは `items` が変わるたびに再生成され、子コンポーネントの不要な再レンダリングを誘発し得る。2 つ目のコールバックは古いクロージャのバグを抱えている — 常に初期値の `items` を参照し続けてしまう。

**正解 (安定したコールバック / 古いクロージャなし):**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)
  
  // 安定したコールバック、再生成されない
  const addItems = useCallback((newItems: Item[]) => {
    setItems(curr => [...curr, ...newItems])
  }, [])  // ✅ 依存配列は空でよい
  
  // 常に最新の state を参照、古いクロージャの心配なし
  const removeItem = useCallback((id: string) => {
    setItems(curr => curr.filter(item => item.id !== id))
  }, [])  // ✅ 安全で安定
  
  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

**メリット:**

1. **コールバック参照が安定する** — state が変わってもコールバックを作り直さない
2. **古いクロージャが発生しない** — 常に最新の state 値を扱える
3. **依存が減る** — 依存配列がシンプルになり、メモリリークの原因も減る
4. **バグを防げる** — React で最もよくあるクロージャ系バグの源を断てる

**関数形式を使うべき場面:**

- 現在の state 値に依存する任意の setState
- state を参照する `useCallback` / `useMemo` の中
- state を参照するイベントハンドラ
- state を更新する非同期処理

**直接更新で問題ないケース:**

- 静的な値を渡すとき (例: `setCount(0)`)
- props / 引数から値を渡すだけのとき (例: `setName(newName)`)
- 直前の値に依存しない state

**注意:** プロジェクトで [React Compiler](https://react.dev/learn/react-compiler) を有効にしていれば、コンパイラがある程度自動最適化してくれる。それでも、正確性と古いクロージャバグの予防のため、関数形式の更新は引き続き推奨。
