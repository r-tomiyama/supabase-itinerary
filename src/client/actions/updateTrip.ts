import { Database } from "@libs/supabase.types";
import { createClient } from "@services/supabase/client";

export interface TripFormData {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  budget_total: number;
}

interface UpdateTripResult {
  trip: Database["public"]["Tables"]["trips"]["Row"] | null;
  error: string | null;
}

/**
 * 旅行を更新する
 * @param formData 旅行のフォームデータ
 * @returns 更新された旅行と発生したエラー
 */
export async function updateTrip(
  formData: TripFormData,
): Promise<UpdateTripResult> {
  const supabase = createClient();

  try {
    // 日付の検証
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (endDate < startDate) {
      return {
        trip: null,
        error: "終了日は開始日より後にしてください",
      };
    }

    // トリップを更新
    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .update({
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date,
        budget_total: formData.budget_total,
      })
      .eq("id", formData.id)
      .select()
      .single();

    if (tripError) {
      return {
        trip: null,
        error: tripError.message ? tripError.message : "旅行の更新に失敗しました",
      };
    }

    return {
      trip,
      error: null,
    };
  } catch (err: unknown) {
    const error =
      err instanceof Error ? err : new Error("不明なエラーが発生しました");
    return {
      trip: null,
      error: error.message,
    };
  }
}