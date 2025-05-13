import { createClient } from "@/services/supabase/client";

export interface ShareTripResult {
  success: boolean;
  error: string | null;
}

/**
 * 旅行を他のユーザーと共有する
 * @param tripId 共有する旅行のID
 * @param userId 共有先のユーザーID
 * @param currentUserId リクエスト元のユーザーID（オーナー権限チェック用）
 * @returns 処理結果
 */
export const shareTrip = async (
  tripId: string,
  userId: string,
  currentUserId: string,
): Promise<ShareTripResult> => {
  const supabase = await createClient();

  // 現在のユーザーが旅行のオーナーであることを確認
  const { data: tripMember, error: memberError } = await supabase
    .from("trip_members")
    .select("role")
    .eq("trip_id", tripId)
    .eq("user_id", currentUserId)
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

  // 既に共有されているか確認
  const { data: existingMember } = await supabase
    .from("trip_members")
    .select("*")
    .eq("trip_id", tripId)
    .eq("user_id", userId)
    .single();

  if (existingMember) {
    return {
      success: false,
      error: "既にこのユーザーと共有されています",
    };
  }

  // 共有設定を追加
  const { error: insertError } = await supabase.from("trip_members").insert([
    {
      trip_id: tripId,
      user_id: userId,
      role: "editor", // 要件に基づき、全ての共有相手はeditorロール
    },
  ]);

  if (insertError) {
    return {
      success: false,
      error: insertError.message,
    };
  }

  return {
    success: true,
    error: null,
  };
};
