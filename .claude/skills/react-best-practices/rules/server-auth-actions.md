---
title: Server Action は API ルートと同様に認証する
impact: CRITICAL
impactDescription: サーバ側変更操作への不正アクセスを防ぐ
tags: server, server-actions, authentication, security, authorization
---

## Server Action は API ルートと同様に認証する

**影響度: CRITICAL (サーバ側ミューテーションへの不正アクセスを防ぐ)**

Server Action (`"use server"` 付きの関数) は、API ルートと同じく公開エンドポイントとして露出する。各 Server Action の **中で** 必ず認証と認可を検証する。Server Action は直接呼び出せるため、ミドルウェア・レイアウトガード・ページレベルのチェックだけに頼ってはいけない。

Next.js のドキュメントも明記している: 「Server Action は公開 API エンドポイントと同じセキュリティ意識で扱い、ユーザーがそのミューテーションを実行する権限を持つか必ず検証すること」。

**誤り (認証チェックなし):**

```typescript
'use server'

export async function deleteUser(userId: string) {
  // 誰でも呼べてしまう! 認証チェックなし
  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**正解 (アクション内で認証する):**

```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { unauthorized } from '@/lib/errors'

export async function deleteUser(userId: string) {
  // アクションの中で必ず認証する
  const session = await verifySession()
  
  if (!session) {
    throw unauthorized('Must be logged in')
  }
  
  // 認可も確認する
  if (session.user.role !== 'admin' && session.user.id !== userId) {
    throw unauthorized('Cannot delete other users')
  }
  
  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**入力バリデーション込み:**

```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { z } from 'zod'

const updateProfileSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email()
})

export async function updateProfile(data: unknown) {
  // まず入力をバリデーション
  const validated = updateProfileSchema.parse(data)
  
  // 次に認証
  const session = await verifySession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  // 次に認可
  if (session.user.id !== validated.userId) {
    throw new Error('Can only update own profile')
  }
  
  // 最後にミューテーションを実行
  await db.user.update({
    where: { id: validated.userId },
    data: {
      name: validated.name,
      email: validated.email
    }
  })
  
  return { success: true }
}
```

参考: [https://nextjs.org/docs/app/guides/authentication](https://nextjs.org/docs/app/guides/authentication)
