---
title: RSC 境界でのシリアライズを最小化する
impact: HIGH
impactDescription: データ転送サイズを削減
tags: server, rsc, serialization, props
---

## RSC 境界でのシリアライズを最小化する

React Server / Client 境界では、オブジェクトの全プロパティが文字列にシリアライズされ、HTML レスポンスとそれ以降の RSC リクエストに埋め込まれる。このシリアライズデータはページ容量とロード時間に直接効いてくる — **サイズが大きく効く**。クライアントが実際に使うフィールドだけ渡す。

**誤り (50 フィールド全部をシリアライズする):**

```tsx
async function Page() {
  const user = await fetchUser()  // 50 フィールドある
  return <Profile user={user} />
}

'use client'
function Profile({ user }: { user: User }) {
  return <div>{user.name}</div>  // 使うのは 1 フィールド
}
```

**正解 (1 フィールドだけシリアライズする):**

```tsx
async function Page() {
  const user = await fetchUser()
  return <Profile name={user.name} />
}

'use client'
function Profile({ name }: { name: string }) {
  return <div>{name}</div>
}
```
