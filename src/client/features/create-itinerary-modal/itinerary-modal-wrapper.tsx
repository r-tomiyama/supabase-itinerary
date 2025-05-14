"use client";

import { CreateItineraryModal } from "./create-itinerary-modal";
import type { Itinerary } from "@/app/protected/trips/[id]/_parts/itinerary-list"; // Itinerary 型をインポート

interface ItineraryModalWrapperProps {
  tripId: string;
  tripDaysArray: {
    index: number;
    date: string;
  }[];
  itineraryToEdit?: Itinerary | null; // 編集対象の旅程データ
  isOpen: boolean; // モーダルの表示状態
  onClose: () => void; // モーダルを閉じる関数
}

export function ItineraryModalWrapper({
  tripId,
  tripDaysArray,
  itineraryToEdit,
  isOpen,
  onClose,
}: ItineraryModalWrapperProps) {
  // 文字列の日付をDateオブジェクトに変換
  const formattedTripDaysArray = tripDaysArray.map((day) => ({
    index: day.index,
    date: new Date(day.date),
  }));

  return (
    <CreateItineraryModal
      tripId={tripId}
      tripDaysArray={formattedTripDaysArray}
      itineraryToEdit={itineraryToEdit}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}
