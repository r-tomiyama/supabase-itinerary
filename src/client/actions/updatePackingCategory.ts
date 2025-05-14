import { createClient } from "@/services/supabase/client";

interface UpdatePackingCategoryResult {
  success: boolean;
  error: string | null;
}

/**
 * カテゴリ名を一括で変更するアクション
 * @param tripId 旅行ID
 * @param oldCategory 変更前のカテゴリ名
 * @param newCategory 変更後のカテゴリ名
 */
export async function updatePackingCategory(
  tripId: string,
  oldCategory: string,
  newCategory: string,
): Promise<UpdatePackingCategoryResult> {
  const supabase = createClient();

  // 同じカテゴリに属するすべてのアイテムを取得
  const { data: items, error: fetchError } = await supabase
    .from("packing_items")
    .select("id")
    .eq("trip_id", tripId)
    .eq("category", oldCategory);

  if (fetchError) {
    return {
      success: false,
      error: fetchError.message,
    };
  }

  if (items.length === 0) {
    return {
      success: false,
      error: "指定されたカテゴリのアイテムが見つかりません",
    };
  }

  // すべてのアイテムのカテゴリを一括で更新
  const { error: updateError } = await supabase
    .from("packing_items")
    .update({
      category: newCategory,
      updated_at: new Date().toISOString(),
    })
    .eq("trip_id", tripId)
    .eq("category", oldCategory);

  if (updateError) {
    return {
      success: false,
      error: updateError.message,
    };
  }

  return {
    success: true,
    error: null,
  };
}
