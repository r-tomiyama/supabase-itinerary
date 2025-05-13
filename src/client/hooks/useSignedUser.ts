import { useState, useEffect } from "react";
import { createClient } from "@services/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/types/types";

interface SignedUserState {
  user: User;
  userProfile: UserProfile;
}

export const useSignedUser = () => {
  const [state, setState] = useState<SignedUserState>({} as SignedUserState);

  useEffect(() => {
    const fetchUser = async () => {

        const supabase = await createClient();
        
        const {
          data: { user },
        } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }

        const profile = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url, created_at")
          .eq("id", user.id)
          .single();

        if (!profile.data) {
          throw new Error("Profile not found");
        }
        
        setState({
          user,
          userProfile: profile.data,
        });

    };

    fetchUser();
  }, []);

  return state;
};
