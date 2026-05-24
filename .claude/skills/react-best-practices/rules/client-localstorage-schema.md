---
title: localStorage データをバージョン管理し最小化する
impact: MEDIUM
impactDescription: スキーマ衝突を防ぎ、ストレージサイズを削減
tags: client, localStorage, storage, versioning, data-minimization
---

## localStorage データをバージョン管理し最小化する

キーにバージョン接頭辞を付け、必要なフィールドだけを保存する。スキーマ衝突と、機密データの誤保存を防げる。

**誤り:**

```typescript
// バージョンなし、丸ごと保存、エラーハンドリングなし
localStorage.setItem('userConfig', JSON.stringify(fullUserObject))
const data = localStorage.getItem('userConfig')
```

**正解:**

```typescript
const VERSION = 'v2'

function saveConfig(config: { theme: string; language: string }) {
  try {
    localStorage.setItem(`userConfig:${VERSION}`, JSON.stringify(config))
  } catch {
    // シークレット / プライベートブラウジング、容量超過、無効化時に throw する
  }
}

function loadConfig() {
  try {
    const data = localStorage.getItem(`userConfig:${VERSION}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

// v1 から v2 へのマイグレーション
function migrate() {
  try {
    const v1 = localStorage.getItem('userConfig:v1')
    if (v1) {
      const old = JSON.parse(v1)
      saveConfig({ theme: old.darkMode ? 'dark' : 'light', language: old.lang })
      localStorage.removeItem('userConfig:v1')
    }
  } catch {}
}
```

**サーバレスポンスから最小限のフィールドだけ保存する:**

```typescript
// ユーザーオブジェクトは 20+ フィールドあるが、UI が必要な分だけ保存
function cachePrefs(user: FullUser) {
  try {
    localStorage.setItem('prefs:v1', JSON.stringify({
      theme: user.preferences.theme,
      notifications: user.preferences.notifications
    }))
  } catch {}
}
```

**必ず try-catch で囲む:** `getItem()` / `setItem()` はシークレット / プライベートブラウジング (Safari / Firefox)・容量超過・無効化時に throw する。

**メリット:** バージョニングによるスキーマの進化、ストレージサイズの削減、トークン / PII / 内部フラグの誤保存防止。
