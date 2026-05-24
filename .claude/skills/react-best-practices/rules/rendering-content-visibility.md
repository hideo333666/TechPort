---
title: 長いリストには CSS `content-visibility` を使う
impact: HIGH
impactDescription: 初期レンダリングの高速化
tags: rendering, css, content-visibility, long-lists
---

## 長いリストには CSS `content-visibility` を使う

`content-visibility: auto` を適用して、画面外要素のレンダリングを遅延する。

**CSS:**

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

**例:**

```tsx
function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="overflow-y-auto h-screen">
      {messages.map(msg => (
        <div key={msg.id} className="message-item">
          <Avatar user={msg.author} />
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  )
}
```

1000 件のメッセージでも、画面外の ~990 件についてはブラウザがレイアウト / ペイントをスキップする (初期レンダリングが 10× 速くなる)。
