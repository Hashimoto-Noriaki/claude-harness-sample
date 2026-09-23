# データモデル定義

このアプリはデータベースを持たない。型定義・モックデータ・localStorage の3つでデータを管理する。

## 型一覧

### `Profile`

`src/features/profiles/types/index.ts`

```ts
type Profile = {
  id: string; // "1", "m1" など連番文字列
  name: string; // 氏名
  age: number; // 年齢
  location: string; // 居住都道府県
  bio: string; // 自己紹介文
  imageUrl: string; // プロフィール画像 URL
  hobbies: string[]; // 趣味タグ（3件程度）
};
```

### `User`

`src/features/auth/types/index.ts`

```ts
type User = {
  id: string; // crypto.randomUUID() で生成
  email: string;
  name: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type SignupInput = {
  email: string;
  password: string;
  name: string;
};
```

> `password` はハッシュ化後に localStorage へ保存され、`User` 型には含まれない。

### `LikedProfiles` / `StockedProfiles`

`src/features/likes/types/index.ts` / `src/features/stocks/types/index.ts`

```ts
type LikedProfiles = {
  profileIds: string[];
};

type StockedProfiles = {
  profileIds: string[];
};
```

> 現状これらの型は localStorage のデータ構造の説明として存在し、hooks 内では `string[]` を直接扱っている。

---

## モックデータ

| ファイル                                 | エクスポート名      | 件数 | 用途                           |
| ---------------------------------------- | ------------------- | ---- | ------------------------------ |
| `features/profiles/data/profiles.ts`     | `dummyProfiles`     | 8件  | `/profiles` ページ（女性）     |
| `features/profiles/data/maleProfiles.ts` | `dummyMaleProfiles` | 8件  | `/profiles/men` ページ（男性） |

ID の命名規則:

- 女性プロフィール: `"1"` 〜 `"8"`（数値文字列）
- 男性プロフィール: `"m1"` 〜 `"m8"`（`m` プレフィックス付き）

---

## localStorage スキーマ

| キー               | 型              | 書き込み元  | 内容                            |
| ------------------ | --------------- | ----------- | ------------------------------- |
| `auth_users`       | `User[]` JSON   | `useAuth`   | 登録済みユーザー一覧            |
| `auth_session`     | `User` JSON     | `useAuth`   | ログイン中のユーザー            |
| `pwd_{userId}`     | `string`        | `useAuth`   | SHA-256 ハッシュ済みパスワード  |
| `liked_profiles`   | `string[]` JSON | `useLikes`  | いいねした Profile の ID 一覧   |
| `stocked_profiles` | `string[]` JSON | `useStocks` | ストックした Profile の ID 一覧 |

---

## 型の関係図

```text
User ──── (auth_session) ──── ログイン状態
  │
  └── id ── pwd_{userId} ── ハッシュ済みパスワード

Profile ──── dummyProfiles / dummyMaleProfiles
  │
  └── id ── liked_profiles[]   （User がいいねした Profile.id の集合）
         └── stocked_profiles[] （User がストックした Profile.id の集合）
```

> マッチング機能は未実装のため、`User` と `Profile` は現状直接紐付いていない。
