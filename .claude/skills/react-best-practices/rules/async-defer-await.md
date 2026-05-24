---
title: 必要になるまで await を遅らせる
impact: HIGH
impactDescription: 使われないコード経路をブロックしない
tags: async, await, conditional, optimization
---

## 必要になるまで await を遅らせる

`await` は、実際にその値が使われる分岐の中まで移動する。値が要らないコード経路までブロックさせない。

**誤り (両方の分岐でブロックされる):**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)
  
  if (skipProcessing) {
    // 即座に return しているが、userData は待ってしまっている
    return { skipped: true }
  }
  
  // この分岐でしか userData を使わない
  return processUserData(userData)
}
```

**正解 (必要なときだけブロックする):**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    // 何も待たずに即 return
    return { skipped: true }
  }
  
  // 必要になってから取得
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

**別の例 (早期 return による最適化):**

```typescript
// 誤り: 常に permissions を取得する
async function updateResource(resourceId: string, userId: string) {
  const permissions = await fetchPermissions(userId)
  const resource = await getResource(resourceId)
  
  if (!resource) {
    return { error: 'Not found' }
  }
  
  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }
  
  return await updateResourceData(resource, permissions)
}

// 正解: 必要なときだけ取得する
async function updateResource(resourceId: string, userId: string) {
  const resource = await getResource(resourceId)
  
  if (!resource) {
    return { error: 'Not found' }
  }
  
  const permissions = await fetchPermissions(userId)
  
  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }
  
  return await updateResourceData(resource, permissions)
}
```

この最適化は、スキップされる分岐が頻繁に通る場合、または遅延される処理が高コストな場合に特に効く。

`await getFlag()` を安価な同期ガード (`flag && someCondition`) と組み合わせるパターンについては [非同期フラグの前に安価な条件をチェックする](./async-cheap-condition-before-await.md) を参照。
