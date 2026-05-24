---
title: 重い派生レンダリングには `useDeferredValue` を使う
impact: MEDIUM
impactDescription: 重い計算中も入力の応答性を保つ
tags: rerender, useDeferredValue, optimization, concurrent
---

## 重い派生レンダリングには `useDeferredValue` を使う

ユーザー入力が重い計算やレンダリングを引き起こすときは、`useDeferredValue` を使って入力の応答性を維持する。遅延された値は少し遅れて反映されるので、React は入力更新を優先し、重い結果は手が空いたタイミングでレンダリングできる。

**誤り (フィルタ中、入力がもたつく):**

```tsx
function Search({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('')
  const filtered = items.filter(item => fuzzyMatch(item, query))

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ResultsList results={filtered} />
    </>
  )
}
```

**正解 (入力はキビキビ動き、結果は揃ったタイミングで描画される):**

```tsx
function Search({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const filtered = useMemo(
    () => items.filter(item => fuzzyMatch(item, deferredQuery)),
    [items, deferredQuery]
  )
  const isStale = query !== deferredQuery

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <div style={{ opacity: isStale ? 0.7 : 1 }}>
        <ResultsList results={filtered} />
      </div>
    </>
  )
}
```

**使うべき場面:**

- 大量のリストをフィルタ / 検索する
- 入力に反応する重いビジュアライゼーション (チャート・グラフ)
- 派生 state で、レンダリング遅延が体感できるとき

**注意:** 重い計算は `useMemo` で遅延値を依存に指定して囲むこと。そうしないと依然として毎レンダリング走ってしまう。

参考: [React useDeferredValue](https://react.dev/reference/react/useDeferredValue)
