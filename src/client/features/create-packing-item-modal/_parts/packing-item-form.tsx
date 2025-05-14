"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select } from "@/ui/select";
import { SubmitButton } from "@/client/components/submit-button";

import { createPackingItem, PackingItemFormData } from "@/client/actions/createPackingItem";
import { updatePackingItem } from "@/client/actions/updatePackingItem";

interface PackingItemFormProps {
  tripId: string;
  tripMembers: any[];
  itemToEdit?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PackingItemForm({
  tripId,
  tripMembers,
  itemToEdit,
  onSuccess,
  onCancel,
}: PackingItemFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PackingItemFormData>({
    name: itemToEdit?.name || "",
    quantity: itemToEdit?.quantity || 1,
    category: itemToEdit?.category || null,
    category_color: itemToEdit?.category_color || null,
    assigned_to: itemToEdit?.assigned_to || null,
    notes: itemToEdit?.notes || null,
  });

  // 既存のカテゴリを取得（重複なし）
  const existingCategories = Array.from(
    new Set(tripMembers.flatMap((member) => member.packing_items?.map((item: any) => item.category) || []).filter(Boolean))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (itemToEdit) {
        // 既存アイテムの更新
        const result = await updatePackingItem(itemToEdit.id, formData);
        if (!result.success) {
          setError(result.error || "更新に失敗しました");
          return;
        }
      } else {
        // 新規アイテムの作成
        const result = await createPackingItem(formData, tripId);
        if (result.error) {
          setError(result.error);
          return;
        }
      }

      // 成功時の処理
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError("エラーが発生しました");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="name">アイテム名 *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="quantity">数量</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
          }
        />
      </div>

      <div>
        <Label htmlFor="category">カテゴリ</Label>
        <Input
          id="category"
          list="categories"
          value={formData.category || ""}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value || null })
          }
          placeholder="カテゴリを入力または選択"
        />
        <datalist id="categories">
          {existingCategories.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
      </div>

      <div>
        <Label htmlFor="assigned_to">担当者</Label>
        <Select
          value={formData.assigned_to || ""}
          onChange={(e) =>
            setFormData({ ...formData, assigned_to: e.target.value || null })
          }
          options={[
            { value: "", label: "未割り当て" },
            ...tripMembers.map((member) => ({
              value: member.user_id,
              label: member.profiles?.display_name || "不明なユーザー"
            }))
          ]}
        />
      </div>

      <div>
        <Label htmlFor="notes">メモ</Label>
        <Input
          id="notes"
          value={formData.notes || ""}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value || null })
          }
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
        <SubmitButton>
          {itemToEdit ? "更新する" : "追加する"}
        </SubmitButton>
      </div>
    </form>
  );
}
