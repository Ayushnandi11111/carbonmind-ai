"use client";

import { Flame } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function StreakBadge() {
  const { userData } = useUser();

  if (!userData) return null;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/15 border border-orange-500/25 text-orange-400 text-xs font-medium">
      <Flame size={14} />
      <span>{userData.streakCount} day streak</span>
    </div>
  );
}
