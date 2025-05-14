"use client";

import { useState } from "react";

import { EmptyPackingList } from "./empty-packing-list";
import {
  PackingCategoryFilter,
  FilterOptions,
} from "./packing-category-filter";
import { PackingCategorySection } from "./packing-category-section";

interface PackingListClientProps {
  categories: string[];
  categorizedItems: Record<string, any[]>;
  tripMembers: any[];
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
          tripMembers={tripMembers || []}
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
            items={categorizedItems?.[category] || []}
            tripMembers={tripMembers || []}
            tripId={tripId}
            filters={filters}
          />
        ))}
      </div>
    </>
  );
}
