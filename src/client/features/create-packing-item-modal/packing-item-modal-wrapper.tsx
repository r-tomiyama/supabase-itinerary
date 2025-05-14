"use client";

import { useState } from "react";

import { CreatePackingItemModalTrigger } from "./_parts/create-packing-item-modal-trigger";
import { CreatePackingItemModal } from "./create-packing-item-modal";

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

interface PackingItemModalWrapperProps {
  tripId: string;
  tripMembers: TripMember[];
  itemToEdit?: PackingItem;
  isOpen?: boolean;
  onClose?: () => void;
}

export function PackingItemModalWrapper({
  tripId,
  tripMembers,
  itemToEdit,
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}: PackingItemModalWrapperProps) {
  const [isInternalOpen, setIsInternalOpen] = useState(false);

  // 外部から制御されるか、内部で制御するか
  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : isInternalOpen;

  const handleOpen = () => {
    if (!isControlled) {
      setIsInternalOpen(true);
    }
  };

  const handleClose = () => {
    if (!isControlled) {
      setIsInternalOpen(false);
    } else if (externalOnClose) {
      externalOnClose();
    }
  };

  return (
    <>
      {!isControlled && <CreatePackingItemModalTrigger onClick={handleOpen} />}
      <CreatePackingItemModal
        isOpen={isOpen}
        onClose={handleClose}
        tripId={tripId}
        tripMembers={tripMembers}
        itemToEdit={itemToEdit}
      />
    </>
  );
}
