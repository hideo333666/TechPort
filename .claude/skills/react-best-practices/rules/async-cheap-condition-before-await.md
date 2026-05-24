---
title: 非同期フラグの前に安価な条件をチェックする
impact: HIGH
impactDescription: 同期ガードで弾けるときに不要な非同期処理を回避
tags: async, await, feature-flags, short-circuit, conditional
---

## 非同期フラグの前に安価な条件をチェックする

ある分岐がフラグやリモート値の取得に `await` を使い、かつ **安価な同期条件** (ローカルな props、リクエストメタデータ、ロード済み state など) も必要としているなら、安価な条件を **先に** 評価する。そうしないと、複合条件が決して true にならないケースでも非同期コストを払うことになる。

これは [必要になるまで await を遅らせる](./async-defer-await.md) の `flag && cheapCondition` 形式特化版。

**誤り:**

```typescript
const someFlag = await getFlag()

if (someFlag && someCondition) {
  // ...
}
```

**正解:**

```typescript
if (someCondition) {
  const someFlag = await getFlag()
  if (someFlag) {
    // ...
  }
}
```

これは `getFlag` がネットワーク・フィーチャーフラグサービス・`React.cache` / DB を叩く場合に効いてくる。`someCondition` が false のコールドパスでそのコストを丸ごと省ける。

ただし、`someCondition` が高コストだったり、フラグに依存していたり、副作用の実行順序を固定したい場合は元の順序を保つ。
