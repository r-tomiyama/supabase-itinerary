import { createClient } from "@/services/supabase/server";
import { getSignedUser } from "@/services/user/getSignedUser";

export const fetcher = async (tripId: string) => {
  const supabase = await createClient();
  const { user } = await getSignedUser();

  // 旅行情報を取得
  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();

  // ユーザーのメンバーシップを確認
  const { data: membership } = await supabase
    .from("trip_members")
    .select("*")
    .eq("trip_id", tripId)
    .eq("user_id", user.id)
    .single();

  // 旅行メンバー一覧を取得
  const { data: tripMembers } = await supabase
    .from("trip_members")
    .select("*, profiles(id, email, display_name, avatar_url)")
    .eq("trip_id", tripId);

  // パッキングアイテムを取得
  const { data: packingItems } = await supabase
    .from("packing_items")
    .select("*, profiles(*)")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });

  // パッキングアイテムの型定義
  interface PackingItem {
    id: string;
    name: string;
    quantity: number;
    category: string | null;
    category_color?: string | null;
    assigned_to: string | null;
    is_packed: boolean;
    notes?: string | null;
    profiles?: {
      display_name: string | null;
      email: string;
    } | null;
  }

  // カテゴリごとにアイテムをグループ化
  const categorizedItems = (packingItems || []).reduce<
    Record<string, PackingItem[]>
  >((acc, item) => {
    const category = item.category || "未分類";
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // カテゴリの一覧を取得（重複なし）
  const categories = packingItems
    ? Array.from(new Set(packingItems.map((item) => item.category || "未分類")))
    : [];

  return {
    trip,
    membership,
    tripMembers,
    packingItems,
    categorizedItems,
    categories,
  };
};
