# 旅のしおりアプリ

## 開発

```sh
npm ci

supabase gen types typescript --project-id $PROJECT_ID > src/libs/supabase.types.ts
npm run fix

npm run dev

git push # デプロイ
```
