# テスト方針

## ツール
- ユニットテスト: Vitest
- E2E: Playwright

## 配置（Co-location）
- テストはコンポーネントと同じフォルダに置く
- 例: `src/features/profiles/components/ProfileCard.test.tsx`
- E2Eテストは `e2e/` フォルダにまとめる

## テスト対象
- コンポーネント: UIの表示・インタラクション
- hooks: データ取得・状態変化
- utils: 入出力のパターン

## ファイル命名
- コンポーネント: `.test.tsx`
- hooks・utils: `.test.ts`
