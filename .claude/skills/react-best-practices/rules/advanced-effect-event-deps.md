---
title: エフェクトイベントを依存配列に入れない
impact: LOW
impactDescription: 不要なエフェクト再実行と lint エラーを回避
tags: advanced, hooks, useEffectEvent, dependencies, effects
---

## エフェクトイベントを依存配列に入れない

Effect Event 関数は安定した識別子を持たない。識別子は意図的にレンダリングごとに変わる。`useEffectEvent` が返す関数は `useEffect` の依存配列に入れないこと。実際にリアクティブな値だけを依存配列に並べ、Effect Event の呼び出しはエフェクト本体やそこから作られる購読の内側で行う。

**誤り (Effect Event を依存配列に入れている):**

```tsx
import { useEffect, useEffectEvent } from 'react'

function ChatRoom({ roomId, onConnected }: {
  roomId: string
  onConnected: () => void
}) {
  const handleConnected = useEffectEvent(onConnected)

  useEffect(() => {
    const connection = createConnection(roomId)
    connection.on('connected', handleConnected)
    connection.connect()

    return () => connection.disconnect()
  }, [roomId, handleConnected])
}
```

Effect Event を依存配列に含めると、エフェクトは毎レンダリングで再実行されてしまい、React Hooks の lint ルールにも引っかかる。

**正解 (Effect Event ではなく、リアクティブな値だけを依存にする):**

```tsx
import { useEffect, useEffectEvent } from 'react'

function ChatRoom({ roomId, onConnected }: {
  roomId: string
  onConnected: () => void
}) {
  const handleConnected = useEffectEvent(onConnected)

  useEffect(() => {
    const connection = createConnection(roomId)
    connection.on('connected', handleConnected)
    connection.connect()

    return () => connection.disconnect()
  }, [roomId])
}
```

参考: [React useEffectEvent: Effect Event in deps](https://react.dev/reference/react/useEffectEvent#effect-event-in-deps)
