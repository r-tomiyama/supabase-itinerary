import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

import { UserProfile } from "@/types/types";
import { createClient } from "@services/supabase/client";

interface SignedUserState {
  user?: User;
  userProfile?: UserProfile;
}

export const useSignedUser = () => {
  const [state, setState] = useState<SignedUserState>({});

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, created_at, email")
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

    fetchUser(); // eslint-disable-line @typescript-eslint/no-floating-promises
  }, []);

  return state;
};
