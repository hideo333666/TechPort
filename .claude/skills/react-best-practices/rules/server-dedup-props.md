---
title: RSC props での二重シリアライズを避ける
impact: LOW
impactDescription: 二重シリアライズを避けてネットワークペイロードを削減
tags: server, rsc, serialization, props, client-components
---

## RSC props での二重シリアライズを避ける

**影響度: LOW (二重シリアライズを避けてネットワークペイロードを削減)**

RSC→クライアントへのシリアライズは、値ではなくオブジェクト参照で重複排除される。同じ参照ならシリアライズは 1 回、別の参照になれば 2 回シリアライズされる。`.toSorted()` / `.filter()` / `.map()` のような変換はサーバではなくクライアントで行う。

**誤り (配列を二重に送る):**

```tsx
// RSC: 6 個の文字列を送る (3 要素の配列 × 2)
<ClientList usernames={usernames} usernamesOrdered={usernames.toSorted()} />
```

**正解 (3 個の文字列だけ送る):**

```tsx
// RSC: 1 回だけ送る
<ClientList usernames={usernames} />

// クライアント側で変換する
'use client'
const sorted = useMemo(() => [...usernames].sort(), [usernames])
```

**ネストした重複排除の挙動:**

重複排除は再帰的に効く。データ型によって影響度が違う:

- `string[]` / `number[]` / `boolean[]`: **影響大** — 配列とすべてのプリミティブが完全に二重化される
- `object[]`: **影響小** — 配列構造は二重化されるが、ネストされたオブジェクトは参照で重複排除される

```tsx
// string[] — 全部二重化される
usernames={['a','b']} sorted={usernames.toSorted()} // 4 個の文字列を送る

// object[] — 配列構造のみ二重化される
users={[{id:1},{id:2}]} sorted={users.toSorted()} // 配列 2 個 + ユニークなオブジェクト 2 個 (4 個ではない)
```

**重複排除を壊す操作 (新しい参照を生む):**

- 配列: `.toSorted()` / `.filter()` / `.map()` / `.slice()` / `[...arr]`
- オブジェクト: `{...obj}` / `Object.assign()` / `structuredClone()` / `JSON.parse(JSON.stringify())`

**さらに例:**

```tsx
// ❌ 悪い例
<C users={users} active={users.filter(u => u.active)} />
<C product={product} productName={product.name} />

// ✅ 良い例
<C users={users} />
<C product={product} />
// フィルタや分割代入はクライアント側でやる
```

**例外:** 変換が高コストな場合や、クライアントが元データを必要としない場合は派生データを渡してもよい。
