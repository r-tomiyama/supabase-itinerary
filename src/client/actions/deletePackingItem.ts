import { createClient } from "@/services/supabase/client";

type DeletePackingItemResult = {
  success: boolean;
  error: string | null;
};

export async function deletePackingItem(
  itemId: string
): Promise<DeletePackingItemResult> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from("packing_items")
    .delete()
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
