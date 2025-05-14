import { Database } from "@libs/supabase.types";
import { createClient } from "@services/supabase/client";

export interface ItineraryFormData {
  trip_id: string;
  day_index: number;
  place_name: string;
  address?: string;
  planned_arrival?: string;
  stay_duration?: string;
  move_duration?: string;
  planned_budget?: number;
}

interface CreateItineraryResult {
  itinerary: Database["public"]["Tables"]["itineraries"]["Row"] | null;
  error: string | null;
}

/**
 * 旅程を作成する
 * @param formData 旅程のフォームデータ
 * @returns 作成された旅程と発生したエラー
 */
export async function createItinerary(
  formData: ItineraryFormData,
): Promise<CreateItineraryResult> {
  const supabase = createClient();

  try {
    // 旅程の追加
    const { data: itinerary, error } = await supabase
      .from("itineraries")
      .insert({
        trip_id: formData.trip_id,
        day_index: formData.day_index,
        place_name: formData.place_name,
        address: formData.address ?? null,
        planned_arrival: formData.planned_arrival ?? null,
        stay_duration: formData.stay_duration ?? null,
        move_duration: formData.move_duration ?? null,
        planned_budget: formData.planned_budget ?? null,
      })
      .select()
      .single();

    if (error) {
      return {
        itinerary: null,
        error: error.message ? error.message : "旅程の追加に失敗しました",
      };
    }

    return {
      itinerary,
      error: null,
    };
  } catch (err: unknown) {
    const error =
      err instanceof Error ? err : new Error("不明なエラーが発生しました");
    return {
      itinerary: null,
      error: error.message
        ? error.message
        : "旅程の追加中にエラーが発生しました",
    };
  }
}
