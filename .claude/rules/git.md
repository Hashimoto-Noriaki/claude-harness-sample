# Git 運用ルール

## ブランチ命名規則

- 機能追加: `feature/#{issue番号}-{内容}`
- バグ修正: `fix/#{issue番号}-{内容}`
- リリース: `release/{バージョン}`

## コミットメッセージ（Conventional Commits）

形式: `<type>(<scope>): <description>`

type の選択肢:

- feat: 新機能
- fix: バグ修正
- docs: ドキュメント
- refactor: リファクタリング
- test: テスト追加・修正
- chore: 設定変更

scope の例（マッチングアプリクローン向け）:

- profiles, matches, likes, auth, ui, api

## PR のルール

- タイトルは Conventional Commits 形式に合わせる
- レビュアーを必ず1名以上アサインする
- CI が通ってからマージする
