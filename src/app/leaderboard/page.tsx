"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { supabase, DbUser } from "@/lib/supabase";
import { calcTotalEmission, calcCarbonScore } from "@/lib/emissions";
import UserSetupModal from "@/components/UserSetupModal";
import Skeleton from "@/components/Skeleton";
import EmptyState from "@/components/EmptyState";

type RankedUser = {
  id: string;
  displayName: string;
  score: number;
  isMe: boolean;
};

export default function LeaderboardPage() {
  const { userData, loading, isNewUser } = useUser();
  const [ranked, setRanked] = useState<RankedUser[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .limit(200);

      if (error || !data) {
        setFetching(false);
        return;
      }

      const computed = (data as DbUser[]).map((row, i) => {
        const { total } = calcTotalEmission({
          transport: row.transport,
          distance: Number(row.distance),
          electricity: Number(row.electricity),
          food: row.food,
          water: Number(row.water || 0),
          shopping: Number(row.shopping || 0),
          flights: Number(row.flights || 0),
        });

        return {
          id: row.id,
          displayName:
            row.id === userData?.id
              ? `${row.profile_name || row.name} (You)`
              : `Eco Explorer #${i + 1}`,
          score: calcCarbonScore(total),
          isMe: row.id === userData?.id,
        };
      });

      computed.sort((a, b) => b.score - a.score);
      setRanked(computed.slice(0, 20));
      setFetching(false);
    }

    loadLeaderboard();
  }, [userData?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isNewUser || !userData) {
    return <UserSetupModal />;
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Leaderboard</h1>
      <p className="text-zinc-400 mb-8">
        See how your carbon score compares — all profiles shown anonymously.
      </p>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-4 sm:p-6">
        {fetching ? (
          <div className="space-y-2">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        ) : ranked.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="No rankings yet"
            description="Once more profiles save their data, you'll see how you compare here."
          />
        ) : (
          <div className="space-y-2">
            {ranked.map((r, idx) => (
              <div
                key={r.id}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl ${
                  r.isMe
                    ? "bg-green-500/15 border border-green-500/25"
                    : "bg-black/20 border border-white/5"
                }`}
              >
                <div className="w-8 text-center font-bold text-zinc-400">
                  {idx === 0 ? (
                    <Trophy size={18} className="text-yellow-400 mx-auto" />
                  ) : idx === 1 ? (
                    <Medal size={18} className="text-zinc-300 mx-auto" />
                  ) : idx === 2 ? (
                    <Medal size={18} className="text-orange-400 mx-auto" />
                  ) : (
                    idx + 1
                  )}
                </div>

                <span
                  className={`flex-1 ${r.isMe ? "font-semibold text-white" : "text-zinc-300"}`}
                >
                  {r.displayName}
                </span>

                <span className="font-bold text-green-400">{r.score}/100</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
