"use client";

import { CheckIcon, UserIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export interface FilterOptions {
  category: string | null;
  assignedTo: string | null;
  isPacked: boolean | null;
}

interface TripMember {
  id: string;
  user_id: string;
  profiles: {
    display_name: string | null;
    email: string;
  };
}

interface PackingCategoryFilterProps {
  categories: string[];
  tripMembers: TripMember[];
  userId: string;
  onFilterChange: (filters: FilterOptions) => void;
}

export function PackingCategoryFilter({
  categories,
  tripMembers,
  userId,
  onFilterChange,
}: PackingCategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeAssignee, setActiveAssignee] = useState<string | null>(null);
  const [packedFilter, setPackedFilter] = useState<boolean | null>(null);

  const handleCategoryClick = (category: string | null) => {
    const newCategory = activeCategory === category ? null : category;
    setActiveCategory(newCategory);
    updateFilters({ category: newCategory });
  };

  const handleAssigneeClick = (assigneeId: string | null) => {
    const newAssignee = activeAssignee === assigneeId ? null : assigneeId;
    setActiveAssignee(newAssignee);
    updateFilters({ assignedTo: newAssignee });
  };

  const handlePackedClick = (isPacked: boolean | null) => {
    const newPackedFilter = packedFilter === isPacked ? null : isPacked;
    setPackedFilter(newPackedFilter);
    updateFilters({ isPacked: newPackedFilter });
  };

  const updateFilters = (partialFilters: Partial<FilterOptions>) => {
    onFilterChange({
      category:
        partialFilters.category !== undefined
          ? partialFilters.category
          : activeCategory,
      assignedTo:
        partialFilters.assignedTo !== undefined
          ? partialFilters.assignedTo
          : activeAssignee,
      isPacked:
        partialFilters.isPacked !== undefined
          ? partialFilters.isPacked
          : packedFilter,
    });
  };

  return (
    <div className="space-y-3">
      {/* カテゴリフィルター */}
      <div>
        <h4 className="mb-1 text-sm font-medium text-gray-700">カテゴリ</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className={activeCategory === null ? "bg-teal-50" : ""}
            onClick={() => {
              handleCategoryClick(null);
            }}
          >
            すべて
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className={activeCategory === category ? "bg-teal-50" : ""}
              onClick={() => {
                handleCategoryClick(category);
              }}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* 担当者フィルター */}
      <div>
        <h4 className="mb-1 text-sm font-medium text-gray-700">担当者</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className={activeAssignee === null ? "bg-teal-50" : ""}
            onClick={() => {
              handleAssigneeClick(null);
            }}
          >
            すべて
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={activeAssignee === "unassigned" ? "bg-teal-50" : ""}
            onClick={() => {
              handleAssigneeClick("unassigned");
            }}
          >
            未割り当て
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={activeAssignee === userId ? "bg-teal-50" : ""}
            onClick={() => {
              handleAssigneeClick(userId);
            }}
          >
            <UserIcon size={14} className="mr-1" />
            自分の持ち物
          </Button>
          {tripMembers
            .filter((member) => member.user_id !== userId)
            .map((member) => (
              <Button
                key={member.user_id}
                variant="outline"
                size="sm"
                className={
                  activeAssignee === member.user_id ? "bg-teal-50" : ""
                }
                onClick={() => {
                  handleAssigneeClick(member.user_id);
                }}
              >
                {member.profiles.display_name}
              </Button>
            ))}
        </div>
      </div>

      {/* パッキング状態フィルター */}
      <div>
        <h4 className="mb-1 text-sm font-medium text-gray-700">準備状況</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className={packedFilter === null ? "bg-teal-50" : ""}
            onClick={() => {
              handlePackedClick(null);
            }}
          >
            すべて
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={packedFilter === true ? "bg-teal-50" : ""}
            onClick={() => {
              handlePackedClick(true);
            }}
          >
            <CheckIcon size={14} className="mr-1" />
            準備済み
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={packedFilter === false ? "bg-teal-50" : ""}
            onClick={() => {
              handlePackedClick(false);
            }}
          >
            未準備
          </Button>
        </div>
      </div>
    </div>
  );
}
