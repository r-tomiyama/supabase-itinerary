import Hero from "@/components/hero";
import { redirect } from "next/navigation";

export default function Home() {
  redirect(`/protected/trips`);
}
