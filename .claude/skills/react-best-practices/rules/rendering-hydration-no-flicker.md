---
title: チラつかせずにハイドレーション不一致を防ぐ
impact: MEDIUM
impactDescription: 視覚的チラつきとハイドレーションエラーを回避
tags: rendering, ssr, hydration, localStorage, flicker
---

## チラつかせずにハイドレーション不一致を防ぐ

クライアント側ストレージ (localStorage / cookie) に依存するコンテンツを描画するときは、React がハイドレートする前に DOM を更新する同期スクリプトを注入する。これで SSR エラーもハイドレート後のチラつきも回避できる。

**誤り (SSR が壊れる):**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  // サーバでは localStorage が無い — エラーになる
  const theme = localStorage.getItem('theme') || 'light'
  
  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

サーバサイドレンダリング中は `localStorage` が undefined なので失敗する。

**誤り (視覚的にチラつく):**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light')
  
  useEffect(() => {
    // ハイドレート後に走る — 見える形でチラつく
    const stored = localStorage.getItem('theme')
    if (stored) {
      setTheme(stored)
    }
  }, [])
  
  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

コンポーネントは最初デフォルト値 (`light`) で描画され、ハイドレート後に更新される。間違ったコンテンツが一瞬見えてしまう。

**正解 (チラつかず、ハイドレーション不一致もなし):**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <div id="theme-wrapper">
        {children}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'light';
                var el = document.getElementById('theme-wrapper');
                if (el) el.className = theme;
              } catch (e) {}
            })();
          `,
        }}
      />
    </>
  )
}
```

このインラインスクリプトは要素表示前に同期的に走るので、DOM には常に正しい値が入っている。チラつかず、ハイドレーション不一致もない。

このパターンは、テーマ切り替え・ユーザー設定・認証状態・その他クライアント専用データなど、デフォルト値を瞬時に上書きしたいケースに特に有効。
