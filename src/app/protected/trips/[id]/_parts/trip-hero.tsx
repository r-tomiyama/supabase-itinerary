import { CalendarIcon, PencilIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DeleteTripButton } from "@/client/features/delete-trip-modal/_parts/delete-trip-button";
import { ShareTripButton } from "@/client/features/share-trip-modal/_parts/share-trip-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@libs/utils";

interface TripHeroProps {
  trip: {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    description?: string | null;
    image_url?: string | null;
  };
  tripDays: number;
  membership?: {
    role: "owner" | "editor" | "viewer";
  };
}

export default function TripHero({
  trip,
  tripDays,
  membership,
}: TripHeroProps) {
  const isOwner = membership?.role === "owner";

  return (
    <div>
      {/* ヒーローセクション */}
      <div className="relative h-64 overflow-hidden rounded-lg bg-gray-200">
        {/* 背景画像 */}
        {trip.image_url ? (
          <Image
            src={trip.image_url}
            alt={trip.title}
            fill
            className="object-cover"
            priority
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">{trip.title}</h1>
            <div className="flex items-center gap-2">
              {isOwner && (
                <Link href={`/protected/trips/${trip.id}/edit`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 bg-white/10 text-white hover:bg-white/20"
                  >
                    <PencilIcon size={16} />
                    編集
                  </Button>
                </Link>
              )}
              <DeleteTripButton
                tripId={trip.id}
                tripTitle={trip.title}
                isOwner={isOwner}
              />
              <ShareTripButton tripId={trip.id} isOwner={isOwner} />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-3 text-white/80">
            <div className="flex items-center gap-1">
              <CalendarIcon size={16} />
              <span>
                {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
              </span>
            </div>
            <Badge>{tripDays}日間</Badge>
          </div>

          {trip.description && (
            <div className="mt-2 text-sm text-white">{trip.description}</div>
          )}
        </div>
      </div>
    </div>
  );
}
