import { createClient } from "@/services/supabase/client";

interface UpdateActualDataParams {
  id: string;
  actual_arrival?: string | null;
  actual_cost?: number | null;
}

interface UpdateActualDataResult {
  success: boolean;
  error: string | null;
}

/**
 * 旅程のactual_arrivalとactual_costを更新する
 * @param params 更新パラメータ
 * @returns 更新結果
 */
export async function updateActualData(
  params: UpdateActualDataParams,
): Promise<UpdateActualDataResult> {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("itineraries")
      .update({
        actual_arrival: params.actual_arrival,
        actual_cost: params.actual_cost,
      })
      .eq("id", params.id);

    if (error) {
      console.error("Error updating actual data:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (err) {
    console.error("Exception updating actual data:", err);
    return {
      success: false,
      error: "データの更新に失敗しました",
    };
  }
}
