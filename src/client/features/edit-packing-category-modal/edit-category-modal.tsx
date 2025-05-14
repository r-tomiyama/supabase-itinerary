"use client";

import { useState } from "react";

import { updatePackingCategory } from "@/client/actions/updatePackingCategory";
import { SubmitButton } from "@/client/components/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

interface EditCategoryModalProps {
  tripId: string;
  category: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditCategoryModal({
  tripId,
  category,
  onClose,
  onSuccess,
}: EditCategoryModalProps) {
  const [newCategory, setNewCategory] = useState(category);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 「未分類」カテゴリは編集できないようにする
    if (category === "未分類") {
      setError("「未分類」カテゴリは変更できません");
      return;
    }

    if (!newCategory.trim()) {
      setError("カテゴリ名を入力してください");
      return;
    }

    // 新しいカテゴリ名が「未分類」の場合はエラー
    if (newCategory.trim() === "未分類") {
      setError("「未分類」は予約されたカテゴリ名のため使用できません");
      return;
    }

    if (newCategory.trim() === category) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await updatePackingCategory(
        tripId,
        category,
        newCategory.trim(),
      );

      if (!result.success) {
        setError(result.error || "カテゴリの更新に失敗しました");
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        // 成功時はページをリロード
        window.location.reload();
      }
    } catch (err) {
      console.error("カテゴリ更新エラー:", err);
      setError("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">カテゴリ名の変更</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit(e);
          }}
        >
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="mb-4">
            <Label htmlFor="current-category">現在のカテゴリ名</Label>
            <Input
              id="current-category"
              value={category}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="new-category">新しいカテゴリ名</Label>
            <Input
              id="new-category"
              value={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value);
              }}
              placeholder="新しいカテゴリ名を入力"
              required
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <SubmitButton disabled={isSubmitting}>
              {isSubmitting ? "更新中..." : "更新する"}
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
