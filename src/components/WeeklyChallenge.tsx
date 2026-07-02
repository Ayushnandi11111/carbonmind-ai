"use client";

import { getWeeklyChallenge } from "@/lib/weeklyChallenge";
import { Flag } from "lucide-react";

export default function WeeklyChallenge() {
  const challenge = getWeeklyChallenge();

  return (
    <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center shrink-0">
        <Flag size={18} className="text-purple-400" />
      </div>
      <div>
        <p className="text-xs text-purple-300 font-medium mb-0.5">
          This Week's Challenge
        </p>
        <p className="text-sm text-zinc-200">
          {challenge.emoji} {challenge.text}
        </p>
      </div>
    </div>
  );
}
