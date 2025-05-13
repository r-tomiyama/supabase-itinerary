import { createBrowserClient } from "@supabase/ssr";

import { Database } from "@libs/supabase.types";

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
  );
