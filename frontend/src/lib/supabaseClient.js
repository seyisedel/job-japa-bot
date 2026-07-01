import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const USE_MOCK_DATA =
  (process.env.REACT_APP_USE_MOCK_DATA || "").toLowerCase() === "true" ||
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes("your-project") ||
  supabaseAnonKey.includes("your-anon-key");

export const supabase = USE_MOCK_DATA
  ? null
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: "jobjapa.admin.auth",
      },
    });
