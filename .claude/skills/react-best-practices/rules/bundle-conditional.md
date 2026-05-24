---
title: モジュールの条件付きロード
impact: HIGH
impactDescription: 大きなデータを必要なときだけロード
tags: bundle, conditional-loading, lazy-loading
---

## モジュールの条件付きロード

大きなデータやモジュールは、その機能が有効になったときだけロードする。

**例 (アニメーションフレームを遅延ロード):**

```tsx
function AnimationPlayer({ enabled, setEnabled }: { enabled: boolean; setEnabled: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [frames, setFrames] = useState<Frame[] | null>(null)

  useEffect(() => {
    if (enabled && !frames && typeof window !== 'undefined') {
      import('./animation-frames.js')
        .then(mod => setFrames(mod.frames))
        .catch(() => setEnabled(false))
    }
  }, [enabled, frames, setEnabled])

  if (!frames) return <Skeleton />
  return <Canvas frames={frames} />
}
```

`typeof window !== 'undefined'` のチェックにより、このモジュールが SSR 用にバンドルされるのを防げる。サーババンドルサイズとビルド速度の両方を最適化できる。
