"use client";

import { CreateItineraryModal } from "./create-itinerary-modal";

interface ItineraryModalWrapperProps {
  tripId: string;
  tripDaysArray: {
    index: number;
    date: string;
  }[];
}

export function ItineraryModalWrapper({ tripId, tripDaysArray }: ItineraryModalWrapperProps) {
  // 文字列の日付をDateオブジェクトに変換
  const formattedTripDaysArray = tripDaysArray.map(day => ({
    index: day.index,
    date: new Date(day.date)
  }));

  return <CreateItineraryModal tripId={tripId} tripDaysArray={formattedTripDaysArray} />;
}
