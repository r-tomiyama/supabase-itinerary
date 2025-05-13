import { formatDate, formatTime } from "@libs/utils";
import { ClockIcon, MapPinIcon } from "lucide-react";
import { ItineraryModalWrapper } from "../../../../../client/features/create-itinerary-modal/itinerary-modal-wrapper";

interface ItineraryListProps {
  trip: {
    id: string;
    start_date: string;
  };
  groupedItineraries: Record<number, any[]> | null | undefined;
  tripDaysArray: {
    index: number;
    date: string;
  }[];
}

export default function ItineraryList({ trip, groupedItineraries, tripDaysArray }: ItineraryListProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">旅程</h2>
        <ItineraryModalWrapper tripId={trip.id} tripDaysArray={tripDaysArray} />
      </div>
      
      {groupedItineraries && Object.entries(groupedItineraries).map(([dayIndex, dayItems]) => {
        const dayDate = new Date(trip.start_date);
        dayDate.setDate(dayDate.getDate() + parseInt(dayIndex));
        
        return (
          <div key={dayIndex} className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="bg-primary text-white px-2 py-1 rounded text-sm">Day {parseInt(dayIndex) + 1}</span>
              <span>{formatDate(dayDate.toISOString())}</span>
            </h3>
            
            <div className="border rounded-lg overflow-hidden">
              {dayItems.map((item, i) => (
                <div key={item.id} className={`p-4 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                          {item.order_in_day + 1}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{item.place_name}</h4>
                        {item.address && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
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
                            <span>予定: {formatTime(item.planned_arrival)}</span>
                            {item.actual_arrival && (
                              <span className={`${new Date(item.actual_arrival) > new Date(item.planned_arrival) ? 'text-orange-500' : ''}`}>
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
                          予算: ¥{item.planned_budget.toLocaleString()}
                        </div>
                      )}
                      {item.actual_cost !== null && (
                        <div className={`text-sm ${item.actual_cost > (item.planned_budget || 0) ? 'text-red-500' : ''}`}>
                          実費: ¥{item.actual_cost.toLocaleString()}
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
      
      {(!groupedItineraries || Object.keys(groupedItineraries).length === 0) && (
        <div className="text-center py-12 border rounded-lg">
          <p className="mb-2">この旅行にはまだ旅程が追加されていません</p>
          <div className="flex justify-center">
            <ItineraryModalWrapper tripId={trip.id} tripDaysArray={tripDaysArray} />
          </div>
        </div>
      )}
    </div>
  );
}
