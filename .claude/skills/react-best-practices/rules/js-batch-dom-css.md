---
title: レイアウトスラッシングを避ける
impact: MEDIUM
impactDescription: 強制同期レイアウトを防ぎ、パフォーマンスのボトルネックを削減
tags: javascript, dom, css, performance, reflow, layout-thrashing
---

## レイアウトスラッシングを避ける

スタイルの書き込みとレイアウト読み取りを交互に行わない。スタイル変更の間にレイアウトプロパティ (`offsetWidth` / `getBoundingClientRect()` / `getComputedStyle()` 等) を読むと、ブラウザは同期 reflow を強制される。

**これは OK (ブラウザがスタイル変更をバッチ処理する):**
```typescript
function updateElementStyles(element: HTMLElement) {
  // 各行がスタイルを無効化するが、ブラウザは再計算をまとめてくれる
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'
}
```

**誤り (読み書きが交互になり reflow を強制してしまう):**
```typescript
function layoutThrashing(element: HTMLElement) {
  element.style.width = '100px'
  const width = element.offsetWidth  // reflow を強制
  element.style.height = '200px'
  const height = element.offsetHeight  // さらに reflow を強制
}
```

**正解 (書き込みをまとめてから 1 回だけ読む):**
```typescript
function updateElementStyles(element: HTMLElement) {
  // 書き込みをまとめる
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'
  
  // すべての書き込み後に読む (reflow は 1 回)
  const { width, height } = element.getBoundingClientRect()
}
```

**正解 (読み取りをまとめてから書き込む):**
```typescript
function avoidThrashing(element: HTMLElement) {
  // 読み取りフェーズ — レイアウトクエリをすべて先に
  const rect1 = element.getBoundingClientRect()
  const offsetWidth = element.offsetWidth
  const offsetHeight = element.offsetHeight
  
  // 書き込みフェーズ — スタイル変更を後に
  element.style.width = '100px'
  element.style.height = '200px'
}
```

**より良い: CSS クラスを使う**
```css
.highlighted-box {
  width: 100px;
  height: 200px;
  background-color: blue;
  border: 1px solid black;
}
```
```typescript
function updateElementStyles(element: HTMLElement) {
  element.classList.add('highlighted-box')
  
  const { width, height } = element.getBoundingClientRect()
}
```

**React の例:**
```tsx
// 誤り: スタイル変更とレイアウトクエリを交互にやっている
function Box({ isHighlighted }: { isHighlighted: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (ref.current && isHighlighted) {
      ref.current.style.width = '100px'
      const width = ref.current.offsetWidth // レイアウトを強制
      ref.current.style.height = '200px'
    }
  }, [isHighlighted])
  
  return <div ref={ref}>Content</div>
}

// 正解: クラスをトグルする
function Box({ isHighlighted }: { isHighlighted: boolean }) {
  return (
    <div className={isHighlighted ? 'highlighted-box' : ''}>
      Content
    </div>
  )
}
```

可能ならインラインスタイルより CSS クラスを優先する。CSS ファイルはブラウザがキャッシュし、クラスは関心の分離もしやすく、保守も楽。

レイアウトを強制する操作については [this gist](https://gist.github.com/paulirish/5d52fb081b3570c81e3a) と [CSS Triggers](https://csstriggers.com/) を参照。
