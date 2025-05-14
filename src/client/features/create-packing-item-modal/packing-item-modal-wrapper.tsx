"use client";

import { useState } from "react";

import { CreatePackingItemModalTrigger } from "./_parts/create-packing-item-modal-trigger";
import { CreatePackingItemModal } from "./create-packing-item-modal";

interface PackingItemModalWrapperProps {
  tripId: string;
  tripMembers: any[];
  itemToEdit?: any;
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
