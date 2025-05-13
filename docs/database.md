# データベース

supabaseのデータベースを使用しています。

## DBマイグレーション

現在はUI上で直接マイグレーションを行っています。  
マイグレーション後、以下のコマンドを実行して、型定義を更新します。

```sh
supabase gen types typescript --project-id $PROJECT_ID > src/libs/supabase.types.ts
```
