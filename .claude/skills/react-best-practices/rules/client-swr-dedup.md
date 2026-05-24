---
title: 自動重複排除には SWR を使う
impact: MEDIUM-HIGH
impactDescription: 自動重複排除
tags: client, swr, deduplication, data-fetching
---

## 自動重複排除には SWR を使う

SWR を使うと、リクエストの重複排除・キャッシュ・再検証がコンポーネントインスタンス間で自動で効く。

**誤り (重複排除なし、各インスタンスが fetch する):**

```tsx
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])
}
```

**正解 (複数インスタンスが 1 リクエストを共有する):**

```tsx
import useSWR from 'swr'

function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
```

**イミュータブルなデータの場合:**

```tsx
import { useImmutableSWR } from '@/lib/swr'

function StaticContent() {
  const { data } = useImmutableSWR('/api/config', fetcher)
}
```

**ミューテーションの場合:**

```tsx
import { useSWRMutation } from 'swr/mutation'

function UpdateButton() {
  const { trigger } = useSWRMutation('/api/user', updateUser)
  return <button onClick={() => trigger()}>Update</button>
}
```

参考: [https://swr.vercel.app](https://swr.vercel.app)
