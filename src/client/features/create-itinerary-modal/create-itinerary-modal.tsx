"use client";

import { useRouter } from "next/navigation";

import { Modal } from "@/client/components/modal";
import type { Itinerary } from "@/app/protected/trips/[id]/_parts/itinerary-list";

import { ItineraryForm } from "./_parts/itinerary-form";

interface CreateItineraryModalProps {
  tripId: string;
  tripDaysArray: {
    index: number;
    date: Date;
  }[];
  itineraryToEdit?: Itinerary | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateItineraryModal({
  tripId,
  tripDaysArray,
  itineraryToEdit,
  isOpen,
  onClose,
}: CreateItineraryModalProps) {
  const router = useRouter();

  const handleSuccess = () => {
    onClose();
    router.refresh();
  };

  const modalTitle = itineraryToEdit ? "旅程を編集" : "旅程を追加";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <ItineraryForm
        tripId={tripId}
        tripDaysArray={tripDaysArray}
        itineraryToEdit={itineraryToEdit}
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  );
}
