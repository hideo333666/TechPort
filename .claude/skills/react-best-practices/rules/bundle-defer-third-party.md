---
title: 重要でないサードパーティライブラリを遅延ロードする
impact: MEDIUM
impactDescription: ハイドレーション後にロード
tags: bundle, third-party, analytics, defer
---

## 重要でないサードパーティライブラリを遅延ロードする

アナリティクス・ロギング・エラートラッキングはユーザー操作をブロックしない。ハイドレーション後にロードすればよい。

**誤り (初期バンドルをブロックする):**

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**正解 (ハイドレーション後にロードする):**

```tsx
import dynamic from 'next/dynamic'

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then(m => m.Analytics),
  { ssr: false }
)

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```
