---
title: コンポーネント構成によるデータ取得の並列化
impact: CRITICAL
impactDescription: サーバ側ウォーターフォールを解消
tags: server, rsc, parallel-fetching, composition
---

## コンポーネント構成によるデータ取得の並列化

React Server Components はツリー内で逐次実行される。コンポーネント構成を見直して、データ取得を並列化する。

**誤り (Sidebar が Page の fetch 完了を待ってしまう):**

```tsx
export default async function Page() {
  const header = await fetchHeader()
  return (
    <div>
      <div>{header}</div>
      <Sidebar />
    </div>
  )
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}
```

**正解 (両者が同時に fetch する):**

```tsx
async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

export default function Page() {
  return (
    <div>
      <Header />
      <Sidebar />
    </div>
  )
}
```

**children prop を使う別解:**

```tsx
async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default function Page() {
  return (
    <Layout>
      <Sidebar />
    </Layout>
  )
}
```
