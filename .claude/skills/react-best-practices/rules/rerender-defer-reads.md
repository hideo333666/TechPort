---
title: state の読み取りは使用箇所まで遅らせる
impact: MEDIUM
impactDescription: 不要な購読を回避
tags: rerender, searchParams, localStorage, optimization
---

## state の読み取りは使用箇所まで遅らせる

動的な state (searchParams / localStorage 等) は、コールバック内でしか読まないなら購読しない。

**誤り (全 searchParams 変更を購読してしまう):**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const searchParams = useSearchParams()

  const handleShare = () => {
    const ref = searchParams.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

**正解 (オンデマンドで読み取り、購読しない):**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```
