
---
description: 変更を論理的な単位に分割してコミットメッセージを生成する。rules/git.mdとCLAUDE.mdを参照して生成する。コミットメッセージを作りたいときに使う。
---

## 指示

以下の手順でコミットメッセージを生成してください。

1. `rules/git.md` のConventional Commits形式を参照する
2. `CLAUDE.md` のフォルダ構成を参照して変更のドメインを判断する
3. 変更を論理的な単位に分割する
4. それぞれに対してコミットメッセージを生成する

形式: `<type>(<scope>): <description>`

scopeはmatching-app-cloneのドメインに合わせる:
- profiles: プロフィール機能
- matches: マッチング機能
- likes: いいね機能
- chat: チャット機能
- ui: 共通UIパーツ
- api: APIルート
