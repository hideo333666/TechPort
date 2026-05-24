---
title: 表示・非表示には Activity コンポーネントを使う
impact: MEDIUM
impactDescription: state / DOM を保持
tags: rendering, activity, visibility, state-preservation
---

## 表示・非表示には Activity コンポーネントを使う

頻繁に表示・非表示が切り替わる重いコンポーネントには、React の `<Activity>` を使って state / DOM を保持する。

**使い方:**

```tsx
import { Activity } from 'react'

function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}
```

重い再レンダリングと state の喪失を回避できる。
