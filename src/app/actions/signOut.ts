"use server";

import { redirect } from "next/navigation";

import { createClient } from "@services/supabase/server";

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
