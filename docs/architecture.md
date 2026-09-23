# アーキテクチャ概要

## ディレクトリ構成

```bash
src/
├── app/                    # Next.js App Router（ルーティングのみ）
│   ├── (auth)/             # 認証ページ群（ルートグループ）
│   │   ├── layout.tsx      # 認証ページ共通レイアウト
│   │   ├── login/
│   │   └── signup/
│   ├── profiles/
│   │   ├── page.tsx        # /profiles
│   │   └── men/page.tsx    # /profiles/men
│   ├── layout.tsx
│   └── page.tsx            # / (ウェルカムページ)
│
├── features/               # ドメインごとの機能モジュール
│   ├── auth/
│   ├── likes/
│   ├── profiles/
│   └── stocks/
│
└── shared/                 # 複数 feature をまたぐ共通コンポーネント
    └── components/
        ├── Button.tsx
        └── Input.tsx
```

## レイヤーの役割分担

### `src/app/`

ルーティングと最小限のレイアウトのみ担当する。ロジックや UI の詳細は持たない。
ページコンポーネントは対応する `features/` のコンポーネントを呼び出すだけにとどめる。

```tsx
// 良い例: app はコンポーネントを呼ぶだけ
export default function LoginPage() {
  return <LoginForm />;
}
```

### `src/features/{domain}/`

機能単位のコードをすべてまとめる（Co-location）。

```bash
features/profiles/
├── components/   # UI コンポーネント
├── data/         # モックデータ
├── hooks/        # カスタム hooks
└── types/        # 型定義
```

同じ feature 内のファイルは自由に参照し合ってよい。
別の feature のファイルを直接 import してはいけない。

### `src/shared/`

複数の feature から使われる汎用コンポーネントのみ置く。
特定ドメインの知識（Profile や User の型など）を持たせない。

## Server Component と Client Component

**デフォルトは Server Component**。以下の場合のみ `"use client"` をつける。

| 必要な場面                                         | 例                                 |
| -------------------------------------------------- | ---------------------------------- |
| `useState` / `useEffect` などの React hooks を使う | `useLikes`, `useStocks`, `useAuth` |
| ブラウザ API（localStorage など）にアクセスする    | 認証のセッション管理               |
| イベントハンドラ（onClick など）を持つ             | `ProfileCard`, `LoginForm`         |

現状のページコンポーネント（`app/` 配下）はすべて Server Component のまま保つ。

## データの流れ

このアプリはデータベースを持たない。データは3種類の方法で管理される。

```bash
モックデータ（静的）
  └─ src/features/profiles/data/
       └─ profiles.ts, maleProfiles.ts
            └─ ページコンポーネントから直接 import

localStorage（ブラウザ永続化）
  ├─ useAuth   → auth_session, auth_users, pwd_{id}
  ├─ useLikes  → liked_profiles
  └─ useStocks → stocked_profiles

メモリ（React state）
  └─ hooks 内の useState でセッション中のみ保持
```

## 型定義の場所

型は各 feature の `types/index.ts` に集約する。
`src/shared/` に置くのは複数 feature をまたぐ型のみ（現状は未作成）。

| 型                                  | 場所                               |
| ----------------------------------- | ---------------------------------- |
| `Profile`                           | `features/profiles/types/index.ts` |
| `User`, `LoginInput`, `SignupInput` | `features/auth/types/index.ts`     |
| `LikedProfiles`                     | `features/likes/types/index.ts`    |
| `StockedProfiles`                   | `features/stocks/types/index.ts`   |
