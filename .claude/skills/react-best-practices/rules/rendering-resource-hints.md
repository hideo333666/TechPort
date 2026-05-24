---
title: React DOM のリソースヒントを使う
impact: HIGH
impactDescription: クリティカルリソースのロード時間を削減
tags: rendering, preload, preconnect, prefetch, resource-hints
---

## React DOM のリソースヒントを使う

**影響度: HIGH (クリティカルリソースのロード時間を削減)**

React DOM はブラウザに必要となるリソースを事前に知らせる API を提供している。サーバコンポーネントで使うと、クライアントが HTML を受け取る前にリソースのロードを開始できるため特に有効。

- **`prefetchDNS(href)`**: 後で接続するであろうドメインの DNS を解決する
- **`preconnect(href)`**: サーバへの接続 (DNS + TCP + TLS) を確立する
- **`preload(href, options)`**: すぐ使うリソース (スタイルシート・フォント・スクリプト・画像) を取得する
- **`preloadModule(href)`**: すぐ使う ES モジュールを取得する
- **`preinit(href, options)`**: スタイルシートやスクリプトを取得して評価する
- **`preinitModule(href)`**: ES モジュールを取得して評価する

**例 (サードパーティ API への preconnect):**

```tsx
import { preconnect, prefetchDNS } from 'react-dom'

export default function App() {
  prefetchDNS('https://analytics.example.com')
  preconnect('https://api.example.com')

  return <main>{/* content */}</main>
}
```

**例 (クリティカルなフォントとスタイルをプリロード):**

```tsx
import { preload, preinit } from 'react-dom'

export default function RootLayout({ children }) {
  // フォントファイルをプリロード
  preload('/fonts/inter.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })

  // クリティカルなスタイルシートを取得して即適用
  preinit('/styles/critical.css', { as: 'style' })

  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

**例 (コード分割ルートのモジュールをプリロード):**

```tsx
import { preloadModule, preinitModule } from 'react-dom'

function Navigation() {
  const preloadDashboard = () => {
    preloadModule('/dashboard.js', { as: 'script' })
  }

  return (
    <nav>
      <a href="/dashboard" onMouseEnter={preloadDashboard}>
        Dashboard
      </a>
    </nav>
  )
}
```

**使い分け:**

| API | ユースケース |
|-----|-------------|
| `prefetchDNS` | あとで接続するサードパーティドメイン |
| `preconnect` | すぐ fetch する API / CDN |
| `preload` | 現在ページで必要なクリティカルリソース |
| `preloadModule` | 次に遷移しそうな先の JS モジュール |
| `preinit` | 早期実行が必要なスタイル / スクリプト |
| `preinitModule` | 早期実行が必要な ES モジュール |

参考: [React DOM Resource Preloading APIs](https://react.dev/reference/react-dom#resource-preloading-apis)
