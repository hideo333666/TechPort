---

title: メモ化コンポーネントの非プリミティブなデフォルト引数値は定数として切り出す
impact: MEDIUM
impactDescription: デフォルト値を定数化することでメモ化を効かせる
tags: rerender, memo, optimization

---

## メモ化コンポーネントの非プリミティブなデフォルト引数値は定数として切り出す

メモ化したコンポーネントで、配列・関数・オブジェクトといった非プリミティブな任意引数にデフォルト値を持たせると、そのコンポーネントをその引数なしで呼んだときにメモ化が壊れる。新しい値のインスタンスがレンダリングごとに作られ、`memo()` の厳密等価比較を通過しないからだ。

これを避けるため、デフォルト値を定数に切り出す。

**誤り (`onClick` が毎レンダリングで別の値になる):**

```tsx
const UserAvatar = memo(function UserAvatar({ onClick = () => {} }: { onClick?: () => void }) {
  // ...
})

// onClick を省略して使う
<UserAvatar />
```

**正解 (デフォルト値を安定化させる):**

```tsx
const NOOP = () => {};

const UserAvatar = memo(function UserAvatar({ onClick = NOOP }: { onClick?: () => void }) {
  // ...
})

// onClick を省略して使う
<UserAvatar />
```
