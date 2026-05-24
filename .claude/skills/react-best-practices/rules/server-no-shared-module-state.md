---
title: リクエストデータを共有モジュール state に置かない
impact: HIGH
impactDescription: 並行性バグとリクエストデータの漏洩を防ぐ
tags: server, rsc, ssr, concurrency, security, state
---

## リクエストデータを共有モジュール state に置かない

React Server Component や SSR 中のクライアントコンポーネントでは、リクエストスコープのデータを共有するためにモジュールレベルのミュータブルな変数を使わない。サーバレンダリングは同じプロセス内で並行に走り得る。あるレンダリングが共有モジュール state に書き込み、別のレンダリングがそれを読むと、競合状態・リクエスト横断のデータ汚染・別ユーザーのデータが別のユーザーのレスポンスに紛れ込むセキュリティバグが発生する。

サーバ上では、モジュールスコープはプロセス全体の共有メモリだと考える — リクエストローカルな state ではない。

**誤り (並行レンダリング間でリクエストデータが漏れる):**

```tsx
let currentUser: User | null = null

export default async function Page() {
  currentUser = await auth()
  return <Dashboard />
}

async function Dashboard() {
  return <div>{currentUser?.name}</div>
}
```

2 つのリクエストが重なると、リクエスト A が `currentUser` をセットし、A が `Dashboard` のレンダリングを終える前にリクエスト B が上書きしてしまう。

**正解 (リクエストデータはレンダーツリー内に閉じる):**

```tsx
export default async function Page() {
  const user = await auth()
  return <Dashboard user={user} />
}

function Dashboard({ user }: { user: User | null }) {
  return <div>{user?.name}</div>
}
```

安全な例外:

- モジュールスコープで 1 回だけロードされる、イミュータブルな静的アセットや config
- リクエスト横断の再利用を意図して設計された、適切に key 付けされた共有キャッシュ
- リクエスト固有・ユーザー固有のミュータブルデータを保持しないプロセス全体のシングルトン

静的アセットや config については [静的 I/O はモジュールレベルにホイストする](./server-hoist-static-io.md) を参照。
