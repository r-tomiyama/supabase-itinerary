import { Database } from "@/libs/supabase.types";
import { createClient } from "@/services/supabase/client";

export interface PackingItemFormData {
  name: string;
  quantity: number;
  category: string | null;
  category_color: string | null;
  assigned_to: string | null;
  notes: string | null;
}

interface CreatePackingItemResult {
  item: Database["public"]["Tables"]["packing_items"]["Row"] | null;
  error: string | null;
}

export async function createPackingItem(
  formData: PackingItemFormData,
  tripId: string,
): Promise<CreatePackingItemResult> {
  const supabase = createClient();

  const { data: item, error } = await supabase
    .from("packing_items")
    .insert([
      {
        trip_id: tripId,
        name: formData.name,
        quantity: formData.quantity || 1,
        is_packed: false,
        category: formData.category,
        category_color: formData.category_color,
        assigned_to: formData.assigned_to,
        notes: formData.notes,
      },
    ])
    .select()
    .single();

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (error || !item) {
    return {
      item: null,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      error: error?.message || "持ち物の作成に失敗しました",
    };
  }

  return {
    item,
    error: null,
  };
}
