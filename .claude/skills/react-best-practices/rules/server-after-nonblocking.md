---
title: ブロッキングしない処理には `after()` を使う
impact: MEDIUM
impactDescription: 応答時間の高速化
tags: server, async, logging, analytics, side-effects
---

## ブロッキングしない処理には `after()` を使う

Next.js の `after()` を使って、レスポンス送信後に走らせたい処理をスケジュールする。ロギング・アナリティクスなどの副作用にレスポンスを引きずられないようにできる。

**誤り (レスポンスをブロックする):**

```tsx
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // ミューテーションを実行
  await updateDatabase(request)
  
  // ロギングがレスポンスをブロックする
  const userAgent = request.headers.get('user-agent') || 'unknown'
  await logUserAction({ userAgent })
  
  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

**正解 (ノンブロッキング):**

```tsx
import { after } from 'next/server'
import { headers, cookies } from 'next/headers'
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // ミューテーションを実行
  await updateDatabase(request)
  
  // レスポンス送信後にログを取る
  after(async () => {
    const userAgent = (await headers()).get('user-agent') || 'unknown'
    const sessionCookie = (await cookies()).get('session-id')?.value || 'anonymous'
    
    logUserAction({ sessionCookie, userAgent })
  })
  
  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

レスポンスは即座に送信され、ロギングはバックグラウンドで走る。

**よくあるユースケース:**

- アナリティクストラッキング
- 監査ログ
- 通知送信
- キャッシュ無効化
- クリーンアップ処理

**重要な注意点:**

- `after()` はレスポンスが失敗・リダイレクトしても実行される
- Server Action / Route Handler / Server Component のいずれでも使える

参考: [https://nextjs.org/docs/app/api-reference/functions/after](https://nextjs.org/docs/app/api-reference/functions/after)
