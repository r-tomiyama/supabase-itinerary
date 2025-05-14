import { createClient } from "@/services/supabase/client";

export interface FindUserByEmailResult {
  user: {
    id: string;
    display_name: string;
    email: string;
  } | null;
  error: string | null;
}

export const findUserByEmail = async (
  email: string,
): Promise<FindUserByEmailResult> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, email")
    .eq("email", email)
    .single();

  if (error) {
    return {
      user: null,
      error: "ユーザーが見つかりませんでした",
    };
  }

  return {
    user: data,
    error: null,
  };
};
