import { redirect } from "next/navigation";

import { getSignedUser } from "@/services/user/getSignedUser";

export default async function Home() {
  try {
    await getSignedUser();

    redirect("/protected");
  } catch {
    redirect("/sign-in");
  }
}
