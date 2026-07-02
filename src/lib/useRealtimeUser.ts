"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Subscribes to live Postgres changes on this user's row (and their emission
// logs), calling onUpdate whenever something changes — even from another tab
// or another device sharing the same profile. Free on Supabase's free tier.
export function useRealtimeUser(userId: string | undefined, onUpdate: () => void) {
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`user-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users", filter: `id=eq.${userId}` },
        () => onUpdate()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "emission_logs",
          filter: `user_id=eq.${userId}`,
        },
        () => onUpdate()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
}
