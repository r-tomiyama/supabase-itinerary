"use server";

import { encodedRedirect } from "@libs/utils";
import { createClient } from "@services/supabase/server";
import { headers } from "next/headers";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString() || email?.split('@')[0] || 'User';
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  // サインアップを試みる
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } 
  
  // 認証が成功した場合、profilesテーブルにレコードを追加
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        display_name: name,
        created_at: new Date().toISOString()
      });

    if (profileError) {
      console.error("プロフィール作成エラー:", profileError.message);
      // プロフィール作成エラーでも認証自体は成功しているため、続行
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};
