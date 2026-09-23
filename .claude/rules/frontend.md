# フロントエンド開発ルール

## 言語・フレームワーク

- TypeScript strict mode
- Next.js App Router
- Tailwind CSS のみ（インラインスタイル禁止）

## コンポーネント

- 関数コンポーネントのみ
- Server Component をデフォルトとし、必要な場合のみ `"use client"` をつける

## ディレクトリ

- ドメインごとに `src/features/{domain}/` に分ける
- コンポーネント・hooks・types・テストを同じfeatureフォルダに置く（Co-location）
- 複数featureをまたぐものだけ `src/shared/` に置く

## 命名

- コンポーネント: PascalCase
- hooks: `use` プレフィックス（例: `useProfiles`）
- 型: PascalCase（例: `Profile`, `User`）
