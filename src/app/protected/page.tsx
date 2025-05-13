import { createClient } from "@/services/supabase/server";
import { PlusIcon, CalendarIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@libs/utils";
import { getSignedUser } from "@/services/user/getSignedUser";

export default async function TripsPage() {
  const { user } = await getSignedUser();
  const supabase = await createClient();
  
  // ユーザーが参加しているトリップを取得
  const { data: tripMembers } = await supabase
    .from('trip_members')
    .select('trip_id, role')
    .eq('user_id', user.id);
    
  // トリップの詳細情報を取得
  const tripIds = tripMembers?.map(member => member.trip_id) || [];
  const { data: trips } = await supabase
    .from('trips')
    .select('*')
    .in('id', tripIds.length > 0 ? tripIds : ['']);

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="flex justify-between items-center flex-wrap w-full" style={{ rowGap: "20px" }}>
        <div className="min-w-[70%]">
          <h1 className="font-bold text-3xl">あなたの旅行</h1>
        </div>
        <Link href="/protected/trips/create">
          <Button className="flex items-center gap-2">
        <PlusIcon size={18} />
        新しい旅行を計画する
          </Button>
        </Link>
      </div>
      
      {trips && trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Link href={`/protected/trips/${trip.id}`} key={trip.id}>
              <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-200 relative">
                  {/* ここには画像を配置するといいでしょう */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3">
                    <h3 className="font-bold text-xl">{trip.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <CalendarIcon size={16} className="mr-2" />
                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                  </div>
                  <p className="text-sm line-clamp-2 text-gray-600">
                    {trip.description || ""}
                  </p>
                  {(
                    <div className="mt-3 text-sm font-medium">
                      予算: {trip.budget_total && trip.budget_total.toLocaleString()}円
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-xl mb-4">旅行の計画がまだありません</p>
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
