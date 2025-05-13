import { CalendarIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@libs/utils";

interface TripHeroProps {
  trip: {
    title: string;
    start_date: string;
    end_date: string;
    description?: string | null;
  };
  tripDays: number;
}

export default function TripHero({ trip, tripDays }: TripHeroProps) {
  return (
    <div>
      {/* ヒーローセクション */}
      <div className="relative h-64 overflow-hidden rounded-lg bg-gray-200">
        {/* 背景画像をここに配置できます */}
        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-6">
          <h1 className="text-3xl font-bold text-white">{trip.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-white/80">
            <div className="flex items-center gap-1">
              <CalendarIcon size={16} />
              <span>
                {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
              </span>
            </div>
            <Badge>{tripDays}日間</Badge>
          </div>
        </div>
      </div>

      {/* 旅行の説明 */}
      {trip.description && (
        <div className="mt-2">
          <p className="text-gray-700">{trip.description}</p>
        </div>
      )}
    </div>
  );
}
