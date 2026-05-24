---
title: インタラクションのロジックはイベントハンドラに置く
impact: MEDIUM
impactDescription: エフェクト再実行と副作用の重複を回避
tags: rerender, useEffect, events, side-effects, dependencies
---

## インタラクションのロジックはイベントハンドラに置く

特定のユーザー操作 (submit / click / drag) によって発火する副作用は、そのイベントハンドラの中で実行する。state + エフェクトとしてモデル化しない。関係ない変更でエフェクトが再実行されたり、操作が二重に発火することがある。

**誤り (イベントを state + エフェクトでモデル化している):**

```tsx
function Form() {
  const [submitted, setSubmitted] = useState(false)
  const theme = useContext(ThemeContext)

  useEffect(() => {
    if (submitted) {
      post('/api/register')
      showToast('Registered', theme)
    }
  }, [submitted, theme])

  return <button onClick={() => setSubmitted(true)}>Submit</button>
}
```

**正解 (ハンドラの中で実行する):**

```tsx
function Form() {
  const theme = useContext(ThemeContext)

  function handleSubmit() {
    post('/api/register')
    showToast('Registered', theme)
  }

  return <button onClick={handleSubmit}>Submit</button>
}
```

参考: [Should this code move to an event handler?](https://react.dev/learn/removing-effect-dependencies#should-this-code-move-to-an-event-handler)
