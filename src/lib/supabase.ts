import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DbUser = {
  id: string;
  device_id: string;
  profile_name: string;
  name: string;
  transport: string;
  distance: number;
  electricity: number;
  food: string;
  water: number;
  shopping: number;
  flights: number;
  streak_count: number;
  last_checkin_date: string | null;
  created_at: string;
  updated_at: string;
};

export type EmissionLog = {
  id: string;
  user_id: string;
  log_date: string;
  transport_emission: number;
  electricity_emission: number;
  food_emission: number;
  total_emission: number;
  created_at: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  role: "user" | "ai";
  content: string;
  created_at: string;
};

export type Goal = {
  id: string;
  user_id: string;
  target_emission: number;
  period: "weekly" | "monthly";
  active: boolean;
  created_at: string;
};
