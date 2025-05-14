import { PlusIcon, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/services/supabase/server";
import { getSignedUser } from "@/services/user/getSignedUser";
import { formatDate } from "@libs/utils";

export default async function TripsPage() {
  const { user } = await getSignedUser();
  const supabase = await createClient();

  // ユーザーが参加しているトリップを取得
  const { data: tripMembers } = await supabase
    .from("trip_members")
    .select("trip_id, role")
    .eq("user_id", user.id);

  // トリップの詳細情報を取得
  const tripIds = tripMembers?.map((member) => member.trip_id) ?? [];
  const { data: trips } = await supabase
    .from("trips")
    .select("*")
    .in("id", tripIds.length > 0 ? tripIds : [""]);

  return (
    <div className="flex w-full flex-1 flex-col gap-8">
      <div
        className="flex w-full flex-wrap items-center justify-between"
        style={{ rowGap: "20px" }}
      >
        <div className="min-w-[70%]">
          <h1 className="text-3xl font-bold">あなたの旅行</h1>
        </div>
        <Link href="/protected/trips/create">
          <Button className="flex items-center gap-2">
            <PlusIcon size={18} />
            新しい旅行を計画する
          </Button>
        </Link>
      </div>

      {trips && trips.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Link href={`/protected/trips/${trip.id}`} key={trip.id}>
              <div className="overflow-hidden rounded-lg border transition-shadow hover:shadow-md">
                <div className="relative h-40 bg-gray-200">
                  {/* ここには画像を配置するといいでしょう */}
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 p-3 text-white">
                    <h3 className="text-xl font-bold">{trip.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center text-sm text-gray-600">
                    <CalendarIcon size={16} className="mr-2" />
                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                  </div>
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {trip.description ?? ""}
                  </p>
                  <div className="mt-3 text-sm font-medium">
                    予算: {trip.budget_total?.toLocaleString()}円
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border py-12 text-center">
          <p className="mb-4 text-xl">旅行の計画がまだありません</p>
          <Link href="/protected/trips/create">
            <Button className="flex items-center gap-2">
              <PlusIcon size={18} />
              最初の旅行を計画する
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
