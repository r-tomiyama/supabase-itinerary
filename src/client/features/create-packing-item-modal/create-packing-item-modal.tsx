"use client";

import { Modal } from "@/client/components/modal";
import { PackingItemForm } from "./_parts/packing-item-form";

interface CreatePackingItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripMembers: any[];
  itemToEdit?: any;
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
