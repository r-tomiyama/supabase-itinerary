import { Database } from "@/libs/supabase.types";

export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];
