import { Database } from "@libs/supabase.types";
import { createClient } from "@services/supabase/client";

export interface TripFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  budget_total: number;
}

interface CreateTripResult {
  trip: Database["public"]["Tables"]["trips"]["Row"] | null;
  error: string | null;
}

/**
 * トリップを作成し、作成者をメンバーとして登録する
 * @param formData トリップのフォームデータ
 * @param userId ユーザーID
 * @returns 作成されたトリップと発生したエラー
 */
export async function createTrip(
  formData: TripFormData,
  userId: string,
): Promise<CreateTripResult> {
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

    // 1. トリップを作成
    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .insert([
        {
          title: formData.title,
          description: formData.description,
          start_date: formData.start_date,
          end_date: formData.end_date,
          budget_total: formData.budget_total,
          owner_id: userId,
        },
      ])
      .select()
      .single();

    if (tripError) {
      return {
        trip: null,
        error: tripError.message,
      };
    }

    // 2. 作成者をトリップメンバーとして登録
    const { error: memberError } = await supabase.from("trip_members").insert([
      {
        trip_id: trip.id,
        user_id: userId,
        role: "owner", // 作成者は所有者
      },
    ]);

    if (memberError) {
      return {
        trip: null,
        error: memberError.message
          ? memberError.message
          : "メンバー登録に失敗しました",
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
