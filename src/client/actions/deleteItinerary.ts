import { createClient } from "@services/supabase/client";

interface DeleteItineraryResult {
  success: boolean;
  error: string | null;
}

/**
 * 旅程を削除する
 * @param itineraryId 削除する旅程のID
 * @returns 削除の成功/失敗と発生したエラー
 */
export async function deleteItinerary(
  itineraryId: string,
): Promise<DeleteItineraryResult> {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("itineraries")
      .delete()
      .eq("id", itineraryId);

    if (error) {
      return {
        success: false,
        error: `旅程の削除に失敗しました: ${error.message}`,
      };
    }

    return { success: true, error: null };
  } catch (err) {
    const error =
      err instanceof Error ? err : new Error("不明なエラーが発生しました");
    return {
      success: false,
      error: `旅程の削除中に予期せぬエラーが発生しました: ${error.message}`,
    };
  }
}
