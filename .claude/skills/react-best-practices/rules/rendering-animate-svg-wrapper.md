---
title: SVG 要素ではなく SVG ラッパーをアニメーションする
impact: LOW
impactDescription: ハードウェアアクセラレーションを有効化
tags: rendering, svg, css, animation, performance
---

## SVG 要素ではなく SVG ラッパーをアニメーションする

多くのブラウザは SVG 要素への CSS3 アニメーションをハードウェアアクセラレーションしてくれない。SVG を `<div>` でラップして、ラッパー側をアニメーションする。

**誤り (SVG を直接アニメーションする — ハードウェアアクセラレーションが効かない):**

```tsx
function LoadingSpinner() {
  return (
    <svg 
      className="animate-spin"
      width="24" 
      height="24" 
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
    </svg>
  )
}
```

**正解 (ラッパーの div をアニメーションする — ハードウェアアクセラレーションが効く):**

```tsx
function LoadingSpinner() {
  return (
    <div className="animate-spin">
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
      </svg>
    </div>
  )
}
```

これは CSS の transform / transition 全般 (`transform` / `opacity` / `translate` / `scale` / `rotate`) に当てはまる。ラッパー div を介すことで、ブラウザは GPU アクセラレーションを使ってスムーズにアニメーションできる。
