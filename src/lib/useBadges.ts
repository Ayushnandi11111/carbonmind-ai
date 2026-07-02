"use client";

import { supabase } from "@/lib/supabase";
import { evaluateBadges } from "@/lib/badges";

type AwardInput = {
  userId: string;
  streakCount: number;
  carbonScore: number;
  food: string;
  hasGoal: boolean;
  goalMetThisWeek: boolean;
  profileCount: number;
  isFirstSave?: boolean;
};

// Awards any newly-qualifying badges. Relies on the DB's unique(user_id, badge_key)
// constraint to silently no-op on already-earned badges, so callers don't need
// to track "did I already give this one" themselves.
export async function awardEligibleBadges(input: AwardInput) {
  const keys = evaluateBadges({
    streakCount: input.streakCount,
    carbonScore: input.carbonScore,
    food: input.food,
    hasGoal: input.hasGoal,
    goalMetThisWeek: input.goalMetThisWeek,
    profileCount: input.profileCount,
    isFirstSave: !!input.isFirstSave,
  });

  if (keys.length === 0) return [];

  const rows = keys.map((badge_key) => ({
    user_id: input.userId,
    badge_key,
  }));

  // upsert with ignoreDuplicates so re-earning doesn't error or double-insert
  const { error } = await supabase
    .from("badges")
    .upsert(rows, { onConflict: "user_id,badge_key", ignoreDuplicates: true });

  if (error) {
    console.error("Badge award error:", error.message);
    return [];
  }

  return keys;
}

export async function getEarnedBadgeKeys(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("badges")
    .select("badge_key")
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to load badges:", error.message);
    return [];
  }

  return (data || []).map((r) => r.badge_key);
}
