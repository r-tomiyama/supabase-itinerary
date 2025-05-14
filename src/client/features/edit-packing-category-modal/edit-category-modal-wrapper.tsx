"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { EditCategoryModal } from "./edit-category-modal";

interface EditCategoryModalWrapperProps {
  tripId: string;
  category: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EditCategoryModalWrapper({
  tripId,
  category,
  isOpen,
  onClose,
}: EditCategoryModalWrapperProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const handleSuccess = () => {
    router.refresh();
    onClose();
  };

  if (!isMounted || !isOpen) {
    return null;
  }

  return (
    <EditCategoryModal
      tripId={tripId}
      category={category}
      onClose={onClose}
      onSuccess={handleSuccess}
    />
  );
}
