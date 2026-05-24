---
title: 配列の複数イテレーションをまとめる
impact: LOW-MEDIUM
impactDescription: イテレーション回数を削減
tags: javascript, arrays, loops, performance
---

## 配列の複数イテレーションをまとめる

`.filter()` や `.map()` を複数回呼ぶと、配列を何度も走査することになる。1 つのループにまとめる。

**誤り (3 回走査):**

```typescript
const admins = users.filter(u => u.isAdmin)
const testers = users.filter(u => u.isTester)
const inactive = users.filter(u => !u.isActive)
```

**正解 (1 回の走査):**

```typescript
const admins: User[] = []
const testers: User[] = []
const inactive: User[] = []

for (const user of users) {
  if (user.isAdmin) admins.push(user)
  if (user.isTester) testers.push(user)
  if (!user.isActive) inactive.push(user)
}
```
