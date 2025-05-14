import { CalendarIcon, PencilIcon, Users } from "lucide-react";
import Link from "next/link";

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
  };
  tripDays: number;
  membership?: {
    role: "owner" | "editor" | "viewer";
  };
  tripMembers?: Array<{
    id: string;
    trip_id: string;
    user_id: string;
    role: "owner" | "editor" | "viewer";
    created_at: string;
    profiles: {
      id: string;
      email: string;
      display_name: string | null;
      avatar_url: string | null;
    };
  }>;
}

export default function TripHero({
  trip,
  tripDays,
  membership,
  tripMembers,
}: TripHeroProps) {
  const isOwner = membership?.role === "owner";

  return (
    <div>
      {/* ヒーローセクション */}
      <div className="relative h-64 overflow-hidden rounded-lg bg-gray-200">
        {/* 背景画像をここに配置できます */}
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
        </div>
      </div>

      {/* 旅行の説明 */}
      {trip.description && (
        <div className="mt-4">
          <p className="text-gray-700">{trip.description}</p>
        </div>
      )}

      {/* メンバー一覧 */}
      {tripMembers && tripMembers.length > 0 && (
        <div className="mt-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Users size={20} />
            メンバー一覧
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {tripMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                  {member.profiles.avatar_url ? (
                    <img
                      src={member.profiles.avatar_url}
                      alt={member.profiles.display_name || member.profiles.email}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                      {(member.profiles.display_name || member.profiles.email)[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {member.profiles.display_name || member.profiles.email}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.role === "owner" ? "default" : "outline"}>
                      {member.role === "owner"
                        ? "オーナー"
                        : member.role === "editor"
                        ? "編集者"
                        : "閲覧者"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
