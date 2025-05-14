"use client";

import { Modal } from "@/client/components/modal";

import { PackingItemForm } from "./_parts/packing-item-form";

// 型定義
interface PackingItem {
  id: string;
  name: string;
  quantity: number;
  category: string | null;
  category_color?: string | null;
  assigned_to: string | null;
  is_packed: boolean;
  notes?: string | null;
}

interface TripMember {
  user_id: string;
  profiles?: {
    display_name: string | null;
  } | null;
  packing_items?: PackingItem[];
}

interface CreatePackingItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripMembers: TripMember[];
  itemToEdit?: PackingItem;
}

export function CreatePackingItemModal({
  isOpen,
  onClose,
  tripId,
  tripMembers,
  itemToEdit,
}: CreatePackingItemModalProps) {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? "持ち物を編集" : "持ち物を追加"}
    >
      <PackingItemForm
        tripId={tripId}
        tripMembers={tripMembers}
        itemToEdit={itemToEdit}
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  );
}
