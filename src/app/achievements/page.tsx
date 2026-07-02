"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import UserSetupModal from "@/components/UserSetupModal";
import { BADGES } from "@/lib/badges";
import { getEarnedBadgeKeys } from "@/lib/useBadges";

export default function AchievementsPage() {
  const { userData, loading, isNewUser } = useUser();
  const [earned, setEarned] = useState<string[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(true);

  useEffect(() => {
    async function load() {
      if (!userData?.id) return;
      setLoadingBadges(true);
      const keys = await getEarnedBadgeKeys(userData.id);
      setEarned(keys);
      setLoadingBadges(false);
    }
    load();
  }, [userData?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isNewUser || !userData) return <UserSetupModal />;

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Achievements</h1>
      <p className="text-zinc-400 mb-8">
        {loadingBadges
          ? "Loading your badges..."
          : `${earned.length} of ${BADGES.length} badges earned`}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {BADGES.map((badge) => {
          const isEarned = earned.includes(badge.key);
          return (
            <div
              key={badge.key}
              className={`rounded-2xl p-5 border transition ${
                isEarned
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-white/5 border-white/10 opacity-50"
              }`}
            >
              <div className="text-3xl mb-3">{badge.emoji}</div>
              <h3 className="font-semibold mb-1">{badge.title}</h3>
              <p className="text-sm text-zinc-400">{badge.description}</p>
              {isEarned && (
                <span className="inline-block mt-3 text-xs font-medium text-green-400 bg-green-500/15 px-2 py-1 rounded-full">
                  Earned
                </span>
              )}
              {!isEarned && (
                <span className="inline-block mt-3 text-xs font-medium text-zinc-500 bg-white/5 px-2 py-1 rounded-full">
                  Locked
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
