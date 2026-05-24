---
title: 戦略的な Suspense 境界
impact: HIGH
impactDescription: 初期描画の高速化
tags: async, suspense, streaming, layout-shift
---

## 戦略的な Suspense 境界

JSX を返す前に async コンポーネント内でデータを await するのではなく、`<Suspense>` 境界を置いて、データロード中もラッパー UI を先に表示する。

**誤り (ラッパーがデータ取得に引きずられる):**

```tsx
async function Page() {
  const data = await fetchData() // ページ全体がブロックされる
  
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <DataDisplay data={data} />
      </div>
      <div>Footer</div>
    </div>
  )
}
```

中央のセクションだけが必要なデータでも、レイアウト全体が待たされてしまう。

**正解 (ラッパーは即表示、データはストリーミングで届く):**

```tsx
function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <Suspense fallback={<Skeleton />}>
          <DataDisplay />
        </Suspense>
      </div>
      <div>Footer</div>
    </div>
  )
}

async function DataDisplay() {
  const data = await fetchData() // このコンポーネントだけがブロックされる
  return <div>{data.content}</div>
}
```

Sidebar / Header / Footer は即座にレンダリングされる。DataDisplay だけがデータを待つ。

**別解 (複数のコンポーネントで promise を共有する):**

```tsx
function Page() {
  // fetch は即起動するが await はしない
  const dataPromise = fetchData()
  
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <Suspense fallback={<Skeleton />}>
        <DataDisplay dataPromise={dataPromise} />
        <DataSummary dataPromise={dataPromise} />
      </Suspense>
      <div>Footer</div>
    </div>
  )
}

function DataDisplay({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // promise を unwrap する
  return <div>{data.content}</div>
}

function DataSummary({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // 同じ promise を再利用
  return <div>{data.summary}</div>
}
```

両コンポーネントが同じ promise を共有するので fetch は 1 回だけ。レイアウトは即表示され、両コンポーネントは一緒にデータを待つ。

**このパターンを使わない方が良い場面:**

- レイアウト決定 (配置に影響する) に必要なクリティカルなデータ
- ファーストビュー内の SEO クリティカルなコンテンツ
- Suspense のオーバーヘッドに見合わないほど小さく高速なクエリ
- レイアウトシフト (loading → コンテンツの飛び) を避けたいとき

**トレードオフ:** 初期描画の高速化 vs レイアウトシフトの可能性。UX 上の優先度で選ぶ。
