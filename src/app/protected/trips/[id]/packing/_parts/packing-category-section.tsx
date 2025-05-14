"use client";

import { PencilIcon, TrashIcon } from "lucide-react";
import { useState, useMemo } from "react";

import { deletePackingItem } from "@/client/actions/deletePackingItem";
import { togglePackingItemPacked } from "@/client/actions/updatePackingItem";
import { PackingItemModalWrapper } from "@/client/features/create-packing-item-modal/packing-item-modal-wrapper";

import { FilterOptions } from "./packing-category-filter";

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

interface PackingCategorySectionProps {
  category: string;
  items: PackingItem[];
  tripMembers: TripMember[];
  tripId: string;
  filters: FilterOptions;
}

export function PackingCategorySection({
  category,
  items,
  tripMembers,
  tripId,
  filters,
}: PackingCategorySectionProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<PackingItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // フィルター条件に基づいてアイテムをフィルタリング
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // カテゴリフィルター
      if (filters.category !== null && item.category !== filters.category) {
        return false;
      }

      // 担当者フィルター
      if (filters.assignedTo !== null) {
        if (filters.assignedTo === "unassigned") {
          if (item.assigned_to !== null) {
            return false;
          }
        } else if (item.assigned_to !== filters.assignedTo) {
          return false;
        }
      }

      // パッキング状態フィルター
      if (filters.isPacked !== null && item.is_packed !== filters.isPacked) {
        return false;
      }

      return true;
    });
  }, [items, filters]);

  // フィルター後のアイテムが0件の場合は何も表示しない
  if (filteredItems.length === 0) {
    return null;
  }

  const handleTogglePacked = async (itemId: string, isPacked: boolean) => {
    await togglePackingItemPacked(itemId, isPacked);
    // ページをリフレッシュ
    window.location.reload();
  };

  const handleDelete = async (itemId: string) => {
    if (confirm("この持ち物を削除してもよろしいですか？")) {
      setIsDeleting(itemId);
      try {
        await deletePackingItem(itemId);
        // ページをリフレッシュ
        window.location.reload();
      } catch (error) {
        console.error("削除エラー:", error);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleEdit = (item: PackingItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <h3 className="mb-4 text-lg font-semibold">{category}</h3>
      <div className="space-y-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex size-5 cursor-pointer items-center justify-center rounded border ${
                  item.is_packed
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-300"
                }`}
                onClick={() => {
                  void handleTogglePacked(item.id, !item.is_packed);
                }}
              >
                {item.is_packed && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-3 text-teal-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium">{item.name}</p>
                {item.quantity > 1 && (
                  <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* 担当者表示 */}
              {item.assigned_to && item.profiles ? (
                <div className="flex items-center gap-1">
                  <div className="flex size-6 items-center justify-center rounded-full bg-gray-200 text-xs">
                    {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                    {item.profiles?.display_name?.charAt(0) || "?"}
                  </div>
                  <span className="text-sm">
                    {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                    {item.profiles?.display_name}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-400">未割り当て</span>
              )}

              {/* 編集・削除ボタン */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    handleEdit(item);
                  }}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  title="編集"
                  aria-label="持ち物を編集"
                  disabled={!!isDeleting}
                >
                  <PencilIcon size={16} />
                </button>
                <button
                  onClick={() => {
                    void handleDelete(item.id);
                  }}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                  title="削除"
                  aria-label="持ち物を削除"
                  disabled={isDeleting === item.id}
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>

            {/* 編集モーダル */}
            {isModalOpen && editingItem?.id === item.id && (
              <PackingItemModalWrapper
                tripId={tripId}
                tripMembers={tripMembers}
                itemToEdit={editingItem}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
