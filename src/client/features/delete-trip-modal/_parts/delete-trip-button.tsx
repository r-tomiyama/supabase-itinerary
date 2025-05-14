"use client";

import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteTrip } from "@/client/actions/deleteTrip";
import { Modal } from "@/client/components/modal";
import { useSignedUser } from "@/client/hooks/useSignedUser";
import { Button } from "@/components/ui/button";

interface DeleteTripButtonProps {
  tripId: string;
  tripTitle: string;
  isOwner: boolean;
}

export function DeleteTripButton({
  tripId,
  tripTitle,
  isOwner,
}: DeleteTripButtonProps) {
  const router = useRouter();
  const { user } = useSignedUser();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // オーナーでない場合はボタンを表示しない
  if (!isOwner) {
    return null;
  }

  const handleDelete = async () => {
    if (!user?.id) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const result = await deleteTrip(tripId, user.id);

      if (result.success) {
        router.push("/protected");
        router.refresh();
      } else {
        setDeleteError(result.error || "削除中にエラーが発生しました");
      }
    } catch (error) {
      setDeleteError("削除処理中に予期せぬエラーが発生しました");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setIsDeleteModalOpen(true);
        }}
        className="flex items-center gap-1 bg-red-500/20 text-white hover:bg-red-500/40"
      >
        <TrashIcon size={16} />
        削除
      </Button>

      {/* 削除確認モーダル */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
          title="旅行プランの削除"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              この旅行プラン「{tripTitle}」を削除してもよろしいですか？
              <br />
              この操作は元に戻すことができません。すべての旅程情報も削除されます。
            </p>

            {deleteError && (
              <div className="rounded-md bg-red-50 p-3">
                <div className="text-sm text-red-700">{deleteError}</div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                }}
                disabled={isDeleting}
              >
                キャンセル
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "削除中..." : "削除する"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
