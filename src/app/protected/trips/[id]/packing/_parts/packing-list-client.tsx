"use client";

import { useState } from "react";

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

  // フィルター変更ハンドラ
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  // カテゴリが空の場合
  if (categories.length === 0) {
    return <EmptyPackingList tripId={tripId} />;
  }

  return (
    <>
      {/* カテゴリフィルター */}
      <div className="mb-4">
        <PackingCategoryFilter
          categories={categories}
          tripMembers={tripMembers}
          userId={userId}
          onFilterChange={handleFilterChange}
        />
      </div>

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
          />
        ))}
      </div>
    </>
  );
}
