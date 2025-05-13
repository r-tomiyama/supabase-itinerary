"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { encodedRedirect } from "@libs/utils";
import { createClient } from "@services/supabase/server";

export const forgotPasswordAction = async (formData: FormData) => {
  // FormDataから値を安全に取得
  const emailValue = formData.get("email");
  // nullチェックとプリミティブ型への変換を行う
  const email = typeof emailValue === "string" ? emailValue : undefined;

  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrlValue = formData.get("callbackUrl");
  const callbackUrl =
    typeof callbackUrlValue === "string" ? callbackUrlValue : undefined;

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin ?? ""}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};
