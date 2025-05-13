import { createClient } from "@services/supabase/server";
import { redirect } from "next/navigation";

export const getSignedUser = async () => {
    const supabase = await createClient();
    
    const {
        data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
        redirect("/sign-in");
    }

    const profile = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .eq("id", user.id)
        .single();

    if (!profile.data) {
        redirect("/sign-in");
    }
    
    return {user, profile: profile.data };
    }
