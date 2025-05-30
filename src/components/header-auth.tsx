import Link from "next/link";

import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/services/supabase/check-env-vars";
import { createClient } from "@/services/supabase/server";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user
    ? await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single()
    : null;

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex items-center gap-4">
          <div>
            <Badge
              variant="default"
              className="pointer-events-none font-normal"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              disabled
              className="pointer-events-none cursor-none opacity-75"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="default"
              disabled
              className="pointer-events-none cursor-none opacity-75"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-right">Hey, {profile?.data?.display_name}!</span>
      <form action={signOutAction}>
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
