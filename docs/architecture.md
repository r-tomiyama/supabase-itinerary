# Next.js (App Router) アーキテクチャガイド

> **スコープ**：このドキュメントは、Next.js App Router（13.4以降）を使ったプロジェクトにおけるフォルダ構成・設計ルール・CIチェックの標準を定めたものです。

---

## 1. 基本原則

1. **Server-first**：すべての`.tsx`はデフォルトで**サーバーコンポーネント**として扱われる。`"use client"`は必要最小限に。
2. **ビジネスロジックはReactの外に**：DBアクセスやAPI通信は`services/`内で完結。UIから直接呼び出さない。
3. **依存方向は一方向**： `ui ➔ (components | client) ➔ app`（上位には依存しない）
4. **CIで強制チェック**：ESLintとパスエイリアスで、サーバー→クライアントの不正アクセスや`"use client"`の漏れを防ぐ。

## 2. ディレクトリ構成

```text
src/
├─ app/                    # App Router エントリポイント
│  ├─ layout.tsx           # ルートレイアウト（Server）
│  ├─ page.tsx             # ルートページ（Server）
│  ├─ (xxx)/…              # 並列ルート
│  └─ api/…                # ルートハンドラ（`use server`）
├─ components/             # サーバー専用コンポーネント
├─ ui/                     # デザインシステム（原子〜分子）
├─ client/                 # クライアント専用
│  ├─ components/          # インタラクティブなコンポーネント（"use client"）
│  └─ hooks/               # React Hooks
├─ services/               # DBアクセス・API呼び出し
└─ libs/                   # 各種ライブラリ設定（Supabase, Prisma 等）

docs/                      # ドキュメント置き場
```

## 3. フォルダ責務と配置判断基準

| フォルダ                   | 主な用途                        | 判定基準（この条件に該当する場合に配置）                      | インポートしてよいもの    | インポート禁止                |
| ---------------------- | --------------------------- | ----------------------------------------- | -------------- | ---------------------- |
| **ui/**                | 表示専用の見た目要素（状態なし）            | クラス名・構造のみ。`useState`や`onClick`なし          | —              | client/, app/          |
| **components/**        | サーバー側のテンプレート・セクション          | データ取得・静的構造。状態管理やイベントなし                    | ui/, services/ | client/                |
| **client/components/** | 状態ありウィジェット（"use client"）    | `useState`, `useEffect`, `window`, イベントなど | ui/            | services/, components/ |
| **client/hooks/**      | クライアント限定のhooks（ブラウザ依存）      | `window`, `document`, ブラウザAPI利用           | —              | server code            |
| **services/**          | DB・APIアクセス、ビジネスロジック（非React） | 外部データ取得など。UIやReactに依存しない                  | libs/          | React, next/           |
| **libs/**              | 外部ライブラリ設定ファイル               | PrismaやSupabaseの設定等                       | —              | React                  |

> **Tip**：`ui/` は**表示だけの読み取り専用**に徹する。状態や副作用は禁止。

## 4. ページ・機能実装方法

### 4.1 ページコンポーネント (`app/xxx/page.tsx`)

- なるべく `use client` を使わないようにする。
- ページ固有コンポーネント(`./_parts/xxx.tsx`)・機能コンポーネント(`./_features/xxx.tsx`)・UIコンポーネント(`@/ui/xxx.tsx`)を組み合わせて実装する。

```ts
interface PageProps {
  params: {
    id: string; // 動的ルーティングにしている場合
  };
}

export default async function XxxPage({ params }: PageProps) {
  const { id } = await params;
  const { user } = await getSignedUser();
  const { xxx } = await fetcher(id); 

  return (...);
}
```

### 4.2 Fetcher (`./fetcher.ts`)

- ページコンポーネントの中でデータを取得するための関数を定義する。

```tsx
import { createClient } from "@/services/supabase/server";
import { getSignedUser } from "@/services/user/getSignedUser";

export const fetcher = async (hogeId: string) => {
    const supabase = await createClient();
    const { user } = await getSignedUser();

    const { data: hoge } = await supabase
      .from('hoges')
      .select('*')
      .eq('id', hogeId)
      .single();

  return { hoge }
}
```

### 4.3 コンポーネントの実装

#### UIコンポーネント (`@/ui/xxx.tsx`)

- UIの原子・分子を実装する。
- `"use client"`を使うことは禁止

#### ページ固有コンポーネント (`./_parts/xxx.tsx`)

- ページ固有のUIを実装する。
- UIコンポーネントを組み合わせる。
- 必要に応じて、`"use client"`を使う。

#### 機能コンポーネント (`@/client/features/xxx.tsx`)

- 大きな機能ごと（例：旅程作成モーダル・旅程削除モーダル）のUIを実装する。
- UIコンポーネントを組み合わせる。
- 必要に応じて、`"use client"`を使う。

### 4.4 アクション

アクションには2種類あります。

#### Server Action (`@/app/actions/xxx.ts`)

`"use server"`を使ったサーバー側のアクション。サーバー用のsupabaseを利用した処理・DBアクセスを行う。

```tsx
"use server";

import { encodedRedirect } from "@libs/utils";
import { createClient } from "@services/supabase/server";
import { headers } from "next/headers";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString() || email?.split('@')[0] || 'User';
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  // サインアップを試みる
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } 
  
  // 認証が成功した場合、profilesテーブルにレコードを追加
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        display_name: name,
        created_at: new Date().toISOString()
      });

    if (profileError) {
      console.error("プロフィール作成エラー:", profileError.message);
      // プロフィール作成エラーでも認証自体は成功しているため、続行
    }
  }
};

```

#### Client Action (`@/client/actions/xxx.ts`)

クライアント側のアクション。UIの状態管理やイベント処理、Client用のsupabasを利用した処理・DBアクセスを行う。

```tsx
import { createClient } from "@services/supabase/client";
import { Database } from "@libs/supabase.types";

export type XxxFormData = {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  budget_total: number;
};

type CreateXxxResult = {
  trip: Database["public"]["Tables"]["xxx"]["Row"] | null;
  error: string | null;
};

export async function createXxx(
  formData: XxxFormData,
  userId: string
): Promise<CreateXxxResult> {
  const supabase = createClient();

  const { data: xxx, error } = await supabase
    .from("xxx")
    .insert([
      { xxx },
    ])
    .select()
    .single();

  if (error || !xxx) {
    return {
      xxx: null,
      error: error?.message || "トリップの作成に失敗しました",
    };
  }

  return {
    xxx,
    error: null,
  };
}
```
