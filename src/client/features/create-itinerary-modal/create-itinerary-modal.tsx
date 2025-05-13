"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Modal } from "@/client/components/modal";

import { CreateItineraryModalTrigger } from "./_parts/create-itinerary-modal-trigger";
import { ItineraryForm } from "./_parts/itinerary-form";

interface CreateItineraryModalProps {
  tripId: string;
  tripDaysArray: {
    index: number;
    date: Date;
  }[];
}

export function CreateItineraryModal({
  tripId,
  tripDaysArray,
}: CreateItineraryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSuccess = () => {
    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <CreateItineraryModalTrigger onClick={openModal} />

      <Modal isOpen={isOpen} onClose={closeModal} title="旅程を追加">
        <ItineraryForm
          tripId={tripId}
          tripDaysArray={tripDaysArray}
          onSuccess={handleSuccess}
          onCancel={closeModal}
        />
      </Modal>
    </>
  );
}
