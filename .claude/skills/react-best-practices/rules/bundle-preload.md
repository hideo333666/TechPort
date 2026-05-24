---
title: ユーザー意図に基づいてプリロードする
impact: MEDIUM
impactDescription: 体感レイテンシを削減
tags: bundle, preload, user-intent, hover
---

## ユーザー意図に基づいてプリロードする

重いバンドルは必要になる前にプリロードして、体感レイテンシを削減する。

**例 (hover / focus でプリロード):**

```tsx
function EditorButton({ onClick }: { onClick: () => void }) {
  const preload = () => {
    if (typeof window !== 'undefined') {
      void import('./monaco-editor')
    }
  }

  return (
    <button
      onMouseEnter={preload}
      onFocus={preload}
      onClick={onClick}
    >
      Open Editor
    </button>
  )
}
```

**例 (フィーチャーフラグが有効なときにプリロード):**

```tsx
function FlagsProvider({ children, flags }: Props) {
  useEffect(() => {
    if (flags.editorEnabled && typeof window !== 'undefined') {
      void import('./monaco-editor').then(mod => mod.init())
    }
  }, [flags.editorEnabled])

  return <FlagsContext.Provider value={flags}>
    {children}
  </FlagsContext.Provider>
}
```

`typeof window !== 'undefined'` のチェックにより、プリロード対象のモジュールが SSR 用にバンドルされるのを防げる。サーババンドルサイズとビルド速度の両方を最適化できる。
