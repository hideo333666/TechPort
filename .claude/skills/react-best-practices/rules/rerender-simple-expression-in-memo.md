---
title: プリミティブを返す単純な式を `useMemo` でラップしない
impact: LOW-MEDIUM
impactDescription: レンダリングごとの無駄な計算
tags: rerender, useMemo, optimization
---

## プリミティブを返す単純な式を `useMemo` でラップしない

式が単純で (論理 / 算術演算子が数個程度)、結果がプリミティブ (真偽値・数値・文字列) なら、`useMemo` で囲まない。`useMemo` の呼び出しと依存配列の比較のコストの方が、その式自体より重くなり得る。

**誤り:**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = useMemo(() => {
    return user.isLoading || notifications.isLoading
  }, [user.isLoading, notifications.isLoading])

  if (isLoading) return <Skeleton />
  // マークアップを return する
}
```

**正解:**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = user.isLoading || notifications.isLoading

  if (isLoading) return <Skeleton />
  // マークアップを return する
}
```
