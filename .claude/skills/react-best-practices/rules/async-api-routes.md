---
title: API ルートでウォーターフォールの連鎖を防ぐ
impact: CRITICAL
impactDescription: 2-10× の改善
tags: api-routes, server-actions, waterfalls, parallelization
---

## API ルートでウォーターフォールの連鎖を防ぐ

API ルートや Server Action では、独立した処理を「まだ await しない」状態であってもすぐ起動する。

**誤り (config が auth を、data がその両方を待ってしまう):**

```typescript
export async function GET(request: Request) {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return Response.json({ data, config })
}
```

**正解 (auth と config を即起動):**

```typescript
export async function GET(request: Request) {
  const sessionPromise = auth()
  const configPromise = fetchConfig()
  const session = await sessionPromise
  const [config, data] = await Promise.all([
    configPromise,
    fetchData(session.user.id)
  ])
  return Response.json({ data, config })
}
```

依存関係がもっと複雑な場合は `better-all` を使って並列度を自動で最大化できる (「依存関係ベースの並列化」を参照)。
