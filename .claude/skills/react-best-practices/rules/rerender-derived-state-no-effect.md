---
title: 派生 state はレンダリング中に計算する
impact: MEDIUM
impactDescription: 冗長なレンダリングと state のずれを防ぐ
tags: rerender, derived-state, useEffect, state
---

## 派生 state はレンダリング中に計算する

現在の props / state から計算できる値は、state に保存したりエフェクトで更新したりしない。レンダリング中に派生させて、余計なレンダリングと state のずれを避ける。props の変化に反応するためだけにエフェクト内で state を更新しない — 派生値か、key リセットを優先する。

**誤り (冗長な state とエフェクト):**

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(firstName + ' ' + lastName)
  }, [firstName, lastName])

  return <p>{fullName}</p>
}
```

**正解 (レンダリング中に派生させる):**

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const fullName = firstName + ' ' + lastName

  return <p>{fullName}</p>
}
```

参考: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
