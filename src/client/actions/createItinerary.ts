import { createClient } from "@services/supabase/client";
import { Database } from "@libs/supabase.types";


export type ItineraryFormData = {
  trip_id: string;
  day_index: number;
  place_name: string;
  address?: string;
  planned_arrival?: string;
  stay_duration?: string;
  planned_budget?: number;
};

type CreateItineraryResult = {
  itinerary: Database["public"]["Tables"]["itineraries"]["Row"] | null;
  error: string | null;
};

/**
 * 旅程を作成する
 * @param formData 旅程のフォームデータ
 * @param userId ユーザーID
 * @returns 作成された旅程と発生したエラー
 */
export async function createItinerary(
  formData: ItineraryFormData,
  userId: string
): Promise<CreateItineraryResult> {
  const supabase = createClient();

  try {
    // 該当日の旅程の順序を取得
    const { data: existingItineraries } = await supabase
      .from('itineraries')
      .select('order_in_day')
      .eq('trip_id', formData.trip_id)
      .eq('day_index', formData.day_index)
      .order('order_in_day', { ascending: false })
      .limit(1);
    
    const orderInDay = existingItineraries && existingItineraries.length > 0
      ? existingItineraries[0].order_in_day + 1
      : 0;
    
    // 旅程の追加
    const { data: itinerary, error } = await supabase
      .from('itineraries')
      .insert({
        trip_id: formData.trip_id,
        day_index: formData.day_index,
        order_in_day: orderInDay,
        place_name: formData.place_name,
        address: formData.address || null,
        planned_arrival: formData.planned_arrival || null,
        stay_duration: formData.stay_duration || null,
        planned_budget: formData.planned_budget || null,
        actual_cost: null,
        actual_arrival: null,
      })
      .select()
      .single();
    
    if (error) {
      return {
        itinerary: null,
        error: error.message || "旅程の追加に失敗しました"
      };
    }


    
    return {
      itinerary,
      error: null
    };
  } catch (err: any) {
    return {
      itinerary: null,
      error: err.message || "旅程の追加中にエラーが発生しました"
    };
  }
}
