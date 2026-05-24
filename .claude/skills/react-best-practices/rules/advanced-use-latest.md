---
title: コールバック ref を安定化する `useEffectEvent`
impact: LOW
impactDescription: エフェクトの再実行を防ぐ
tags: advanced, hooks, useEffectEvent, refs, optimization
---

## コールバック ref を安定化する `useEffectEvent`

依存配列に追加せずに、コールバック内で最新値にアクセスする。エフェクトの再実行を防ぎつつ、古いクロージャも回避できる。

**誤り (コールバックが変わるたびにエフェクトが再実行される):**

```tsx
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(query), 300)
    return () => clearTimeout(timeout)
  }, [query, onSearch])
}
```

**正解 (React の `useEffectEvent` を使う):**

```tsx
import { useEffectEvent } from 'react';

function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  const onSearchEvent = useEffectEvent(onSearch)

  useEffect(() => {
    const timeout = setTimeout(() => onSearchEvent(query), 300)
    return () => clearTimeout(timeout)
  }, [query])
}
```
