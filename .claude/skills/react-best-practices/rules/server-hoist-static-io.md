---
title: 静的 I/O はモジュールレベルにホイストする
impact: HIGH
impactDescription: リクエストごとのファイル / ネットワーク I/O 重複を回避
tags: server, io, performance, next.js, route-handlers, og-image
---

## 静的 I/O はモジュールレベルにホイストする

**影響度: HIGH (リクエストごとのファイル / ネットワーク I/O 重複を回避)**

Route Handler やサーバ関数で静的アセット (フォント・ロゴ・画像・設定ファイル) をロードするときは、I/O をモジュールレベルに引き上げる。モジュールレベルのコードはモジュールが最初に import された 1 回だけ走る — リクエストごとには走らない。これでリクエスト起動ごとに繰り返されるファイル読み込みや fetch を排除できる。

**誤り (リクエストごとにフォントファイルを読み込む):**

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  // 毎リクエスト走る — コスト高
  const fontData = await fetch(
    new URL('./fonts/Inter.ttf', import.meta.url)
  ).then(res => res.arrayBuffer())

  const logoData = await fetch(
    new URL('./images/logo.png', import.meta.url)
  ).then(res => res.arrayBuffer())

  return new ImageResponse(
    <div style={{ fontFamily: 'Inter' }}>
      <img src={logoData} />
      Hello World
    </div>,
    { fonts: [{ name: 'Inter', data: fontData }] }
  )
}
```

**正解 (モジュール初期化時に 1 回だけロードする):**

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'

// モジュールレベル: モジュールが最初に import されたときに 1 回だけ走る
const fontData = fetch(
  new URL('./fonts/Inter.ttf', import.meta.url)
).then(res => res.arrayBuffer())

const logoData = fetch(
  new URL('./images/logo.png', import.meta.url)
).then(res => res.arrayBuffer())

export async function GET(request: Request) {
  // 起動済みの promise を await するだけ
  const [font, logo] = await Promise.all([fontData, logoData])

  return new ImageResponse(
    <div style={{ fontFamily: 'Inter' }}>
      <img src={logo} />
      Hello World
    </div>,
    { fonts: [{ name: 'Inter', data: font }] }
  )
}
```

**正解 (モジュールレベルの同期 fs):**

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

// モジュールレベルでの同期読み込み — ブロックするのは初期化時だけ
const fontData = readFileSync(
  join(process.cwd(), 'public/fonts/Inter.ttf')
)

const logoData = readFileSync(
  join(process.cwd(), 'public/images/logo.png')
)

export async function GET(request: Request) {
  return new ImageResponse(
    <div style={{ fontFamily: 'Inter' }}>
      <img src={logoData} />
      Hello World
    </div>,
    { fonts: [{ name: 'Inter', data: fontData }] }
  )
}
```

**誤り (呼ばれるたびに config を読む):**

```typescript
import fs from 'node:fs/promises'

export async function processRequest(data: Data) {
  const config = JSON.parse(
    await fs.readFile('./config.json', 'utf-8')
  )
  const template = await fs.readFile('./template.html', 'utf-8')

  return render(template, data, config)
}
```

**正解 (config とテンプレートをモジュールレベルにホイストする):**

```typescript
import fs from 'node:fs/promises'

const configPromise = fs
  .readFile('./config.json', 'utf-8')
  .then(JSON.parse)
const templatePromise = fs.readFile('./template.html', 'utf-8')

export async function processRequest(data: Data) {
  const [config, template] = await Promise.all([
    configPromise,
    templatePromise,
  ])

  return render(template, data, config)
}
```

このパターンを使う場面:

- OG 画像生成のためのフォントロード
- 静的なロゴ・アイコン・ウォーターマークのロード
- 実行時に変わらない設定ファイルの読み込み
- メールテンプレートやその他の静的テンプレートのロード
- 全リクエストで共通な任意の静的アセット

このパターンを使わない場面:

- リクエストやユーザーごとに異なるアセット
- 実行時に変わる可能性のあるファイル (代わりに TTL 付きキャッシュを使う)
- メモリを圧迫するほど大きいファイル
- メモリに残してはいけない機密データ

Vercel の [Fluid Compute](https://vercel.com/docs/fluid-compute) を使うと、複数の同時リクエストが同じ関数インスタンスを共有するためモジュールレベルキャッシュが特に効く。静的アセットはコールドスタートのペナルティなしでリクエスト間を跨いでメモリに残る。

従来のサーバレスでは、コールドスタートのたびにモジュールレベルのコードが再実行されるが、その後のウォーム起動ではインスタンスがリサイクルされるまでロード済みアセットが再利用される。
