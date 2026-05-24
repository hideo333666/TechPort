---
title: メモ化コンポーネントへ切り出す
impact: MEDIUM
impactDescription: 早期 return を可能にする
tags: rerender, memo, useMemo, optimization
---

## メモ化コンポーネントへ切り出す

重い処理はメモ化したコンポーネントへ切り出し、計算前に早期 return できるようにする。

**誤り (ローディング中でも avatar を計算してしまう):**

```tsx
function Profile({ user, loading }: Props) {
  const avatar = useMemo(() => {
    const id = computeAvatarId(user)
    return <Avatar id={id} />
  }, [user])

  if (loading) return <Skeleton />
  return <div>{avatar}</div>
}
```

**正解 (ローディング中は計算をスキップする):**

```tsx
const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {
  const id = useMemo(() => computeAvatarId(user), [user])
  return <Avatar id={id} />
})

function Profile({ user, loading }: Props) {
  if (loading) return <Skeleton />
  return (
    <div>
      <UserAvatar user={user} />
    </div>
  )
}
```

**注意:** プロジェクトで [React Compiler](https://react.dev/learn/react-compiler) を有効にしている場合、`memo()` / `useMemo()` による手動メモ化は不要。コンパイラが再レンダリングを自動最適化する。
