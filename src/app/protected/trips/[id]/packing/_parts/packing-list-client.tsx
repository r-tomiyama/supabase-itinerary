"use client";

import { useState, useCallback } from "react";

import { togglePackingItemPacked } from "@/client/actions/updatePackingItem";
import { Button } from "@/components/ui/button";

import { EmptyPackingList } from "./empty-packing-list";
import {
  PackingCategoryFilter,
  FilterOptions,
} from "./packing-category-filter";
import { PackingCategorySection } from "./packing-category-section";

// 前のファイルで定義した型を再利用
interface PackingItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  category_color?: string | null;
  assigned_to: string | null;
  is_packed: boolean;
  notes?: string | null;
  profiles?: {
    display_name: string | null;
    email: string;
  } | null;
}

interface TripMember {
  id: string;
  user_id: string;
  profiles: {
    display_name: string | null;
    email: string;
  };
}

interface PackingListClientProps {
  categories: string[];
  categorizedItems: Record<string, PackingItem[]>;
  tripMembers: TripMember[];
  tripId: string;
  userId: string;
}

export function PackingListClient({
  categories,
  categorizedItems,
  tripMembers,
  tripId,
  userId,
}: PackingListClientProps) {
  // フィルター状態
  const [filters, setFilters] = useState<FilterOptions>({
    category: null,
    assignedTo: null,
    isPacked: null,
  });

  // 変更を追跡するための状態
  const [changedItems, setChangedItems] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  // フィルター変更ハンドラ
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  // アイテムの状態変更を追跡するハンドラ
  const handleItemChange = useCallback((itemId: string, isPacked: boolean) => {
    setChangedItems((prev) => ({
      ...prev,
      [itemId]: isPacked,
    }));
  }, []);

  // すべての変更を保存
  const handleSaveAllChanges = async () => {
    if (Object.keys(changedItems).length === 0) return;

    setIsSaving(true);
    try {
      // 変更されたアイテムをまとめて処理
      const updatePromises = Object.entries(changedItems).map(
        ([itemId, isPacked]) => togglePackingItemPacked(itemId, isPacked),
      );

      await Promise.all(updatePromises);

      // 保存成功後にページをリロード
      window.location.reload();
    } catch (error) {
      console.error("保存エラー:", error);
      alert("変更の保存中にエラーが発生しました。");
    } finally {
      setIsSaving(false);
    }
  };

  // カテゴリが空の場合
  if (categories.length === 0) {
    return <EmptyPackingList tripId={tripId} />;
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* カテゴリフィルター */}
      <div className="mb-4">
        <PackingCategoryFilter
          categories={categories}
          tripMembers={tripMembers}
          userId={userId}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* 変更保存ボタン */}
      {Object.keys(changedItems).length > 0 && (
        <div className="sticky top-4 z-10 flex justify-center">
          <Button
            onClick={() => void handleSaveAllChanges()}
            disabled={isSaving}
            className="bg-teal-600 text-white shadow-md hover:bg-teal-700"
          >
            {isSaving ? "保存中..." : "完了"}
          </Button>
        </div>
      )}

      {/* 持ち物リスト */}
      <div className="space-y-6">
        {categories.map((category) => (
          <PackingCategorySection
            key={category}
            category={category}
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            items={categorizedItems[category] || []}
            tripMembers={tripMembers}
            tripId={tripId}
            filters={filters}
            onItemChange={handleItemChange}
          />
        ))}
      </div>
    </div>
  );
}
