---
title: 繰り返し関数呼び出しをキャッシュする
impact: MEDIUM
impactDescription: 冗長な計算を避ける
tags: javascript, cache, memoization, performance
---

## 繰り返し関数呼び出しをキャッシュする

レンダリング中に同じ関数が同じ入力で何度も呼ばれるなら、モジュールレベルの Map に結果をキャッシュする。

**誤り (冗長な計算):**

```typescript
function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // slugify() が同じ project 名に対して 100 回以上呼ばれる
        const slug = slugify(project.name)
        
        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

**正解 (結果をキャッシュする):**

```typescript
// モジュールレベルのキャッシュ
const slugifyCache = new Map<string, string>()

function cachedSlugify(text: string): string {
  if (slugifyCache.has(text)) {
    return slugifyCache.get(text)!
  }
  const result = slugify(text)
  slugifyCache.set(text, result)
  return result
}

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // ユニークな project 名 1 つにつき 1 回だけ計算される
        const slug = cachedSlugify(project.name)
        
        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

**単一値関数向けのシンプルなパターン:**

```typescript
let isLoggedInCache: boolean | null = null

function isLoggedIn(): boolean {
  if (isLoggedInCache !== null) {
    return isLoggedInCache
  }
  
  isLoggedInCache = document.cookie.includes('auth=')
  return isLoggedInCache
}

// 認証が変わったらキャッシュをクリア
function onAuthChange() {
  isLoggedInCache = null
}
```

hook ではなく Map を使うので、ユーティリティでもイベントハンドラでも、React コンポーネント以外でも使える。

参考: [How we made the Vercel Dashboard twice as fast](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)
