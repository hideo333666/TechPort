---
title: コンポーネントの中でコンポーネントを定義しない
impact: HIGH
impactDescription: レンダリングごとの再 mount を防ぐ
tags: rerender, components, remount, performance
---

## コンポーネントの中でコンポーネントを定義しない

**影響度: HIGH (レンダリングごとの再 mount を防ぐ)**

コンポーネントを別のコンポーネントの中で定義すると、レンダリングのたびに新しいコンポーネント型が生まれる。React はそれを毎回別物として扱い、完全に再 mount してしまう — state も DOM もすべて破棄される。

これをやりがちな理由は、props を渡さずに親変数にアクセスしたいから。必ず props として渡すこと。

**誤り (毎レンダリングで再 mount される):**

```tsx
function UserProfile({ user, theme }) {
  // theme にアクセスするため内側で定義している — NG
  const Avatar = () => (
    <img
      src={user.avatarUrl}
      className={theme === 'dark' ? 'avatar-dark' : 'avatar-light'}
    />
  )

  // user にアクセスするため内側で定義している — NG
  const Stats = () => (
    <div>
      <span>{user.followers} followers</span>
      <span>{user.posts} posts</span>
    </div>
  )

  return (
    <div>
      <Avatar />
      <Stats />
    </div>
  )
}
```

`UserProfile` がレンダリングされるたびに、`Avatar` と `Stats` は新しいコンポーネント型になる。React は古いインスタンスを unmount し、新しい方を mount するので、内部 state を失い、エフェクトを再実行し、DOM ノードも作り直してしまう。

**正解 (props で渡す):**

```tsx
function Avatar({ src, theme }: { src: string; theme: string }) {
  return (
    <img
      src={src}
      className={theme === 'dark' ? 'avatar-dark' : 'avatar-light'}
    />
  )
}

function Stats({ followers, posts }: { followers: number; posts: number }) {
  return (
    <div>
      <span>{followers} followers</span>
      <span>{posts} posts</span>
    </div>
  )
}

function UserProfile({ user, theme }) {
  return (
    <div>
      <Avatar src={user.avatarUrl} theme={theme} />
      <Stats followers={user.followers} posts={user.posts} />
    </div>
  )
}
```

**このバグの症状:**
- 入力フィールドが 1 文字ごとにフォーカスを失う
- アニメーションが予期せず再生し直される
- `useEffect` の setup / cleanup が親のレンダリングごとに走る
- コンポーネント内のスクロール位置がリセットされる
