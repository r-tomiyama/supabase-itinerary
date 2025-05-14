import { Database } from "@libs/supabase.types";
import { createClient } from "@services/supabase/client";

export interface ItineraryFormData {
  id: string; // 更新対象のIDを追加
  trip_id: string;
  day_index: number;
  place_name: string;
  address?: string;
  planned_arrival?: string;
  stay_duration?: string;
  move_duration?: string;
  planned_budget?: number;
}

interface UpdateItineraryResult {
  itinerary: Database["public"]["Tables"]["itineraries"]["Row"] | null;
  error: string | null;
}

/**
 * 旅程を更新する
 * @param formData 旅程のフォームデータ
 * @returns 更新された旅程と発生したエラー
 */
export async function updateItinerary(
  formData: ItineraryFormData,
): Promise<UpdateItineraryResult> {
  const supabase = createClient();

  try {
    const { data: itinerary, error } = await supabase
      .from("itineraries")
      .update({
        trip_id: formData.trip_id,
        day_index: formData.day_index,
        place_name: formData.place_name,
        address: formData.address ?? null,
        planned_arrival: formData.planned_arrival ?? null,
        stay_duration: formData.stay_duration || null,
        move_duration: formData.move_duration || null,
        planned_budget: formData.planned_budget ?? null,
      })
      .eq("id", formData.id)
      .select()
      .single();

    if (error) {
      return {
        itinerary: null,
        error: `旅程の更新に失敗しました: ${error.message}`,
      };
    }

    return { itinerary, error: null };
  } catch (err) {
    const error =
      err instanceof Error ? err : new Error("不明なエラーが発生しました");
    return {
      itinerary: null,
      error: `旅程の更新中に予期せぬエラーが発生しました: ${error.message}`,
    };
  }
}
