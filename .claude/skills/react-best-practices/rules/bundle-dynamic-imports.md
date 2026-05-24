---
title: 重いコンポーネントには動的 import を使う
impact: CRITICAL
impactDescription: TTI と LCP に直接影響
tags: bundle, dynamic-import, code-splitting, next-dynamic
---

## 重いコンポーネントには動的 import を使う

初期レンダリングで不要な大きなコンポーネントは `next/dynamic` で遅延ロードする。

**誤り (Monaco がメインチャンクに混ざり ~300KB 増える):**

```tsx
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**正解 (Monaco を必要なときだけロード):**

```tsx
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```
