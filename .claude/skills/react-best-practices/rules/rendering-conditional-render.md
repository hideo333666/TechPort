---
title: 明示的な条件付きレンダリングを使う
impact: LOW
impactDescription: `0` や `NaN` の描画を防ぐ
tags: rendering, conditional, jsx, falsy-values
---

## 明示的な条件付きレンダリングを使う

条件付きレンダリングで、条件が `0` / `NaN` などの「描画されてしまう falsy 値」になり得るときは、`&&` ではなく明示的な三項演算子 (`? :`) を使う。

**誤り (count が 0 のとき "0" が描画されてしまう):**

```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count && <span className="badge">{count}</span>}
    </div>
  )
}

// count = 0 のとき: <div>0</div> と描画される
// count = 5 のとき: <div><span class="badge">5</span></div>
```

**正解 (count が 0 のときは何も描画されない):**

```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count > 0 ? <span className="badge">{count}</span> : null}
    </div>
  )
}

// count = 0 のとき: <div></div>
// count = 5 のとき: <div><span class="badge">5</span></div>
```
