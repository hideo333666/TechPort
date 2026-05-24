---
title: 手動のローディング state より `useTransition` を使う
impact: LOW
impactDescription: 再レンダリングを減らし、コードを明快にする
tags: rendering, transitions, useTransition, loading, state
---

## 手動のローディング state より `useTransition` を使う

ローディング state は手動の `useState` ではなく `useTransition` を使う。`isPending` が組み込みで提供され、トランジション管理も自動になる。

**誤り (手動のローディング state):**

```tsx
function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (value: string) => {
    setIsLoading(true)
    setQuery(value)
    const data = await fetchResults(value)
    setResults(data)
    setIsLoading(false)
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

**正解 (`useTransition` の組み込み pending state を使う):**

```tsx
import { useTransition, useState } from 'react'

function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (value: string) => {
    setQuery(value) // 入力は即時更新
    
    startTransition(async () => {
      // 結果の取得・更新
      const data = await fetchResults(value)
      setResults(data)
    })
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

**メリット:**

- **自動 pending state**: `setIsLoading(true/false)` を手で管理しなくてよい
- **エラー耐性**: トランジションが throw しても pending state が正しくリセットされる
- **応答性向上**: 更新中も UI が応答可能
- **割り込み処理**: 新しいトランジションは進行中のトランジションを自動キャンセル

参考: [useTransition](https://react.dev/reference/react/useTransition)
