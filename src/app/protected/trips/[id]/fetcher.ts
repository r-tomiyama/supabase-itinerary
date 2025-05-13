import { createClient } from "@/services/supabase/server";
import { getSignedUser } from "@/services/user/getSignedUser";

export const fetcher = async (tripId: string) => {
    const supabase = await createClient();
    const { user } = await getSignedUser();

    const { data: trip } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    const { data: membership } = await supabase
      .from('trip_members')
      .select('*')
      .eq('trip_id', tripId)
      .eq('user_id', user.id)
      .single();

    const { data: itineraries } = await supabase
      .from('itineraries')
      .select('*')
      .eq('trip_id', tripId)
      .order('day_index', { ascending: true })
      .order('order_in_day', { ascending: true });

    // 日付ごとにグループ化
    const groupedItineraries = itineraries?.reduce((acc, item) => {
      if (!acc[item.day_index]) {
        acc[item.day_index] = [];
      }
      acc[item.day_index].push(item);
      return acc;
    }, {} as Record<number, typeof itineraries>);
    
    // 実際にかかった費用の合計を計算
    const totalActualCost = itineraries?.reduce((sum, item) => {
      return sum + (item.actual_cost || 0);
    }, 0);
    
    // 旅行の日数を計算
    const tripDays = trip ? Math.ceil(
      (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 3600 * 24)
    ) + 1 : 0;
    
    // 日付の配列を生成
    const tripDaysArray = trip ? Array.from({ length: tripDays }, (_, i) => {
      const day = new Date(trip.start_date);
      day.setDate(day.getDate() + i);
      return {
        index: i,
        date: day.toISOString()
      };
    }) : [];

    return {
      trip,
      membership,
      itineraries,
      groupedItineraries,
      totalActualCost,
      tripDays,
      tripDaysArray
    }
}
