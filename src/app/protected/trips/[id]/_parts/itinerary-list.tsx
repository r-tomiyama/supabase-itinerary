import { ClockIcon, MapPinIcon } from "lucide-react";
import dayjs from "dayjs"; // dayjs をインポート

import { formatDate, formatTime } from "@libs/utils";

import { ItineraryModalWrapper } from "../../../../../client/features/create-itinerary-modal/itinerary-modal-wrapper";

interface Itinerary {
  id: string;
  order_in_day: number;
  place_name: string;
  address?: string | null;
  planned_arrival?: string | null;
  actual_arrival?: string | null;
  stay_duration?: string | null;
  planned_budget?: number | null;
  actual_cost?: number | null;
}

interface ItineraryListProps {
  trip: {
    id: string;
    start_date: string;
  };
  groupedItineraries: Record<number, Itinerary[]> | null | undefined;
  tripDaysArray: {
    index: number;
    date: string;
  }[];
}

export default function ItineraryList({
  trip,
  groupedItineraries,
  tripDaysArray,
}: ItineraryListProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">旅程</h2>
        <ItineraryModalWrapper tripId={trip.id} tripDaysArray={tripDaysArray} />
      </div>

      {groupedItineraries &&
        Object.entries(groupedItineraries).map(([dayIndex, dayItems]) => {
          const dayDate = new Date(trip.start_date);
          dayDate.setDate(dayDate.getDate() + parseInt(dayIndex));

          return (
            <div key={dayIndex} className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <span className="rounded bg-primary px-2 py-1 text-sm text-white">
                  Day {parseInt(dayIndex) + 1}
                </span>
                <span>{formatDate(dayDate.toISOString())}</span>
              </h3>

              <div className="overflow-hidden rounded-lg border">
                {dayItems.map((item, i) => (
                  <div
                    key={item.id}
                    className={`p-4 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <div className="flex size-8 items-center justify-center rounded-full bg-primary font-medium text-white">
                            {item.order_in_day + 1}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold">
                            {item.place_name}
                          </h4>
                          {item.address && (
                            <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                              <MapPinIcon size={14} />
                              <span>{item.address}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        {item.planned_arrival && (
                          <div className="flex items-center gap-1 text-sm">
                            <ClockIcon size={14} />
                            <div className="flex flex-col">
                              <span>
                                予定: {formatTime(item.planned_arrival)}
                              </span>
                              {item.actual_arrival && (
                                <span
                                  className={
                                    item.actual_arrival &&
                                    item.planned_arrival &&
                                    new Date(item.actual_arrival) >
                                      new Date(item.planned_arrival)
                                      ? "text-orange-500"
                                      : ""
                                  }
                                >
                                  実際: {formatTime(item.actual_arrival)}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {item.stay_duration && (
                          <div className="text-sm text-gray-600">
                            滞在時間: {item.stay_duration}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        {item.planned_budget !== null && (
                          <div className="text-sm">
                            予算: ¥{item.planned_budget?.toLocaleString()}
                          </div>
                        )}
                        {item.actual_cost !== null && (
                          <div
                            className={`text-sm ${(item.actual_cost ?? 0) > (item.planned_budget ?? 0) ? "text-red-500" : ""}`}
                          >
                            実費: ¥{item.actual_cost?.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

      {(!groupedItineraries ||
        Object.keys(groupedItineraries).length === 0) && (
        <div className="rounded-lg border py-12 text-center">
          <p className="mb-2">この旅行にはまだ旅程が追加されていません</p>
          <div className="flex justify-center">
            <ItineraryModalWrapper
              tripId={trip.id}
              tripDaysArray={tripDaysArray}
            />
          </div>
        </div>
      )}
    </div>
  );
}
