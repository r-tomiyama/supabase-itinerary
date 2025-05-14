import { createClient } from "@services/supabase/client";

interface DeleteTripResult {
  success: boolean;
  error: string | null;
}

/**
 * 旅行プランを削除する
 * @param tripId 削除する旅行プランのID
 * @param userId リクエスト元のユーザーID（オーナー権限チェック用）
 * @returns 削除の成功/失敗と発生したエラー
 */
export async function deleteTrip(
  tripId: string,
  userId: string,
): Promise<DeleteTripResult> {
  const supabase = createClient();

  try {
    // 現在のユーザーが旅行のオーナーであることを確認
    const { data: tripMember, error: memberError } = await supabase
      .from("trip_members")
      .select("role")
      .eq("trip_id", tripId)
      .eq("user_id", userId)
      .single();

    if (memberError) {
      return {
        success: false,
        error: "この旅行にアクセスする権限がありません",
      };
    }

    if (tripMember.role !== "owner") {
      return {
        success: false,
        error: "この操作はオーナーのみ実行できます",
      };
    }

    // トランザクションがないため、関連データを順番に削除
    // 1. 旅程データを削除
    const { error: itinerariesError } = await supabase
      .from("itineraries")
      .delete()
      .eq("trip_id", tripId);

    if (itinerariesError) {
      return {
        success: false,
        error: `旅程の削除に失敗しました: ${itinerariesError.message}`,
      };
    }

    // 2. メンバー情報を削除
    const { error: membersError } = await supabase
      .from("trip_members")
      .delete()
      .eq("trip_id", tripId);

    if (membersError) {
      return {
        success: false,
        error: `メンバー情報の削除に失敗しました: ${membersError.message}`,
      };
    }

    // 3. 旅行プラン自体を削除
    const { error: tripError } = await supabase
      .from("trips")
      .delete()
      .eq("id", tripId);

    if (tripError) {
      return {
        success: false,
        error: `旅行プランの削除に失敗しました: ${tripError.message}`,
      };
    }

    return { success: true, error: null };
  } catch (err) {
    const error =
      err instanceof Error ? err : new Error("不明なエラーが発生しました");
    return {
      success: false,
      error: `旅行プランの削除中に予期せぬエラーが発生しました: ${error.message}`,
    };
  }
}
