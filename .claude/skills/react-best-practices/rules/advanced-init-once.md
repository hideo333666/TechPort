---
title: アプリ初期化は mount ごとではなく 1 回だけ行う
impact: LOW-MEDIUM
impactDescription: 開発時の重複初期化を回避
tags: initialization, useEffect, app-startup, side-effects
---

## アプリ初期化は mount ごとではなく 1 回だけ行う

アプリロード時に 1 回だけ走らせたいアプリ全体の初期化処理を、コンポーネントの `useEffect([])` に置かない。コンポーネントは再 mount され得るし、エフェクトも再実行される。代わりにモジュールレベルのガードか、エントリモジュールでのトップレベル初期化を使う。

**誤り (開発時に 2 回走る、再 mount で再実行される):**

```tsx
function Comp() {
  useEffect(() => {
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

**正解 (アプリロードごとに 1 回):**

```tsx
let didInit = false

function Comp() {
  useEffect(() => {
    if (didInit) return
    didInit = true
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

参考: [Initializing the application](https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application)
