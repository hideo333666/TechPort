---
title: エフェクト依存配列を狭める
impact: LOW
impactDescription: エフェクト再実行を最小化
tags: rerender, useEffect, dependencies, optimization
---

## エフェクト依存配列を狭める

エフェクトの依存配列にはオブジェクトではなくプリミティブを指定して、再実行回数を最小化する。

**誤り (user のどのフィールドが変わっても再実行されてしまう):**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user])
```

**正解 (id が変わったときだけ再実行される):**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user.id])
```

**派生 state は、エフェクトの外で計算する:**

```tsx
// 誤り: width = 767 / 766 / 765... のたびに走る
useEffect(() => {
  if (width < 768) {
    enableMobileMode()
  }
}, [width])

// 正解: 真偽値の遷移のときだけ走る
const isMobile = width < 768
useEffect(() => {
  if (isMobile) {
    enableMobileMode()
  }
}, [isMobile])
```
