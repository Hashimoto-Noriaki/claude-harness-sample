# Next.js API Routes ルール

## 配置
- ルートは `src/app/api/` 以下に配置する
- ファイル名は `route.ts` に統一する

## レスポンス
- レスポンスは必ず `NextResponse.json()` を使用する
- 成功時: `{ data: T }`
- エラー時: `{ error: string }` に統一する

## 認証
- 認証チェックはルートハンドラの先頭で行う
- 未認証は即 `401` を返す

## 環境変数
- `process.env` で参照し、`.env.local` に定義する
- クライアントに渡す場合のみ `NEXT_PUBLIC_` プレフィックスをつける
