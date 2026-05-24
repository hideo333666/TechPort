---
title: state の遅延初期化を使う
impact: MEDIUM
impactDescription: レンダリングごとの無駄な計算
tags: react, hooks, useState, performance, initialization
---

## state の遅延初期化を使う

重い初期値には `useState` に関数を渡す。関数形式を使わないと、その値は最初の 1 回しか使われないのに、初期化処理が毎レンダリング走ってしまう。

**誤り (毎レンダリング走る):**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() は初期化後も毎レンダリング走る
  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))
  const [query, setQuery] = useState('')
  
  // query が変わると buildSearchIndex も不要に再実行される
  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse が毎レンダリング走る
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem('settings') || '{}')
  )
  
  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

**正解 (1 回だけ走る):**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() は初期レンダリングだけで走る
  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))
  const [query, setQuery] = useState('')
  
  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse は初期レンダリングだけで走る
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('settings')
    return stored ? JSON.parse(stored) : {}
  })
  
  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

遅延初期化が効くのは、localStorage / sessionStorage から初期値を計算するとき、データ構造 (インデックス・Map 等) を構築するとき、DOM を読むとき、重い変換を行うとき。

単純なプリミティブ (`useState(0)`)、直接参照 (`useState(props.value)`)、安価なリテラル (`useState({})`) には関数形式は不要。
