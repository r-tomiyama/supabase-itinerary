import { createClient } from "@/services/supabase/client";

type UpdatePackingItemResult = {
  success: boolean;
  error: string | null;
};

export async function updatePackingItem(
  itemId: string,
  data: {
    name?: string;
    quantity?: number;
    is_packed?: boolean;
    category?: string | null;
    category_color?: string | null;
    assigned_to?: string | null;
    notes?: string | null;
  }
): Promise<UpdatePackingItemResult> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from("packing_items")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId);
    
  if (error) {
    return {
      success: false,
      error: error.message
    };
  }
  
  return {
    success: true,
    error: null
  };
}

// 持ち物のパック状態を切り替えるための便利な関数
export async function togglePackingItemPacked(
  itemId: string,
  isPacked: boolean
): Promise<UpdatePackingItemResult> {
  return updatePackingItem(itemId, { is_packed: isPacked });
}
