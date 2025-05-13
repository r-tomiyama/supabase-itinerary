"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignedUser } from "@/client/hooks/useSignedUser";
import { Modal } from "@/client/components/modal";
import { ItineraryFormData, createItinerary } from "@/client/actions/createItinerary";
import { CreateItineraryModalTrigger } from "./_parts/create-itinerary-modal-trigger";
import { ItineraryForm } from "./_parts/itinerary-form";

interface CreateItineraryModalProps {
  tripId: string;
  tripDaysArray: {
    index: number;
    date: Date;
  }[];
}

export function CreateItineraryModal({ tripId, tripDaysArray }: CreateItineraryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user } = useSignedUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ItineraryFormData>({
    trip_id: tripId,
    day_index: tripDaysArray.length > 0 ? tripDaysArray[0].index : 0,
    place_name: "",
    address: "",
    planned_arrival: "",
    stay_duration: "",
    planned_budget: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "day_index"
        ? parseInt(value)
        : name === "planned_budget"
          ? value ? parseInt(value) : undefined
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 旅程を作成
      const { itinerary, error } = await createItinerary(formData, user.id);
      
      if (error || !itinerary) {
        throw new Error(error || "旅程の追加に失敗しました");
      }

      // 成功したらモーダルを閉じてページを更新
      setIsOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      setError(err.message || "旅程の追加中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      trip_id: tripId,
      day_index: tripDaysArray.length > 0 ? tripDaysArray[0].index : 0,
      place_name: "",
      address: "",
      planned_arrival: "",
      stay_duration: "",
      planned_budget: 0
    });
    setError(null);
  };

  const openModal = () => {
    resetForm();
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
          userId={user?.id}
        />
      </Modal>
    </>
  );
}
