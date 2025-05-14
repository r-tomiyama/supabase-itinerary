import { createClient } from "@/services/supabase/server";
import { getSignedUser } from "@/services/user/getSignedUser";
import dayjs from "dayjs";

export const fetcher = async (tripId: string) => {
  const supabase = await createClient();
  const { user } = await getSignedUser();

  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();

  const { data: membership } = await supabase
    .from("trip_members")
    .select("*")
    .eq("trip_id", tripId)
    .eq("user_id", user.id)
    .single();

  // 旅行メンバー一覧を取得
  const { data: tripMembers } = await supabase
    .from("trip_members")
    .select("*, profiles(id, email, display_name, avatar_url)")
    .eq("trip_id", tripId);

  const { data: itineraries } = await supabase
    .from("itineraries")
    .select("*")
    .eq("trip_id", tripId)
    .order("day_index", { ascending: true })

  // 実際にかかった費用の合計を計算
  const totalActualCost = itineraries?.reduce((sum, item) => {
    return sum + (item.actual_cost ?? 0);
  }, 0);

  // 旅行の日数を計算
  const tripDays = trip
    ? dayjs(trip.end_date).diff(dayjs(trip.start_date), "day") + 1 // dayjs を使用
    : 0;

  // 日付の配列を生成
  const tripDaysArray = trip
    ? Array.from({ length: tripDays }, (_, i) => {
        const day = dayjs(trip.start_date).add(i, "day"); // dayjs を使用
        return {
          index: i,
          date: day.toISOString(),
        };
      })
    : [];

  return {
    trip,
    membership,
    itineraries,
    totalActualCost,
    tripDays,
    tripDaysArray,
    tripMembers, // 追加したtripMembersを返す
  };
};
