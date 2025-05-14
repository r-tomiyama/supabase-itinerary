# 持ち物（パッキングアイテム）機能の実装方針

## 1. テーブル設計

```sql
create table public.packing_items (
  id uuid not null default uuid_generate_v4() primary key,
  trip_id uuid not null references public.trips(id) on delete cascade,
  name text not null,
  quantity integer not null default 1,
  is_packed boolean not null default false,
  category text,  -- カテゴリは文字列として保存
  category_color text,  -- カテゴリの色（オプション）
  assigned_to uuid references public.profiles(id),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- インデックス
create index packing_items_trip_id_idx on public.packing_items(trip_id);
create index packing_items_assigned_to_idx on public.packing_items(assigned_to);
create index packing_items_category_idx on public.packing_items(category);
```

## 2. ファイル構成

### 2.1 サーバーサイド

```
src/
├─ app/
│  ├─ protected/
│  │  ├─ trips/
│  │  │  ├─ [id]/
│  │  │  │  ├─ packing/              # 持ち物（パッキング）ページ
│  │  │  │  │  ├─ page.tsx           # 持ち物リストページ
│  │  │  │  │  ├─ fetcher.ts         # 持ち物データ取得用fetcher
│  │  │  │  ├─ page.tsx              # 既存の旅行詳細ページに持ち物ページへのリンクを追加
```

### 2.2 クライアントサイド

```
src/
├─ client/
│  ├─ actions/
│  │  ├─ createPackingItem.ts        # 持ち物作成アクション
│  │  ├─ updatePackingItem.ts        # 持ち物更新アクション
│  │  ├─ deletePackingItem.ts        # 持ち物削除アクション
│  ├─ features/
│  │  ├─ create-packing-item-modal/  # 持ち物作成モーダル
│  │  │  ├─ create-packing-item-modal.tsx
│  │  │  ├─ packing-item-modal-wrapper.tsx
│  │  │  ├─ _parts/
│  │  │  │  ├─ create-packing-item-modal-trigger.tsx
│  │  │  │  ├─ packing-item-form-field.tsx
│  │  │  │  ├─ packing-item-form.tsx
```

## 3. コンポーネント設計

### 3.1 持ち物リストページ（packing/page.tsx）

- 旅行IDに紐づく持ち物リストを表示
- カテゴリ別に持ち物を表示（カテゴリは文字列ベース）
- 持ち物の追加・編集・削除機能
- 持ち物のステータス（準備済み/未準備）切り替え機能
- 持ち物の担当者表示・割り当て機能
- カテゴリのフィルタリング機能
- 旅行詳細ページへの戻るリンク

### 3.2 持ち物作成/編集モーダル

- 名前、数量、カテゴリ、担当者、メモの入力フィールド
- カテゴリは自由入力またはドロップダウン（既存カテゴリから選択）
- カテゴリの色選択（オプション）
- 既存の持ち物の編集機能
- 持ち物の削除機能

## 4. データフロー

### 4.1 データ取得

```typescript
// src/app/protected/trips/[id]/packing/fetcher.ts
import { createClient } from "@/services/supabase/server";
import { getSignedUser } from "@/services/user/getSignedUser";

export const fetcher = async (tripId: string) => {
  const supabase = await createClient();
  const { user } = await getSignedUser();

  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();

  const { data: membership } = await supabase
    .from("trip_members")
    .select("*")
    .eq("trip_id", tripId)
    .eq("user_id", user.id)
    .single();

  // 旅行メンバー一覧を取得
  const { data: tripMembers } = await supabase
    .from("trip_members")
    .select("*, profiles(id, email, display_name, avatar_url)")
    .eq("trip_id", tripId);

  // パッキングアイテムを取得
  const { data: packingItems } = await supabase
    .from("packing_items")
    .select("*, profiles(id, display_name, avatar_url)")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });

  // カテゴリごとにアイテムをグループ化
  const categorizedItems = packingItems?.reduce((acc, item) => {
    const category = item.category || "未分類";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return {
    trip,
    membership,
    tripMembers,
    packingItems,
    categorizedItems,
  };
};
```

### 4.2 データ更新

1. クライアントアクションを使用して持ち物データを更新
2. 更新後にページをリロードまたは状態を更新

## 5. UI/UX設計

### 5.1 旅行詳細ページへのリンク追加

```tsx
// src/app/protected/trips/[id]/page.tsx に追加
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageIcon } from "lucide-react"; // 荷物アイコン

// 既存のコンポーネント内に追加
<div className="flex flex-col gap-8">
  <BudgetSummary 
    trip={trip} 
    totalActualCost={totalActualCost} 
    totalPlannedBudget={totalPlannedBudget}
  />

  <ItineraryList
    trip={trip}
    itineraries={itineraries}
    tripDaysArray={tripDaysArray}
  />

  <TripMembers tripMembers={tripMembers} />
  
  {/* パッキングページへのリンクを追加 */}
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-semibold flex items-center gap-2">
      <PackageIcon size={20} />
      持ち物リスト
    </h2>
    <Link href={`/protected/trips/${trip.id}/packing`}>
      <Button variant="outline" className="flex items-center gap-2">
        <PackageIcon size={16} />
        持ち物リストを管理
      </Button>
    </Link>
  </div>
</div>
```

### 5.2 持ち物リストページのレイアウト

- ヘッダー：旅行名、戻るリンク
- フィルターセクション：カテゴリフィルター、ステータスフィルター
- 持ち物追加ボタン
- カテゴリ別セクション：各カテゴリごとに持ち物リストを表示
- 各持ち物アイテム：チェックボックス、名前、数量、担当者、編集・削除ボタン

### 5.3 持ち物作成/編集モーダル

- フォームフィールド：名前、数量、カテゴリ、担当者、メモ
- カテゴリ入力：テキスト入力と既存カテゴリの候補表示
- 担当者選択：旅行メンバーからドロップダウンで選択
- 保存・キャンセルボタン

## 6. 持ち物の共有機能（誰が何を持っていくか）

### 6.1 データモデル

`packing_items`テーブルの`assigned_to`フィールドは、そのアイテムを持っていく担当者（旅行メンバー）のユーザーIDを保存します。このフィールドはnullable（任意）であり、担当者が割り当てられていない場合はnullになります。

```sql
assigned_to uuid references public.profiles(id),
```

### 6.2 UI/UX

#### 持ち物リスト表示

- 各持ち物アイテムの横に担当者のアバターと名前を表示
- 担当者が割り当てられていない場合は「未割り当て」と表示
- 担当者ごとにフィルタリングできる機能を提供（「自分の持ち物だけ表示」など）

```tsx
// 持ち物アイテムの表示例
<div className="flex items-center justify-between p-3 border rounded-md mb-2">
  <div className="flex items-center gap-3">
    <Checkbox 
      checked={item.is_packed} 
      onCheckedChange={(checked) => handleTogglePacked(item.id, !!checked)} 
    />
    <div>
      <p className="font-medium">{item.name}</p>
      <p className="text-sm text-gray-500">数量: {item.quantity}</p>
    </div>
  </div>
  
  <div className="flex items-center gap-2">
    {/* 担当者表示 */}
    {item.assigned_to ? (
      <div className="flex items-center gap-1">
        <Avatar size="sm" src={item.profiles?.avatar_url} />
        <span className="text-sm">{item.profiles?.display_name}</span>
      </div>
    ) : (
      <span className="text-sm text-gray-400">未割り当て</span>
    )}
    
    {/* 編集・削除ボタン */}
    <button onClick={() => handleEdit(item)} className="p-1 text-gray-400 hover:text-gray-600">
      <PencilIcon size={16} />
    </button>
    <button onClick={() => handleDelete(item.id)} className="p-1 text-gray-400 hover:text-red-600">
      <TrashIcon size={16} />
    </button>
  </div>
</div>
```

#### 持ち物作成/編集モーダル

- 担当者選択ドロップダウンを提供
- 旅行メンバー全員をリストアップ
- 各メンバーのアバターと名前を表示
- デフォルトは「未割り当て」

```tsx
// 担当者選択フィールドの例
<div className="mb-4">
  <Label htmlFor="assigned_to">担当者</Label>
  <Select
    id="assigned_to"
    value={formData.assigned_to || ""}
    onValueChange={(value) => setFormData({...formData, assigned_to: value || null})}
  >
    <SelectTrigger>
      <SelectValue placeholder="担当者を選択" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="">未割り当て</SelectItem>
      {tripMembers.map((member) => (
        <SelectItem key={member.user_id} value={member.user_id}>
          <div className="flex items-center gap-2">
            <Avatar size="sm" src={member.profiles.avatar_url} />
            <span>{member.profiles.display_name}</span>
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
```

### 6.3 機能実装

#### 担当者割り当て

```typescript
// src/client/actions/updatePackingItem.ts
export async function updatePackingItem(
  itemId: string,
  data: {
    name?: string;
    quantity?: number;
    is_packed?: boolean;
    category?: string;
    category_color?: string;
    assigned_to?: string | null;
    notes?: string;
  }
) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from("packing_items")
    .update(data)
    .eq("id", itemId);
    
  if (error) {
    return {
      success: false,
      error: error.message
    };
  }
  
  return {
    success: true
  };
}
```

#### 担当者フィルター

```typescript
// 担当者フィルター機能
const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);

// フィルター適用関数
const filteredItems = useMemo(() => {
  if (!packingItems) return [];
  
  return packingItems.filter(item => {
    // 担当者フィルターが設定されている場合
    if (assigneeFilter) {
      // 「自分の持ち物」フィルター
      if (assigneeFilter === 'me') {
        return item.assigned_to === user.id;
      }
      // 特定の担当者フィルター
      return item.assigned_to === assigneeFilter;
    }
    
    return true; // フィルターなしの場合はすべて表示
  });
}, [packingItems, assigneeFilter, user.id]);
```

## 7. 実装手順

1. テーブル作成（マイグレーション）
2. 型定義の更新
3. 旅行詳細ページに持ち物ページへのリンク追加
4. 持ち物ページの実装
   - ページコンポーネント
   - fetcher
5. クライアントアクションの実装
   - 作成
   - 更新
   - 削除
6. 持ち物作成/編集モーダルの実装

## 8. 拡張性を考慮した設計ポイント

1. カテゴリの柔軟な管理（文字列ベース）
2. 持ち物の担当者割り当て
3. 数量管理
4. メモ機能
5. 準備状況の管理

## 9. ファイル作成一覧

```
# サーバーサイド
src/app/protected/trips/[id]/packing/page.tsx
src/app/protected/trips/[id]/packing/fetcher.ts

# クライアントサイド
src/client/actions/createPackingItem.ts
src/client/actions/updatePackingItem.ts
src/client/actions/deletePackingItem.ts

src/client/features/create-packing-item-modal/create-packing-item-modal.tsx
src/client/features/create-packing-item-modal/packing-item-modal-wrapper.tsx
src/client/features/create-packing-item-modal/_parts/create-packing-item-modal-trigger.tsx
src/client/features/create-packing-item-modal/_parts/packing-item-form-field.tsx
src/client/features/create-packing-item-modal/_parts/packing-item-form.tsx
