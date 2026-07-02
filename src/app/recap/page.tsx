"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import UserSetupModal from "@/components/UserSetupModal";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";
import { supabase } from "@/lib/supabase";
import { Calendar, TrendingDown, TrendingUp } from "lucide-react";

export default function RecapPage() {
  const { userData, loading, isNewUser } = useUser();
  const [recap, setRecap] = useState<{
    totalDays: number;
    avgDaily: number;
    bestDay: number;
    worstDay: number;
    trend: number; // % change first half vs second half of month
  } | null>(null);
  const [loadingRecap, setLoadingRecap] = useState(true);

  useEffect(() => {
    async function load() {
      if (!userData?.id) return;
      setLoadingRecap(true);

      const { data: logs } = await supabase
        .from("emission_logs")
        .select("log_date, total_emission")
        .eq("user_id", userData.id)
        .order("log_date", { ascending: true })
        .limit(30);

      if (!logs || logs.length === 0) {
        setRecap(null);
        setLoadingRecap(false);
        return;
      }

      const values = logs.map((l) => Number(l.total_emission));
      const mid = Math.floor(values.length / 2);
      const firstHalf = values.slice(0, mid);
      const secondHalf = values.slice(mid);

      const avg = (arr: number[]) =>
        arr.reduce((a, b) => a + b, 0) / (arr.length || 1);

      const firstAvg = avg(firstHalf);
      const secondAvg = avg(secondHalf);
      const trend =
        firstAvg === 0 ? 0 : Math.round(((secondAvg - firstAvg) / firstAvg) * 100);

      setRecap({
        totalDays: values.length,
        avgDaily: Math.round(avg(values)),
        bestDay: Math.round(Math.min(...values)),
        worstDay: Math.round(Math.max(...values)),
        trend,
      });
      setLoadingRecap(false);
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
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Monthly Recap</h1>
      <p className="text-zinc-400 mb-8">
        Auto-generated summary of your last 30 days
      </p>

      {loadingRecap ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : !recap ? (
        <EmptyState
          icon={Calendar}
          title="No history yet"
          description="Keep logging your data daily — your monthly recap will appear here once you have a few days of history."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-zinc-400 text-sm">Days Tracked</p>
            <p className="text-4xl font-bold mt-2">{recap.totalDays}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-zinc-400 text-sm">Avg Daily Emission</p>
            <p className="text-4xl font-bold mt-2">{recap.avgDaily}</p>
            <p className="text-zinc-500 text-xs">kg CO₂</p>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
            <p className="text-zinc-400 text-sm">Best Day</p>
            <p className="text-4xl font-bold mt-2 text-green-400">
              {recap.bestDay}
            </p>
            <p className="text-zinc-500 text-xs">kg CO₂</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col">
            <p className="text-zinc-400 text-sm">Trend</p>
            <div className="flex items-center gap-2 mt-2">
              {recap.trend <= 0 ? (
                <TrendingDown size={28} className="text-green-400" />
              ) : (
                <TrendingUp size={28} className="text-red-400" />
              )}
              <p
                className={`text-3xl font-bold ${
                  recap.trend <= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {Math.abs(recap.trend)}%
              </p>
            </div>
            <p className="text-zinc-500 text-xs mt-1">
              {recap.trend <= 0 ? "improved" : "increased"} vs first half of period
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
